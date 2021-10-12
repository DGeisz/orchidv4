import { WsIo } from "../../../../../../../../../../../global_ws_io/ws_io";
import { FemWsRes } from "./basic_msgs/fem_res";
import { OrchidFilePath } from "../../../../../../../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { CommitInputCmd, OpenFileCmd, SocketSide } from "./basic_msgs/fem_cmd";

export class FileEditorMasterWs {
    private ws_io: WsIo;
    private file_id: string = "";

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

    commit_input = (input: string, socket_id: string, side: SocketSide) => {
        const cmd: CommitInputCmd = {
            CommitInput: {
                file_id: this.file_id,
                input,
                socket_id,
                side,
            },
        };

        this.ws_io.send_message(JSON.stringify(cmd));
    };
}
