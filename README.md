# 🎯 Interactive Quiz Game - API Learning Project

A modern, interactive quiz game built with **HTML, CSS, and JavaScript** that fetches random questions from an external API. This project demonstrates API integration, DOM manipulation, and modern UI design with animated backgrounds.

![Project Status](https://img.shields.io/badge/Status-Learning%20Project-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 📚 About This Project

This is a **learning project** created to practice and demonstrate:
- 🌐 **API Integration** - Fetching data from external APIs using `fetch()`
- 🎨 **Modern UI/UX Design** - Animated gradients, glassmorphism, and modal popups
- ⚡ **Async JavaScript** - Handling asynchronous operations with async/await
- 📱 **Responsive Design** - Mobile-friendly interface
- 🎭 **DOM Manipulation** - Dynamic content rendering
- ✨ **CSS Animations** - Smooth transitions and gradient flows

---

## ✨ Features

### 🎮 Core Functionality
- ✅ **Real-time API Integration** - Fetches 10 random quiz questions from [Open Trivia Database API](https://opentdb.com/)
- ✅ **Dynamic Question Loading** - Every game has different questions
- ✅ **Instant Feedback** - Immediate visual feedback on correct/wrong answers
- ✅ **Score Tracking** - Track your score throughout the quiz
- ✅ **Local Storage** - Saves your best score and total games played
- ✅ **Modal Results** - Beautiful popup showing your final score

### 🎨 Design Features
- 🌈 **Animated Gradient Background** - Smoothly flowing multi-color gradient (15s loop)
- 🔮 **Glassmorphism Cards** - Semi-transparent cards with backdrop blur
- 🎯 **Font Awesome Icons** - Professional icons instead of emojis
- 📊 **Progress Bar** - Visual progress tracking through the quiz
- 💫 **Smooth Animations** - Fade-ins, slide-ups, and hover effects
- 🎭 **Loading States** - Spinner animation while fetching questions
- ⚠️ **Error Handling** - User-friendly error messages with retry option

### 🔧 Technical Features
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop
- 🚀 **Fast Loading** - Optimized performance
- ♿ **Keyboard Navigation** - ESC key closes modal
- 🔄 **State Management** - Clean game state handling
- 🎲 **Answer Shuffling** - Randomized answer positions

---

## 🚀 Live Demo (Local Setup)

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs directly in browser!

### Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/API-final.git
   cd API-final/API/API/API
   ```

2. **Open in browser**
   ```bash
   # Option 1: Direct open
   open index.html  # Mac
   start index.html # Windows
   xdg-open index.html # Linux

   # Option 2: Use Live Server (VS Code)
   # Right-click on index.html → "Open with Live Server"

   # Option 3: Python HTTP Server
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

3. **Start playing!** 🎉

---

## 🎯 How to Play

1. **Start Screen**
   - View your best score and games played
   - Read the instructions
   - Click "Start Quiz" to begin

2. **Quiz Screen**
   - Read each question carefully
   - Click on your answer (A, B, C, or D)
   - Get instant feedback (correct/wrong)
   - Click "Next Question" to continue

3. **Results Modal**
   - View your final score
   - See detailed statistics (correct, wrong, accuracy)
   - **Play Again** - Start a new quiz immediately
   - **Main Menu** - Return to start screen

---

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, animations, flexbox, grid
- **JavaScript (ES6+)** - Async/await, fetch API, DOM manipulation

### External Resources
- **[Open Trivia Database API](https://opentdb.com/)** - Free quiz questions
- **[Font Awesome 6.4.0](https://fontawesome.com/)** - Icon library
- **[Google Fonts - Poppins](https://fonts.google.com/)** - Typography

---

## 📁 Project Structure

```
API-final/
└── API/
    └── API/
        └── API/
            ├── index.html       # Main HTML file
            ├── api.js           # JavaScript logic & API calls
            ├── stylesheet.css   # All styles & animations
            └── img/
                └── background.png
```

---

## 🎨 Color Palette

The animated gradient uses 6 vibrant colors:

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Coral Red | `#ee7752` | Gradient flow |
| Hot Pink | `#e73c7e` | Gradient flow |
| Ocean Blue | `#23a6d5` | Gradient flow |
| Turquoise | `#23d5ab` | Gradient flow |
| Purple | `#667eea` | Gradient flow |
| Magenta | `#764ba2` | Gradient flow |

---

## 📖 API Documentation

### Open Trivia Database API

**Endpoint Used:**
```
https://opentdb.com/api.php?amount=10&type=multiple
```

**Parameters:**
- `amount=10` - Number of questions
- `type=multiple` - Multiple choice questions only

**Response Format:**
```javascript
{
  "response_code": 0,
  "results": [
    {
      "question": "Question text",
      "correct_answer": "Correct answer",
      "incorrect_answers": ["Wrong 1", "Wrong 2", "Wrong 3"],
      "category": "Category name",
      "difficulty": "easy|medium|hard"
    }
  ]
}
```

---

## 🧠 What I Learned

### API Integration
- ✅ Using `fetch()` to make HTTP requests
- ✅ Handling promises with `async/await`
- ✅ Parsing JSON responses
- ✅ Error handling for network failures
- ✅ Decoding HTML entities from API responses

### JavaScript Skills
- ✅ DOM manipulation and event listeners
- ✅ Local storage for data persistence
- ✅ Array methods (map, shuffle, slice)
- ✅ Template literals for dynamic content
- ✅ State management patterns

### CSS Techniques
- ✅ CSS custom properties (variables)
- ✅ Keyframe animations
- ✅ Gradient backgrounds with animation
- ✅ Glassmorphism (backdrop-filter)
- ✅ Flexbox and Grid layouts
- ✅ Responsive design with media queries

### UX/UI Design
- ✅ Loading states and user feedback
- ✅ Modal dialogs and overlays
- ✅ Smooth transitions and animations
- ✅ Color theory and accessibility
- ✅ Icon usage for better visual communication

---

## 🐛 Known Issues / Future Improvements

### Current Limitations
- ❌ No difficulty selection (uses mixed difficulties)
- ❌ No category selection
- ❌ No timer/time limit
- ❌ Questions are limited to API availability

### Future Enhancements
- 🔜 Add difficulty selector (Easy, Medium, Hard)
- 🔜 Category selection (Science, History, Sports, etc.)
- 🔜 Timer mode for competitive play
- 🔜 Leaderboard functionality
- 🔜 Sound effects and animations
- 🔜 Share score on social media
- 🔜 Multiplayer mode
- 🔜 Question bookmarking/favorites
- 🔜 Offline mode with cached questions

---

## 🤝 Contributing

This is a learning project, but suggestions and feedback are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is created for **educational purposes** and is free to use.

---

## 👤 Author

**Maria** (Learning Project)

- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

---

## 🙏 Acknowledgments

- **[Open Trivia Database](https://opentdb.com/)** - For providing free quiz questions
- **[Font Awesome](https://fontawesome.com/)** - For amazing icons
- **[Google Fonts](https://fonts.google.com/)** - For the Poppins font
- **Web Development Community** - For tutorials and inspiration

---

## 📸 Screenshots

### Start Screen
Clean, modern interface with animated gradient background

### Quiz Screen
Interactive questions with instant feedback

### Results Modal
Beautiful popup showing detailed statistics

---

## 🎓 Learning Resources

If you're learning web development, check out these resources:
- [MDN Web Docs](https://developer.mozilla.org/) - Comprehensive web development documentation
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial
- [CSS-Tricks](https://css-tricks.com/) - CSS tips and tricks
- [freeCodeCamp](https://www.freecodecamp.org/) - Free coding courses

---

**⭐ If you found this project helpful, please give it a star!**

---

*Made with ❤️ as a learning project*
