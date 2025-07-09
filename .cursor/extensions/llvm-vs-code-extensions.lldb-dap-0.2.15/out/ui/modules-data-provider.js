"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesDataProvider = void 0;
const vscode = require("vscode");
function isModule(type) {
    return type.id !== undefined;
}
class ModuleItem extends vscode.TreeItem {
    constructor(module) {
        super(module.name, vscode.TreeItemCollapsibleState.Collapsed);
        this.description = module.symbolStatus;
    }
    static getProperties(module) {
        // does not include the name and symbol status as it is show in the parent.
        let children = [];
        children.push({ key: "id:", value: module.id.toString() });
        if (module.addressRange) {
            children.push({
                key: "load address:",
                value: module.addressRange,
            });
        }
        if (module.path) {
            children.push({ key: "path:", value: module.path });
        }
        if (module.version) {
            children.push({ key: "version:", value: module.version });
        }
        if (module.symbolFilePath) {
            children.push({ key: "symbol filepath:", value: module.symbolFilePath });
        }
        return children;
    }
}
/** A tree data provider for listing loaded modules for the active debug session. */
class ModulesDataProvider {
    constructor(tracker) {
        this.tracker = tracker;
        this.changeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.changeTreeData.event;
        tracker.onDidChangeModules(() => this.changeTreeData.fire());
    }
    getTreeItem(module) {
        if (isModule(module)) {
            return new ModuleItem(module);
        }
        let item = new vscode.TreeItem(module.key);
        item.description = module.value;
        item.tooltip = `${module.key} ${module.value}`;
        item.contextValue = "property";
        return item;
    }
    getChildren(element) {
        if (!vscode.debug.activeDebugSession) {
            return [];
        }
        if (!element) {
            return this.tracker.debugSessionModules(vscode.debug.activeDebugSession);
        }
        if (isModule(element)) {
            return ModuleItem.getProperties(element);
        }
        return [];
    }
}
exports.ModulesDataProvider = ModulesDataProvider;
//# sourceMappingURL=modules-data-provider.js.map