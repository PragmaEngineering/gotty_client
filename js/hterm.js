import * as bare from "libapps";


export class Hterm {
    constructor(elem) {
        this.elem = elem;
        bare.hterm.defaultStorage = new bare.lib.Storage.Memory();
        this.term = new bare.hterm.Terminal();
        this.term.getPrefs().set("send-encoding", "raw");
        this.term.decorate(this.elem);
        this.io = this.term.io.push();
        this.term.installKeyboard();
    };

    info() {
        return { columns: this.columns, rows: this.rows };
    };

    output(data) {
        if (this.term.io != null) {
            this.term.io.writeUTF8(data);
        }
    };

    showMessage(message, timeout) {
        this.message = message;
        if (timeout > 0) {
            this.term.io.showOverlay(message, timeout);
        }
        else {
            this.term.io.showOverlay(message, null);
        }
    };

    removeMessage() {
        // there is no hideOverlay(), so show the same message with 0 sec
        this.term.io.showOverlay(this.message, 0);
    };

    setWindowTitle(title) {
        this.term.setWindowTitle(title);
    };

    setPreferences(value) {
        Object.keys(value).forEach((key) => {
            this.term.getPrefs().set(key, value[key]);
        });
    };

    onInput(callback) {
        this.io.onVTKeystroke = (data) => {
            callback(data);
        };
        this.io.sendString = (data) => {
            callback(data);
        };
    };

    onResize(callback) {
        this.io.onTerminalResize = (columns, rows) => {
            this.columns = columns;
            this.rows = rows;
            callback(columns, rows);
        };
    };

    deactivate() {
        this.io.onVTKeystroke = function () { };
        this.io.sendString = function () { };
        this.io.onTerminalResize = function () { };
        this.term.uninstallKeyboard();
    };

    reset() {
        this.removeMessage();
        this.term.installKeyboard();
    };

    close() {
        this.term.uninstallKeyboard();
    };
}