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
exports.LLDBDapServer = void 0;
const child_process = require("node:child_process");
const util_1 = require("util");
const vscode = require("vscode");
/**
 * Represents a running lldb-dap process that is accepting connections (i.e. in "server mode").
 *
 * Handles startup of the process if it isn't running already as well as prompting the user
 * to restart when arguments have changed.
 */
class LLDBDapServer {
    /**
     * Starts the server with the provided options. The server will be restarted or reused as
     * necessary.
     *
     * @param dapPath the path to the debug adapter executable
     * @param args the list of arguments to provide to the debug adapter
     * @param options the options to provide to the debug adapter process
     * @returns a promise that resolves with the host and port information or `undefined` if unable to launch the server.
     */
    start(dapPath, args, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const dapArgs = [...args, "--connection", "connect://localhost:0"];
            if (!(yield this.shouldContinueStartup(dapPath, dapArgs))) {
                return undefined;
            }
            if (this.serverInfo) {
                return this.serverInfo;
            }
            this.serverInfo = new Promise((resolve, reject) => {
                const process = child_process.spawn(dapPath, dapArgs, options);
                process.on("error", (error) => {
                    reject(error);
                    this.serverProcess = undefined;
                    this.serverInfo = undefined;
                });
                process.on("exit", (code, signal) => {
                    let errorMessage = "Server process exited early";
                    if (code !== undefined) {
                        errorMessage += ` with code ${code}`;
                    }
                    else if (signal !== undefined) {
                        errorMessage += ` due to signal ${signal}`;
                    }
                    reject(new Error(errorMessage));
                    this.serverProcess = undefined;
                    this.serverInfo = undefined;
                });
                process.stdout.setEncoding("utf8").on("data", (data) => {
                    const connection = /connection:\/\/\[([^\]]+)\]:(\d+)/.exec(data.toString());
                    if (connection) {
                        const host = connection[1];
                        const port = Number(connection[2]);
                        resolve({ host, port });
                        process.stdout.removeAllListeners();
                    }
                });
                this.serverProcess = process;
            });
            return this.serverInfo;
        });
    }
    /**
     * Checks to see if the server needs to be restarted. If so, it will prompt the user
     * to ask if they wish to restart.
     *
     * @param dapPath the path to the debug adapter
     * @param args the arguments for the debug adapter
     * @returns whether or not startup should continue depending on user input
     */
    shouldContinueStartup(dapPath, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.serverProcess || !this.serverInfo) {
                return true;
            }
            if ((0, util_1.isDeepStrictEqual)(this.serverProcess.spawnargs, [dapPath, ...args])) {
                return true;
            }
            const userInput = yield vscode.window.showInformationMessage("The arguments to lldb-dap have changed. Would you like to restart the server?", {
                modal: true,
                detail: `An existing lldb-dap server (${this.serverProcess.pid}) is running with different arguments.

The previous lldb-dap server was started with:

${this.serverProcess.spawnargs.join(" ")}

The new lldb-dap server will be started with:

${dapPath} ${args.join(" ")}

Restarting the server will interrupt any existing debug sessions and start a new server.`,
            }, "Restart", "Use Existing");
            switch (userInput) {
                case "Restart":
                    this.serverProcess.kill();
                    this.serverProcess = undefined;
                    this.serverInfo = undefined;
                    return true;
                case "Use Existing":
                    return true;
                case undefined:
                    return false;
            }
        });
    }
    dispose() {
        if (!this.serverProcess) {
            return;
        }
        this.serverProcess.kill();
        this.serverProcess = undefined;
        this.serverInfo = undefined;
    }
}
exports.LLDBDapServer = LLDBDapServer;
//# sourceMappingURL=lldb-dap-server.js.map