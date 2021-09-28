import React from "react";
import { OrchidFilePath } from "../../sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";

interface CursorContextType {
    file_cursor: OrchidFilePath;
    set_file_cursor: (file_cursor: OrchidFilePath) => void;
    set_keydown_handler: (handler: () => (e: KeyboardEvent) => void) => void;
}

export const FileCursorContext = React.createContext<CursorContextType>({
    file_cursor: null,
    set_file_cursor: () => {},
    set_keydown_handler: () => () => {},
});
