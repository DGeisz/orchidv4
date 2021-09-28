/** Context used to determine which top level editor
 * element actively has focus*/
import React from "react";

export const a = 12;

export enum TopLevelFocusOption {
    file_explorer,
    file_window_container,
}

interface TopLevelFocusType {
    current_focus: TopLevelFocusOption;
    give_focus_to_file_explorer: () => void;
    give_focus_to_file_window_container: () => void;
}

export const TopLevelFocus = React.createContext<TopLevelFocusType>({
    current_focus: TopLevelFocusOption.file_explorer,
    give_focus_to_file_explorer: () => {},
    give_focus_to_file_window_container: () => {},
});
