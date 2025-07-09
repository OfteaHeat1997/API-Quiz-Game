"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigureButton = exports.OpenSettingsButton = void 0;
exports.showErrorMessage = showErrorMessage;
const vscode = require("vscode");
/**
 * Represents a button that, when clicked, will open a particular VS Code setting.
 */
class OpenSettingsButton {
    constructor(settingId) {
        this.settingId = settingId;
        this.label = "Open Settings";
    }
    action() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield vscode.commands.executeCommand("workbench.action.openSettings", (_a = this.settingId) !== null && _a !== void 0 ? _a : "@ext:llvm-vs-code-extensions.lldb-dap ");
        });
    }
}
exports.OpenSettingsButton = OpenSettingsButton;
/**
 * Represents a button that, when clicked, will return `null`.
 *
 * Used by a {@link vscode.DebugConfigurationProvider} to indicate that VS Code should
 * cancel a debug session and open its launch configuration.
 *
 * **IMPORTANT**: this button will do nothing if the callee isn't a
 * {@link vscode.DebugConfigurationProvider}.
 */
class ConfigureButton {
    constructor() {
        this.label = "Configure";
    }
    action() {
        return __awaiter(this, void 0, void 0, function* () {
            return null; // Opens the launch.json if returned from a DebugConfigurationProvider
        });
    }
}
exports.ConfigureButton = ConfigureButton;
/**
 * Shows an error message to the user with an optional array of buttons.
 *
 * This can be used with common buttons such as {@link OpenSettingsButton} or plain
 * strings as would normally be accepted by {@link vscode.window.showErrorMessage}.
 *
 * @param message The error message to display to the user
 * @param options Configures the behaviour of the message.
 * @param buttons An array of {@link NotificationButton buttons} or strings that the user can click on
 * @returns `undefined` or the result of a button's action
 */
function showErrorMessage(message_1) {
    return __awaiter(this, arguments, void 0, function* (message, options = {}, ...buttons) {
        const userSelection = yield vscode.window.showErrorMessage(message, options, ...buttons.map((button) => {
            if (typeof button === "string") {
                return button;
            }
            return button.label;
        }));
        for (const button of buttons) {
            if (typeof button === "string") {
                if (userSelection === button) {
                    // Type assertion is required to let TypeScript know that "button" isn't just any old string.
                    return button;
                }
            }
            else if (userSelection === button.label) {
                return yield button.action();
            }
        }
        return undefined;
    });
}
//# sourceMappingURL=show-error-message.js.map