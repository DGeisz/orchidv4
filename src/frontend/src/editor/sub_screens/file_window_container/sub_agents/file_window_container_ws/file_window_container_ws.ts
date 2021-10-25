import { WsIo } from "../../../../../global_ws_io/ws_io";
import { FwcWsRes } from "./basic_msgs/fwc_ws_res";
import {
    OrchidFilePath,
    OrchidOpenFiles,
} from "../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import {
    GetOpenFiles,
    OpenFileCmd,
    SaveOpenFilesCmd,
} from "./basic_msgs/fwc_ws_cmd";
import { useMemo } from "react";
import { v4 } from "uuid";
import { SaveOpenFoldersCmd } from "../../../file_explorer/sub_agents/file_explorer_ws/basic_msgs/fe_ws_cmds";

export class FileWindowContainerWs {
    private ws_io: WsIo;
    private readonly id: string;

    constructor(res_handler: (res: FwcWsRes, fwc_id: string) => void) {
        this.ws_io = new WsIo();
        this.id = v4();
        this.ws_io.set_handler((raw_res) =>
            res_handler(JSON.parse(raw_res), this.id)
        );
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

    get_open_files = () => {
        this.ws_io.send_message(JSON.stringify(GetOpenFiles));
    };

    save_open_files = (open_files: OrchidOpenFiles) => {
        const cmd: SaveOpenFilesCmd = {
            SaveOpenFiles: {
                open_files,
            },
        };

        console.log("Saving open files", cmd);

        this.ws_io.send_message(JSON.stringify(cmd));
    };

    get_id = () => {
        return this.id;
    };
}

export function useFileWindowContainerWs(
    res_handler: (res: FwcWsRes, fwc_id: string) => void,
    dep_array: any[]
): FileWindowContainerWs {
    return useMemo(() => new FileWindowContainerWs(res_handler), dep_array);
}
