// API Configuration
const QUIZ_API_URL = "https://opentdb.com/api.php?amount=10&type=multiple";

// Game State
let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];
let hasAnswered = false;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsModal = document.getElementById('results-modal');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const newQuizBtn = document.getElementById('new-quiz-btn');
const closeModalBtn = document.getElementById('close-modal');
const modalOverlay = document.querySelector('.modal-overlay');

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const feedbackElement = document.getElementById('feedback');

const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const currentScoreElement = document.getElementById('current-score');
const progressFillElement = document.getElementById('progress-fill');

const finalScoreElement = document.getElementById('final-score');
const totalScoreElement = document.getElementById('total-score');
const correctCountElement = document.getElementById('correct-count');
const wrongCountElement = document.getElementById('wrong-count');
const accuracyElement = document.getElementById('accuracy');
const scoreMessageElement = document.getElementById('score-message');
const resultIconElement = document.getElementById('result-icon');

const bestScoreElement = document.getElementById('best-score');
const gamesPlayedElement = document.getElementById('games-played');

// Loading elements
const quizContent = document.querySelector('.quiz-content');
const quizHeader = document.querySelector('.quiz-header');

// Initialize stats from localStorage
function loadStats() {
    const bestScore = localStorage.getItem('bestScore') || 0;
    const gamesPlayed = localStorage.getItem('gamesPlayed') || 0;
    bestScoreElement.textContent = bestScore;
    gamesPlayedElement.textContent = gamesPlayed;
}

// Save stats to localStorage
function saveStats() {
    const currentBest = parseInt(localStorage.getItem('bestScore') || 0);
    if (score > currentBest) {
        localStorage.setItem('bestScore', score);
        bestScoreElement.textContent = score;
    }
    const gamesPlayed = parseInt(localStorage.getItem('gamesPlayed') || 0);
    localStorage.setItem('gamesPlayed', gamesPlayed + 1);
    gamesPlayedElement.textContent = gamesPlayed + 1;
}

