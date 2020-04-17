// import * as bare from "../node_modules/xterm";
import { lib } from "../node_modules/libapps";

import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const terminal = new Terminal();
const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);


export class Xterm {
    constructor(elem) {
        this.elem = elem;
        this.term = new Terminal();
        this.message = elem.ownerDocument.createElement("div");
        this.message.className = "xterm-overlay";
        this.messageTimeout = 2000;
        this.resizeListener = () => {
            this.term.fit();
            this.term.scrollToBottom();
            this.showMessage(String(this.term.cols) + "x" + String(this.term.rows), this.messageTimeout);
        };
        console.log(this.term)
        // this.term.on("open", () => {
        //     this.resizeListener();
        //     window.addEventListener("resize", () => { this.resizeListener(); });
        // });
        this.term.open(elem, true);
        this.decoder = new lib.UTF8Decoder();
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
        this.term.setOption('cursorStyle', 'block')
    };

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
        // this.term.on("resize", (data) => {
        //     callback(data.cols, data.rows);
        // });
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

    close() {
        window.removeEventListener("resize", this.resizeListener);
        this.term.destroy();
    };
};