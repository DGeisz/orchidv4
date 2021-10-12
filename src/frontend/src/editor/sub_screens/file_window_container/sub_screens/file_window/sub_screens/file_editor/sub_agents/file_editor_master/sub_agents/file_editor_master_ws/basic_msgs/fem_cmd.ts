import { OrchidFilePath } from "../../../../../../../../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";

export interface OpenFileCmd {
    OpenFile: {
        path: OrchidFilePath;
    };
}

export interface CommitInputCmd {
    CommitInput: {
        file_id: String;
        socket_id: String;
        input: String;
        side: SocketSide;
    };
}

export type SocketSide = "Left" | "Right";
