import { WsIo } from "../../../../../../../../../../../global_ws_io/ws_io";
import { FemWsRes } from "./basic_msgs/fem_res";
import { OrchidFilePath } from "../../../../../../../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { OpenFileCmd } from "./basic_msgs/fem_cmd";

export class FileEditorMasterWs {
    private ws_io: WsIo;

    constructor(res_handler: (res: FemWsRes) => void) {
        this.ws_io = new WsIo();
        this.ws_io.set_handler((raw_res) => res_handler(JSON.parse(raw_res)));
    }

    open_file = (path: OrchidFilePath) => {
        const cmd: OpenFileCmd = {
            OpenFile: {
                path,
            },
        };

        this.ws_io.send_message(JSON.stringify(cmd));
    };
}
