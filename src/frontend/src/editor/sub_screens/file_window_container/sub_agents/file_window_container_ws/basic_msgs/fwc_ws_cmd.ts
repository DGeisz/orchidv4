import {
    OrchidFilePath,
    OrchidOpenFiles,
} from "../../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";

export interface OpenFileCmd {
    OpenFile: {
        path: OrchidFilePath;
        caller_id: string;
    };
}

export const GetOpenFiles = "GetOpenFiles";

export interface SaveOpenFilesCmd {
    SaveOpenFiles: {
        open_files: OrchidOpenFiles;
    };
}
