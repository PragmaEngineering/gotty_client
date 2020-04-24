import * as bare from "../node_modules/xterm";
import { lib } from "../node_modules/libapps";

import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

var opts = { cols: 80, rows: 20, screenKeys: true, cursorBlink: true, cursorStyle: 'block' }

export class Xterm {
    constructor(elem) {
        this.elem = elem;
        this.term = new Terminal(opts);
        this.fitAddOn = new FitAddon();
        this.term.loadAddon(this.fitAddOn);
        this.message = elem.ownerDocument.createElement("div");
        this.message.className = "xterm-overlay";
        this.messageTimeout = 2000;
        this.resizeListener = () => {
            this.showMessage(String(this.term.cols) + "x" + String(this.term.rows), this.messageTimeout);
        };
        this.term.open(elem, true);
        this.decoder = new lib.UTF8Decoder();
        window.addEventListener("resize", () => { this.resizeListener(); });
    };

    info() {
        return { columns: this.term.cols, rows: this.term.rows };
    };

    keypress(callback) {
        this.term.onKey((event) => {
            callback(event)
        });
    }

    output(data) {
        this.term.write(this.decoder.decode(data));
    };

    showMessage(message, timeout) {
        this.message.textContent = message;
        this.elem.appendChild(this.message);
        if (this.messageTimer) {
            clearTimeout(this.messageTimer);
        }
        if (timeout > 0) {
            this.messageTimer = setTimeout(() => {
                this.elem.removeChild(this.message);
            }, timeout);
        }
    };

    removeMessage() {
        if (this.message.parentNode == this.elem) {
            this.elem.removeChild(this.message);
        }
    };

    setWindowTitle(title) {
        document.title = title;
    };

    setPreferences(value) {
        this.term.attach
    };

    setPrompt(promptText) {
        this.term.prompt = promptText
    }

    onInput(callback) {
        this.term.onData((data) => {
            callback(data);
        })
    };

    onData(callback) {
        this.term.onData((data) => {
            callback(data);
        })
    }

    onResize(callback) {
        this.term.onResize((data) => {
            callback(data);
        });
    };

    deactivate() {
        // this.term.off("data");
        // this.term.off("resize");
        this.term.blur();
    };

    reset() {
        this.removeMessage();
        this.term.clear();
    };

    focus() {
        this.term.focus();
    }

    fitTerminal() {
        this.fitAddOn.fit();
    }

    close() {
        window.removeEventListener("resize", this.resizeListener);
        this.term.destroy();
    };
};