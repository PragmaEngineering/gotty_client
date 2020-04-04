import * as bare from "xterm";
import { lib } from "libapps";
bare.loadAddon("fit");


export class Xterm {
    constructor(elem) {
        this.elem = elem;
        this.term = new bare();
        this.message = elem.ownerDocument.createElement("div");
        this.message.className = "xterm-overlay";
        this.messageTimeout = 2000;
        this.resizeListener = () => {
            this.term.fit();
            this.term.scrollToBottom();
            this.showMessage(String(this.term.cols) + "x" + String(this.term.rows), this.messageTimeout);
        };
        this.term.on("open", () => {
            this.resizeListener();
            window.addEventListener("resize", () => { this.resizeListener(); });
        });
        this.term.open(elem, true);
        this.decoder = new lib.UTF8Decoder();
    };

    info() {
        return { columns: this.term.cols, rows: this.term.rows };
    };

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
    };

    onInput(callback) {
        this.term.on("data", (data) => {
            callback(data);
        });
    };

    onResize(callback) {
        this.term.on("resize", (data) => {
            callback(data.cols, data.rows);
        });
    };

    deactivate() {
        this.term.off("data");
        this.term.off("resize");
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