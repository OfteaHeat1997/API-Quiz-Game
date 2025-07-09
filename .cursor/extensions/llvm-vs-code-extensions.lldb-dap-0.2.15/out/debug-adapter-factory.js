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
exports.LLDBDapDescriptorFactory = void 0;
exports.createDebugAdapterExecutable = createDebugAdapterExecutable;
const path = require("path");
const util = require("util");
const vscode = require("vscode");
const child_process = require("child_process");
const fs = require("node:fs/promises");
const show_error_message_1 = require("./ui/show-error-message");
const error_with_notification_1 = require("./ui/error-with-notification");
const exec = util.promisify(child_process.execFile);
function isExecutable(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.access(path, fs.constants.X_OK);
        }
        catch (_a) {
            return false;
        }
        return true;
    });
}
function findWithXcrun(executable) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.platform === "darwin") {
            try {
                let { stdout, stderr } = yield exec("/usr/bin/xcrun", [
                    "-find",
                    executable,
                ]);
                if (stdout) {
                    return stdout.toString().trimEnd();
                }
            }
            catch (error) { }
        }
        return undefined;
    });
}
function findInPath(executable) {
    return __awaiter(this, void 0, void 0, function* () {
        const env_path = process.platform === "win32" ? process.env["Path"] : process.env["PATH"];
        if (!env_path) {
            return undefined;
        }
        const paths = env_path.split(path.delimiter);
        for (const p of paths) {
            const exe_path = path.join(p, executable);
            if (yield isExecutable(exe_path)) {
                return exe_path;
            }
        }
        return undefined;
    });
}
function findDAPExecutable() {
    return __awaiter(this, void 0, void 0, function* () {
        const executable = process.platform === "win32" ? "lldb-dap.exe" : "lldb-dap";
        // Prefer lldb-dap from Xcode on Darwin.
        const xcrun_dap = yield findWithXcrun(executable);
        if (xcrun_dap) {
            return xcrun_dap;
        }
        // Find lldb-dap in the user's path.
        const path_dap = yield findInPath(executable);
        if (path_dap) {
            return path_dap;
        }
        return undefined;
    });
}
/**
 * Retrieves the lldb-dap executable path either from settings or the provided
 * {@link vscode.DebugConfiguration}.
 *
 * @param workspaceFolder The {@link vscode.WorkspaceFolder} that the debug session will be launched within
 * @param configuration The {@link vscode.DebugConfiguration} that will be launched
 * @throws An {@link ErrorWithNotification} if something went wrong
 * @returns The path to the lldb-dap executable
 */
function getDAPExecutable(workspaceFolder, configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the executable was provided in the launch configuration.
        const launchConfigPath = configuration["debugAdapterExecutable"];
        if (typeof launchConfigPath === "string" && launchConfigPath.length !== 0) {
            if (!(yield isExecutable(launchConfigPath))) {
                throw new error_with_notification_1.ErrorWithNotification(`Debug adapter path "${launchConfigPath}" is not a valid file. The path comes from your launch configuration.`, new show_error_message_1.ConfigureButton());
            }
            return launchConfigPath;
        }
        // Check if the executable was provided in the extension's configuration.
        const config = vscode.workspace.getConfiguration("lldb-dap", workspaceFolder);
        const configPath = config.get("executable-path");
        if (configPath && configPath.length !== 0) {
            if (!(yield isExecutable(configPath))) {
                throw new error_with_notification_1.ErrorWithNotification(`Debug adapter path "${configPath}" is not a valid file. The path comes from your settings.`, new show_error_message_1.OpenSettingsButton("lldb-dap.executable-path"));
            }
            return configPath;
        }
        // Try finding the lldb-dap binary.
        const foundPath = yield findDAPExecutable();
        if (foundPath) {
            if (!(yield isExecutable(foundPath))) {
                throw new error_with_notification_1.ErrorWithNotification(`Found a potential debug adapter on your system at "${configPath}", but it is not a valid file.`, new show_error_message_1.OpenSettingsButton("lldb-dap.executable-path"));
            }
            return foundPath;
        }
        throw new error_with_notification_1.ErrorWithNotification("Unable to find the path to the LLDB debug adapter executable.", new show_error_message_1.OpenSettingsButton("lldb-dap.executable-path"));
    });
}
/**
 * Retrieves the arguments that will be provided to lldb-dap either from settings or the provided
 * {@link vscode.DebugConfiguration}.
 *
 * @param workspaceFolder The {@link vscode.WorkspaceFolder} that the debug session will be launched within
 * @param configuration The {@link vscode.DebugConfiguration} that will be launched
 * @throws An {@link ErrorWithNotification} if something went wrong
 * @returns The arguments that will be provided to lldb-dap
 */
