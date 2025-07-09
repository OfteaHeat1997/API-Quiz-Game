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
exports.ErrorWithNotification = void 0;
const show_error_message_1 = require("./show-error-message");
/**
 * An error that is able to be displayed to the user as a notification.
 *
 * Used in combination with {@link showErrorMessage showErrorMessage()} when whatever caused
 * the error was the result of a direct action by the user. E.g. launching a debug session.
 */
class ErrorWithNotification extends Error {
    constructor(message, ...buttons) {
        super(message);
        this.buttons = buttons;
    }
    // Actual implementation of showNotification()
    showNotification() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            // Filter out the configure button unless explicitly requested
            let buttons = this.buttons;
            if (options.showConfigureButton !== true) {
                buttons = buttons.filter((button) => !(button instanceof show_error_message_1.ConfigureButton));
            }
            return (0, show_error_message_1.showErrorMessage)(this.message, options, ...buttons);
        });
    }
}
exports.ErrorWithNotification = ErrorWithNotification;
//# sourceMappingURL=error-with-notification.js.map