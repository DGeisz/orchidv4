/** Context used to determine which top level editor
 * element actively has focus*/
import React, { useState } from "react";
import { OrchidFilePath } from "../../sub_screens/file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";

export enum TopLevelFocusOption {
    file_explorer,
    file_window_container,
}

interface TopLevelFocusType {
    current_focus: TopLevelFocusOption;
    give_focus_to_file_explorer: () => void;
    give_focus_to_file_window_container: () => void;
    open_file: (path: OrchidFilePath) => void;
    set_open_file: (handler: (path: OrchidFilePath) => void) => void;
}

export const TopLevelFocus = React.createContext<TopLevelFocusType>({
    current_focus: TopLevelFocusOption.file_explorer,
    give_focus_to_file_explorer: () => {},
    give_focus_to_file_window_container: () => {},
    open_file: () => {},
    set_open_file: () => {},
});

export function withTopLevelFocus(Component: React.FC): React.FC {
    return () => {
        /* For top level focus */
        const [top_level_focus, set_focus] = useState<TopLevelFocusOption>(
            TopLevelFocusOption.file_explorer
        );

        /* For open file */
        const [open_file, set_open_file] = useState<
            (path: OrchidFilePath) => void
        >(() => {});

        return (
            <TopLevelFocus.Provider
                value={{
                    current_focus: top_level_focus,
                    give_focus_to_file_explorer: () =>
                        set_focus(TopLevelFocusOption.file_explorer),
                    give_focus_to_file_window_container: () =>
                        set_focus(TopLevelFocusOption.file_window_container),
                    open_file,
                    set_open_file: (handler) => set_open_file(() => handler),
                }}
            >
                <Component />
            </TopLevelFocus.Provider>
        );
    };
}
