import { Hterm } from "./hterm";
import { Xterm } from "./xterm";
import { WebTTY, protocols } from "./webtty";
import { ConnectionFactory } from "./websocket";
const elem = document.getElementById("terminal");

var gotty_term;
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
    const url = newEndPoint//(httpsEnabled ? 'wss://0.0.0.0:8080' : 'ws://0.0.0.0:8080') + window.location.host + window.location.pathname + 'ws';
    const args = window.location.search;
    const factory = new ConnectionFactory(url, protocols);
    console.log("factory: " + factory);
    const wt = new WebTTY(term, factory, args, gotty_auth_token);
    console.log('wt: ' + wt)
    const closer = wt.open();
    window.addEventListener("unload", () => {
        closer();
        term.close();
    });
};