function getDAPArguments(workspaceFolder, configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check the debug configuration for arguments first.
        const debugConfigArgs = configuration.debugAdapterArgs;
        if (debugConfigArgs) {
            if (!Array.isArray(debugConfigArgs) ||
                debugConfigArgs.findIndex((entry) => typeof entry !== "string") !== -1) {
                throw new error_with_notification_1.ErrorWithNotification("The debugAdapterArgs property must be an array of string values. Please update your launch configuration", new show_error_message_1.ConfigureButton());
            }
            return debugConfigArgs;
        }
        // Fall back on the workspace configuration.
        return vscode.workspace
            .getConfiguration("lldb-dap", workspaceFolder)
            .get("arguments", []);
    });
}
/**
 * Creates a new {@link vscode.DebugAdapterExecutable} based on the provided workspace folder and
 * debug configuration. Assumes that the given debug configuration is for a local launch of lldb-dap.
 *
 * @param workspaceFolder The {@link vscode.WorkspaceFolder} that the debug session will be launched within
 * @param configuration The {@link vscode.DebugConfiguration} that will be launched
 * @throws An {@link ErrorWithNotification} if something went wrong
 * @returns The {@link vscode.DebugAdapterExecutable} that can be used to launch lldb-dap
 */
function createDebugAdapterExecutable(workspaceFolder, configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const config = vscode.workspace.workspaceFile ? vscode.workspace.getConfiguration("lldb-dap") : vscode.workspace.getConfiguration("lldb-dap", workspaceFolder);
        const log_path = config.get("log-path");
        let env = {};
        if (log_path) {
            env["LLDBDAP_LOG"] = log_path;
        }
        const configEnvironment = config.get("environment") || {};
        const dapPath = yield getDAPExecutable(workspaceFolder, configuration);
        const dbgOptions = {
            env: Object.assign(Object.assign({}, configEnvironment), env),
            cwd: (_a = configuration.cwd) !== null && _a !== void 0 ? _a : workspaceFolder === null || workspaceFolder === void 0 ? void 0 : workspaceFolder.uri.fsPath,
        };
        const dbgArgs = yield getDAPArguments(workspaceFolder, configuration);
        return new vscode.DebugAdapterExecutable(dapPath, dbgArgs, dbgOptions);
    });
}
/**
 * This class defines a factory used to find the lldb-dap binary to use
 * depending on the session configuration.
 */
class LLDBDapDescriptorFactory {
    createDebugAdapterDescriptor(session, executable) {
        return __awaiter(this, void 0, void 0, function* () {
            if (executable) {
                throw new Error("Setting the debug adapter executable in the package.json is not supported.");
            }
            // Use a server connection if the debugAdapterPort is provided
            if (session.configuration.debugAdapterPort) {
                return new vscode.DebugAdapterServer(session.configuration.debugAdapterPort, session.configuration.debugAdapterHostname);
            }
            return createDebugAdapterExecutable(session.workspaceFolder, session.configuration);
        });
    }
}
exports.LLDBDapDescriptorFactory = LLDBDapDescriptorFactory;
//# sourceMappingURL=debug-adapter-factory.js.map