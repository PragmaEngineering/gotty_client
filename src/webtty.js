export const protocols = ["webtty"];
export const msgInputUnknown = '0';
export const msgInput = '1';
export const msgPing = '2';
export const msgResizeTerminal = '3';
export const msgUnknownOutput = '0';
export const msgOutput = '1';
export const msgPong = '2';
export const msgSetWindowTitle = '3';
export const msgSetPreferences = '4';
export const msgSetReconnect = '5';

export class WebTTY {
    constructor(term, connectionFactory, args, authToken) {
        this.term = term;
        this.connectionFactory = connectionFactory;
        this.args = args;
        this.authToken = authToken;
        this.reconnect = -1;
    };

    open() {
        let connection = this.connectionFactory.create();
        let pingTimer;
        let reconnectTimeout;
        const setup = () => {
            connection.onOpen(() => {
                const termInfo = this.term.info();
                connection.send(JSON.stringify({
                    Arguments: this.args,
                    AuthToken: this.authToken,
                }));
                const resizeHandler = (columns, rows) => {
                    connection.send(msgResizeTerminal + JSON.stringify({
                        columns: columns,
                        rows: rows
                    }));
                };
                this.term.onResize(resizeHandler);
                resizeHandler(termInfo.columns, termInfo.rows);
                this.term.onInput((input) => {
                    connection.send(msgInput + input);
                });
                this.term.keypress((event) => {
                    switch (event.domEvent.keyCode) {
                        case 8: // backspace
                            this.term.output('\b \b');
                            break;
                        case 13: // return || enter
                            this.term.output('\r\n');
                        default:
                            break;
                    }
                });
                pingTimer = setInterval(() => {
                    connection.send(msgPing);
                }, 30 * 1000);
            });
            connection.onReceive((data) => {
                const payload = data.slice(1);
                switch (data[0]) {
                    case msgOutput:
                        this.term.output(atob(payload));
                        break;
                    case msgPong:
                        break;
                    case msgSetWindowTitle:
                        this.term.setWindowTitle(payload);
                        break;
                    case msgSetPreferences:
                        const preferences = JSON.parse(payload);
                        this.term.setPreferences(preferences);
                        break;
                    case msgSetReconnect:
                        const autoReconnect = JSON.parse(payload);
                        this.reconnect = autoReconnect;
                        break;
                }
            });
            connection.onClose(() => {
                clearInterval(pingTimer);
                this.term.deactivate();
                this.term.showMessage("Connection Closed", 0);
                if (this.reconnect > 0) {
                    reconnectTimeout = setTimeout(() => {
                        connection = this.connectionFactory.create();
                        this.term.reset();
                        setup();
                    }, this.reconnect * 1000);
                }
            });
            connection.open();
        };
        setup();
        return () => {
            clearTimeout(reconnectTimeout);
            connection.close();
        };
    };
};