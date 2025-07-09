"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugSessionTracker = void 0;
const vscode = require("vscode");
function isEvent(message, event) {
    return (message.type === "event" &&
        (!event || message.event === event));
}
/** Tracks lldb-dap sessions for data visualizers. */
class DebugSessionTracker {
    constructor() {
        /**
         * Tracks active modules for each debug sessions.
         *
         * The modules are kept in an array to maintain the load order of the modules.
         */
        this.modules = new Map();
        this.modulesChanged = new vscode.EventEmitter();
        /**
         * Fired when modules are changed for any active debug session.
         *
         * Use `debugSessionModules` to retieve the active modules for a given debug session.
         */
        this.onDidChangeModules = this.modulesChanged.event;
        this.onDidChangeModules(this.moduleChangedListener, this);
        vscode.debug.onDidChangeActiveDebugSession((session) => this.modulesChanged.fire(session));
    }
    dispose() {
        this.modules.clear();
        this.modulesChanged.dispose();
    }
    createDebugAdapterTracker(session) {
        return {
            onDidSendMessage: (message) => this.onDidSendMessage(session, message),
            onExit: () => this.onExit(session),
        };
    }
    /**
     * Retrieves the modules for the given debug session.
     *
     * Modules are returned in load order.
     */
    debugSessionModules(session) {
        var _a;
        return (_a = this.modules.get(session)) !== null && _a !== void 0 ? _a : [];
    }
    /** Clear information from the active session. */
    onExit(session) {
        this.modules.delete(session);
        this.modulesChanged.fire(undefined);
    }
    showModulesTreeView(showModules) {
        vscode.commands.executeCommand("setContext", "lldb-dap.showModules", showModules);
    }
    moduleChangedListener(session) {
        if (!session) {
            this.showModulesTreeView(false);
            return;
        }
        if (session == vscode.debug.activeDebugSession) {
            const sessionHasModules = this.modules.get(session) != undefined;
            this.showModulesTreeView(sessionHasModules);
        }
    }
    onDidSendMessage(session, message) {
        var _a;
        if (isEvent(message, "module")) {
            const { module, reason } = message.body;
            const modules = (_a = this.modules.get(session)) !== null && _a !== void 0 ? _a : [];
            switch (reason) {
                case "new":
                case "changed": {
                    const index = modules.findIndex((m) => m.id === module.id);
                    if (index !== -1) {
                        modules[index] = module;
                    }
                    else {
                        modules.push(module);
                    }
                    break;
                }
                case "removed": {
                    const index = modules.findIndex((m) => m.id === module.id);
                    if (index !== -1) {
                        modules.splice(index, 1);
                    }
                    break;
                }
                default:
                    console.error("unexpected module event reason");
                    break;
            }
            this.modules.set(session, modules);
            this.modulesChanged.fire(session);
        }
    }
}
exports.DebugSessionTracker = DebugSessionTracker;
//# sourceMappingURL=debug-session-tracker.js.map