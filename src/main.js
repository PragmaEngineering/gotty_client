import { Hterm } from "./hterm";
import { Xterm } from "./xterm";
import { WebTTY, protocols } from "./webtty";
import { ConnectionFactory } from "./websocket";
const elem = document.getElementById("terminal");

var gotty_term;
var gotty_auth_token;

if (elem !== null) {
    var term;
    if (gotty_term == "hterm") {
        term = new Hterm(elem);
    }
    else {
        term = new Xterm(elem);
    }
    const httpsEnabled = window.location.protocol == "https:";
    const newEndPoint = (httpsEnabled ? 'wss://localhost:1337/' : 'ws://localhost:1337/') + 'ws'; //+ window.location.host + window.location.pathname + 'ws';
    const url = newEndPoint;
    const args = window.location.search;
    const factory = new ConnectionFactory(url, protocols);
    const wt = new WebTTY(term, factory, args, gotty_auth_token);
    const closer = wt.open();
    window.addEventListener("unload", () => {
        closer();
        term.close();
    });
};
