import { Hterm } from "./hterm";
import { Xterm } from "./xterm";
import { WebTTY, protocols } from "./webtty";
import { ConnectionFactory } from "./websocket";
const elem = document.getElementById("terminal");
if (elem !== null) {
    var term;
    if (gotty_term == "hterm") {
        term = new Hterm(elem);
    }
    else {
        term = new Xterm(elem);
    }
    const newEndPoint = 'http://localhost:1337/';
    const httpsEnabled = window.location.protocol == "https:";
    const url = newEndPoint; //(httpsEnabled ? 'wss://' : 'ws://') + window.location.host + window.location.pathname + 'ws';
    const args = window.location.search;
    const factory = new ConnectionFactory(url, protocols);
    const wt = new WebTTY(term, factory, args, gotty_auth_token);
    const closer = wt.open();
    window.addEventListener("unload", () => {
        closer();
        term.close();
    });
};
