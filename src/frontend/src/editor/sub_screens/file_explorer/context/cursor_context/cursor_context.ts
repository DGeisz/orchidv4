import React from "react";
import { OrchidFilePath } from "../../sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { KeyboardHandler } from "../../../../../global_types/keyboard_events";

interface CursorContextType {
    file_cursor: OrchidFilePath;
    set_file_cursor: (file_cursor: OrchidFilePath) => void;
    set_keydown_handler: (handler: () => KeyboardHandler) => void;
}

export const FileCursorContext = React.createContext<CursorContextType>({
    file_cursor: null,
    set_file_cursor: () => {},
    set_keydown_handler: () => () => {},
});
