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
exports.LaunchUriHandler = void 0;
const vscode = require("vscode");
class LaunchUriHandler {
    handleUri(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = new URLSearchParams(uri.query);
                if (uri.path == "/start") {
                    // Some properties have default values
                    let debugConfig = {
                        type: "lldb-dap",
                        request: "launch",
                        name: "",
                    };
                    // The `config` parameter allows providing a complete JSON-encoded configuration
                    const configJson = params.get("config");
                    if (configJson !== null) {
                        Object.assign(debugConfig, JSON.parse(configJson));
                    }
                    // Furthermore, some frequently used parameters can also be provided as separate parameters
                    const stringKeys = [
                        "name",
                        "request",
                        "program",
                        "cwd",
                        "debuggerRoot",
                    ];
                    const numberKeys = ["pid"];
                    const arrayKeys = [
                        "args",
                        "initCommands",
                        "preRunCommands",
                        "stopCommands",
                        "exitCommands",
                        "terminateCommands",
                        "launchCommands",
                        "attachCommands",
                    ];
                    for (const key of stringKeys) {
                        const value = params.get(key);
                        if (value) {
                            debugConfig[key] = value;
                        }
                    }
                    for (const key of numberKeys) {
                        const value = params.get(key);
                        if (value) {
                            debugConfig[key] = Number(value);
                        }
                    }
                    for (const key of arrayKeys) {
                        // `getAll()` returns an array of strings.
                        const value = params.getAll(key);
                        if (value) {
                            debugConfig[key] = value;
                        }
                    }
                    // Report an error if we received any unknown parameters
                    const supportedKeys = new Set(["config"].concat(stringKeys).concat(numberKeys).concat(arrayKeys));
                    const presentKeys = new Set(params.keys());
                    // FIXME: Use `Set.difference` as soon as ES2024 is widely available
                    const unknownKeys = new Set();
                    for (const k of presentKeys.keys()) {
                        if (!supportedKeys.has(k)) {
                            unknownKeys.add(k);
                        }
                    }
                    if (unknownKeys.size > 0) {
                        throw new Error(`Unsupported URL parameters: ${Array.from(unknownKeys.keys()).join(", ")}`);
                    }
                    // Prodide a default for the config name
                    const defaultName = debugConfig.request == "launch"
                        ? "URL-based Launch"
                        : "URL-based Attach";
                    debugConfig.name =
                        debugConfig.name || debugConfig.program || defaultName;
                    // Force the type to `lldb-dap`. We don't want to allow launching any other
                    // Debug Adapters using this URI scheme.
                    if (debugConfig.type != "lldb-dap") {
                        throw new Error(`Unsupported debugger type: ${debugConfig.type}`);
                    }
                    yield vscode.debug.startDebugging(undefined, debugConfig);
                }
                else {
                    throw new Error(`Unsupported Uri path: ${uri.path}`);
                }
            }
            catch (err) {
                if (err instanceof Error) {
                    yield vscode.window.showErrorMessage(`Failed to handle lldb-dap URI request: ${err.message}`);
                }
                else {
                    yield vscode.window.showErrorMessage(`Failed to handle lldb-dap URI request: ${JSON.stringify(err)}`);
                }
            }
        });
    }
}
exports.LaunchUriHandler = LaunchUriHandler;
//# sourceMappingURL=uri-launch-handler.js.map