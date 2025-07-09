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
exports.LLDBDapConfigurationProvider = void 0;
const vscode = require("vscode");
const child_process = require("child_process");
const util = require("util");
const debug_adapter_factory_1 = require("./debug-adapter-factory");
const show_error_message_1 = require("./ui/show-error-message");
const error_with_notification_1 = require("./ui/error-with-notification");
const exec = util.promisify(child_process.execFile);
/**
 * Determines whether or not the given lldb-dap executable supports executing
 * in server mode.
 *
 * @param exe the path to the lldb-dap executable
 * @returns a boolean indicating whether or not lldb-dap supports server mode
 */
function isServerModeSupported(exe) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout } = yield exec(exe, ["--help"]);
        return /--connection/.test(stdout);
    });
}
const configurations = {
    // Keys for debugger configurations.
    commandEscapePrefix: { type: "string", default: "`" },
    customFrameFormat: { type: "string", default: "" },
    customThreadFormat: { type: "string", default: "" },
    detachOnError: { type: "boolean", default: false },
    disableASLR: { type: "boolean", default: true },
    disableSTDIO: { type: "boolean", default: false },
    displayExtendedBacktrace: { type: "boolean", default: false },
    enableAutoVariableSummaries: { type: "boolean", default: false },
    enableSyntheticChildDebugging: { type: "boolean", default: false },
    timeout: { type: "number", default: 30 },
    // Keys for platform / target configuration.
    platformName: { type: "string", default: "" },
    targetTriple: { type: "string", default: "" },
    // Keys for debugger command hooks.
    initCommands: { type: "stringArray", default: [] },
    preRunCommands: { type: "stringArray", default: [] },
    postRunCommands: { type: "stringArray", default: [] },
    stopCommands: { type: "stringArray", default: [] },
    exitCommands: { type: "stringArray", default: [] },
    terminateCommands: { type: "stringArray", default: [] },
};
class LLDBDapConfigurationProvider {
    constructor(server) {
        this.server = server;
    }
    resolveDebugConfiguration(folder, debugConfiguration, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let config = vscode.workspace.getConfiguration("lldb-dap");
            for (const [key, cfg] of Object.entries(configurations)) {
                if (Reflect.has(debugConfiguration, key)) {
                    continue;
                }
                const value = config.get(key);
                if (value === undefined || value === cfg.default) {
                    continue;
                }
                switch (cfg.type) {
                    case "string":
                        if (typeof value !== "string") {
                            throw new Error(`Expected ${key} to be a string, got ${value}`);
                        }
                        break;
                    case "number":
                        if (typeof value !== "number") {
                            throw new Error(`Expected ${key} to be a number, got ${value}`);
                        }
                        break;
                    case "boolean":
                        if (typeof value !== "boolean") {
                            throw new Error(`Expected ${key} to be a boolean, got ${value}`);
                        }
                        break;
                    case "stringArray":
                        if (typeof value !== "object" && Array.isArray(value)) {
                            throw new Error(`Expected ${key} to be a array of strings, got ${value}`);
                        }
                        if (value.length === 0) {
                            continue;
                        }
                        break;
                }
                debugConfiguration[key] = value;
            }
            return debugConfiguration;
        });
    }
    resolveDebugConfigurationWithSubstitutedVariables(folder, debugConfiguration, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if ("debugAdapterHostname" in debugConfiguration &&
                    !("debugAdapterPort" in debugConfiguration)) {
                    throw new error_with_notification_1.ErrorWithNotification("A debugAdapterPort must be provided when debugAdapterHostname is set. Please update your launch configuration.", new show_error_message_1.ConfigureButton());
                }
                // Check if we're going to launch a debug session or use an existing process
                if ("debugAdapterPort" in debugConfiguration) {
                    if ("debugAdapterExecutable" in debugConfiguration ||
                        "debugAdapterArgs" in debugConfiguration) {
                        throw new error_with_notification_1.ErrorWithNotification("The debugAdapterPort property is incompatible with debugAdapterExecutable and debugAdapterArgs. Please update your launch configuration.", new show_error_message_1.ConfigureButton());
                    }
                }
                else {
                    // Always try to create the debug adapter executable as this will show the user errors
                    // if there are any.
                    const executable = yield (0, debug_adapter_factory_1.createDebugAdapterExecutable)(folder, debugConfiguration);
                    if (!executable) {
                        return undefined;
                    }
                    // Server mode needs to be handled here since DebugAdapterDescriptorFactory
                    // will show an unhelpful error if it returns undefined. We'd rather show a
                    // nicer error message here and allow stopping the debug session gracefully.
                    const config = vscode.workspace.getConfiguration("lldb-dap", folder);
                    if (config.get("serverMode", false) &&
                        (yield isServerModeSupported(executable.command))) {
                        const serverInfo = yield this.server.start(executable.command, executable.args, executable.options);
                        if (!serverInfo) {
                            return undefined;
                        }
                        // Use a debug adapter host and port combination rather than an executable
                        // and list of arguments.
                        delete debugConfiguration.debugAdapterExecutable;
                        delete debugConfiguration.debugAdapterArgs;
                        debugConfiguration.debugAdapterHostname = serverInfo.host;
                        debugConfiguration.debugAdapterPort = serverInfo.port;
                    }
                }
                return debugConfiguration;
            }
            catch (error) {
                // Show a better error message to the user if possible
                if (!(error instanceof error_with_notification_1.ErrorWithNotification)) {
                    throw error;
                }
                return yield error.showNotification({
                    modal: true,
                    showConfigureButton: true,
                });
            }
        });
    }
}
exports.LLDBDapConfigurationProvider = LLDBDapConfigurationProvider;
//# sourceMappingURL=debug-configuration-provider.js.map