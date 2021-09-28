import { v4 } from "uuid";

export class WsIo {
    private link_id: string;
    private readonly addr: string;
    private ws: WebSocket;
    private ws_open: boolean = false;
    private response_handler?: (res: string) => void;
    private send_queue: string[] = [];

    constructor(addr: string = "ws://127.0.0.1:7200") {
        this.link_id = v4();
        this.addr = addr;

        console.log("Creating websocket!");

        this.ws = new WebSocket(this.addr);
        this.configure_ws();
    }

    private reconnect_ws = () => {
        /* First nullify all handlers */
        this.ws.onmessage = null;
        this.ws.onclose = null;
        this.ws.onerror = null;

        /* Then create a new connection and configure said connection */
        this.ws = new WebSocket(this.addr);
        this.configure_ws();
    };

    private configure_ws = () => {
        this.ws.onerror = () => {
            this.ws.close();
        };

        this.ws.onclose = () => {
            this.ws_open = false;

            /* Attempt to reconnect every 3 seconds */
            setTimeout(this.reconnect_ws, 3000);
        };

        this.ws.onopen = () => {
            this.ws_open = true;

            /* When you open, send all the messages
             * currently built up in the queue */
            for (let msg of this.send_queue) {
                this.ws.send(msg);
            }

            /* Clear the queue now that we've sent the messages */
            this.send_queue = [];
        };

        /* If the res handler is defined,
         * add a new message event handler */
        if (!!this.response_handler) {
            this.ws.onmessage = (e) => {
                /* Immediately pass data of res to
                 * response handler */

                console.log("This is ws message: ", e);
                !!this.response_handler && this.response_handler(e.data);
            };
        }
    };

    set_handler = (handler: (res: string) => void) => {
        this.response_handler = handler;

        this.configure_ws();
    };

    send_message = (msg: string) => {
        /* If the ws connection is open... */
        if (this.ws_open) {
            /* ...send the message directly through ws... */
            this.ws.send(msg);
        } else {
            /* ...otherwise push the msg to the queue
             * to be sent as soon as the ws connection is opened */
            this.send_queue.push(msg);
        }
    };
}
