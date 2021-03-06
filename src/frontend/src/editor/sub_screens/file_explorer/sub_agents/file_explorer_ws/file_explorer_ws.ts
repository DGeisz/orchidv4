import { WsIo } from "../../../../../global_ws_io/ws_io";
import { GetRootOFT, SaveOpenFoldersCmd } from "./basic_msgs/fe_ws_cmds";
import { FeWsRes, res_is_oft } from "./basic_msgs/fe_ws_res";
import { useMemo } from "react";
import { OrchidOpenFolders } from "./portable_reps/orchid_open_folders";

export class FileExplorerWs {
    ws_io: WsIo;

    constructor(res_handler: (res: FeWsRes) => void) {
        this.ws_io = new WsIo();
        this.ws_io.set_handler((raw_res) => res_handler(JSON.parse(raw_res)));
    }

    get_root_oft = () => {
        this.ws_io.send_message(GetRootOFT);
    };

    save_open_folders = (open_folders: OrchidOpenFolders) => {
        const cmd: SaveOpenFoldersCmd = {
            SaveOpenFolders: {
                open_folders,
            },
        };

        this.ws_io.send_message(JSON.stringify(cmd));
    };
}

export function useFileExplorerWs(
    res_handler: (res: FeWsRes) => void
): FileExplorerWs {
    return useMemo(() => new FileExplorerWs(res_handler), []);
}