// Decode HTML entities
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Fetch Questions from API
async function fetchQuestions() {
    try {
        const response = await fetch(QUIZ_API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        const data = await response.json();

        // Convert API format to our format
        return data.results.map(q => {
            const allAnswers = [...q.incorrect_answers, q.correct_answer];
            const shuffledAnswers = shuffleArray(allAnswers);
            const correctIndex = shuffledAnswers.indexOf(q.correct_answer);

            return {
                question: decodeHTML(q.question),
                answers: shuffledAnswers.map(a => decodeHTML(a)),
                correct: correctIndex
            };
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
}

// Show loading state
function showLoading() {
    questionElement.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading questions...</div>';
    answersElement.innerHTML = '';
}

// Show error message
function showError() {
    questionElement.innerHTML = '<div class="error"><i class="fas fa-exclamation-triangle"></i> Failed to load questions. Please try again.</div>';
    answersElement.innerHTML = '';

    const retryBtn = document.createElement('button');
    retryBtn.className = 'main-button';
    retryBtn.innerHTML = '<i class="fas fa-rotate-right button-icon"></i> Retry';
    retryBtn.onclick = startQuiz;
    answersElement.appendChild(retryBtn);
}

// Start Quiz
async function startQuiz() {
    // Reset game state
    currentQuestionIndex = 0;
    score = 0;
    hasAnswered = false;

    // Switch to quiz screen
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');

    // Show loading state
    showLoading();

    try {
        // Fetch questions from API
        selectedQuestions = await fetchQuestions();

        // Update UI
        totalQuestionsElement.textContent = selectedQuestions.length;
        currentScoreElement.textContent = score;

        // Load first question
        loadQuestion();
    } catch (error) {
        // Show error message
        showError();
    }
}

// Load Question
function loadQuestion() {
    hasAnswered = false;
    nextBtn.style.display = 'none';
    feedbackElement.classList.remove('show', 'correct', 'wrong');

    const currentQuestion = selectedQuestions[currentQuestionIndex];

    // Update question number and progress
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;
    progressFillElement.style.width = `${progress}%`;

    // Display question
    questionElement.textContent = currentQuestion.question;

    // Clear and create answer buttons
    answersElement.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.innerHTML = `
            <span class="answer-letter">${letters[index]}</span>
            <span>${answer}</span>
        `;
        button.addEventListener('click', () => selectAnswer(index));
        answersElement.appendChild(button);
    });
}

// Select Answer
function selectAnswer(selectedIndex) {
    if (hasAnswered) return;

    hasAnswered = true;
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const answerButtons = document.querySelectorAll('.answer-btn');

    // Check if answer is correct
    const isCorrect = selectedIndex === currentQuestion.correct;

    if (isCorrect) {
        score++;
        currentScoreElement.textContent = score;
        answerButtons[selectedIndex].classList.add('correct');
        feedbackElement.textContent = '✓ Correct! Well done!';
        feedbackElement.classList.add('show', 'correct');
    } else {
        answerButtons[selectedIndex].classList.add('wrong');
        answerButtons[currentQuestion.correct].classList.add('correct');
        feedbackElement.textContent = `✗ Wrong! The correct answer is ${currentQuestion.answers[currentQuestion.correct]}.`;
        feedbackElement.classList.add('show', 'wrong');
    }

    // Disable all buttons
    answerButtons.forEach(btn => btn.classList.add('disabled'));

    // Show next button or finish
    if (currentQuestionIndex < selectedQuestions.length - 1) {
        nextBtn.style.display = 'flex';
    } else {
        nextBtn.innerHTML = 'See Results <i class="fas fa-trophy button-icon"></i>';
        nextBtn.style.display = 'flex';
    }
}

// Next Question
function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < selectedQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Show Results
function showResults() {
    // Calculate stats
    const totalQuestions = selectedQuestions.length;
    const correctAnswers = score;
    const wrongAnswers = totalQuestions - score;
    const accuracy = Math.round((score / totalQuestions) * 100);

    // Update results
    finalScoreElement.textContent = score;
    totalScoreElement.textContent = totalQuestions;
    correctCountElement.textContent = correctAnswers;
    wrongCountElement.textContent = wrongAnswers;
    accuracyElement.textContent = `${accuracy}%`;

    // Set message and icon based on score
    let message = '';
    let iconClass = '';

    if (accuracy === 100) {
        message = 'Perfect Score! You\'re a genius!';
        iconClass = 'fas fa-trophy';
        resultIconElement.style.color = '#fbbf24'; // Gold
    } else if (accuracy >= 80) {
        message = 'Excellent work! Keep it up!';
        iconClass = 'fas fa-medal';
        resultIconElement.style.color = '#10b981'; // Green
    } else if (accuracy >= 60) {
        message = 'Good job! You\'re doing great!';
        iconClass = 'fas fa-star';
        resultIconElement.style.color = '#6366f1'; // Purple
    } else if (accuracy >= 40) {
        message = 'Not bad! Keep practicing!';
        iconClass = 'fas fa-book';
        resultIconElement.style.color = '#f59e0b'; // Orange
    } else {
        message = 'Keep learning! You\'ll do better next time!';
        iconClass = 'fas fa-seedling';
        resultIconElement.style.color = '#84cc16'; // Lime
    }

    scoreMessageElement.textContent = message;
    resultIconElement.className = iconClass + ' icon-result';

    // Save stats
    saveStats();

    // Show modal instead of switching screens
    resultsModal.classList.add('active');
}

// Close Modal
function closeModal() {
    resultsModal.classList.remove('active');
}

// Restart Quiz (Start new quiz immediately)
function restartQuiz() {
    closeModal();
    startQuiz();
}

// Go to Main Menu
function goToMainMenu() {
    closeModal();
    quizScreen.classList.remove('active');
    startScreen.classList.add('active');
    loadStats(); // Reload stats to show updated values
}

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);
newQuizBtn.addEventListener('click', goToMainMenu);
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resultsModal.classList.contains('active')) {
        closeModal();
    }
});

// Initialize
loadStats();
