import { WsIo } from "../../../../../global_ws_io/ws_io";
import { FwcWsRes } from "./basic_msgs/fwc_ws_res";
import { OrchidFilePath } from "../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { OpenFileCmd } from "./basic_msgs/fwc_ws_cmd";
import { useMemo } from "react";
import { v4 } from "uuid";

export class FileWindowContainerWs {
    private ws_io: WsIo;
    private readonly id: string;

    constructor(res_handler: (res: FwcWsRes) => void) {
        this.ws_io = new WsIo();
        this.ws_io.set_handler((raw_res) => res_handler(JSON.parse(raw_res)));
        this.id = v4();
    }

    open_file = (path: OrchidFilePath) => {
        const cmd: OpenFileCmd = {
            OpenFile: {
                path,
                caller_id: this.id,
            },
        };

        this.ws_io.send_message(JSON.stringify(cmd));
    };

    get_id = () => {
        return this.id;
    };
}

export function useFileWindowContainerWs(
    res_handler: (res: FwcWsRes) => void
): [FileWindowContainerWs, string] {
    const fwc = useMemo(() => new FileWindowContainerWs(res_handler), []);

    return [fwc, fwc.get_id()];
}
