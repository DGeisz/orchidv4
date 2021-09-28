import { WsIo } from "../../../../../global_ws_io/ws_io";
import { GetRootOFT } from "./basic_msgs/fe_ws_cmds";
import { FeWsRes } from "./basic_msgs/fe_ws_res";

export class FileExplorerWs {
    ws_io: WsIo;

    constructor(res_handler: (res: FeWsRes) => void) {
        this.ws_io = new WsIo();
        this.ws_io.set_handler((raw_res) => res_handler(JSON.parse(raw_res)));
    }

    get_root_oft = () => {
        this.ws_io.send_message(GetRootOFT);
    };
}
