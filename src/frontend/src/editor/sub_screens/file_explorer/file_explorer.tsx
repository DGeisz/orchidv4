import React, { useEffect, useState } from "react";
import { useFileExplorerWs } from "./sub_agents/file_explorer_ws/file_explorer_ws";
import { OrchidFileTree } from "./sub_agents/file_explorer_ws/portable_reps/orchid_file_tree";
import { res_is_oft } from "./sub_agents/file_explorer_ws/basic_msgs/fe_ws_res";
import OftExplorer from "./building_blocks/oft_explorer/oft_explorer";
import "./file_explorer_styles.scss";
import {
    file_path_eq,
    OrchidFilePath,
} from "./sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { FileCursorContext } from "./context/cursor_context/cursor_context";
import { GridLoader } from "react-spinners";
import { palette } from "../../../global_styles/palette";
import { useOnExplorerKeydown } from "../../service_providers/file_explorer_keydown_handler/file_explorer_keydown_handler";
import { KeyboardHandler } from "../../../global_types/keyboard_events";
import {
    EditorFocus,
    useTakeEditorFocus,
} from "../../service_providers/editor_focus/editor_focus";
import { OrchidOpenFolders } from "./sub_agents/file_explorer_ws/portable_reps/orchid_open_folders";
import {
    useSaveFoldersHandler,
    withConfigEvents,
} from "./service_providers/config_events/config_events";

const FileExplorer: React.FC = () => {
    const [oft, set_oft] = useState<OrchidFileTree>();

    const take_editor_focus = useTakeEditorFocus();

    const [cursor_keydown, set_cursor_keydown] = useState<KeyboardHandler>(
        () => () => {}
    );

    const file_explorer_ws = useFileExplorerWs((res) => {
        if (res_is_oft(res)) {
            set_oft(res.OFT);
        }
    });

    useEffect(() => {
        /* Get the root file tree when we first open
         * the file explorer */
        file_explorer_ws.get_root_oft();
    }, []);

    /* For cursor context */
    const [file_cursor, set_file_cursor] = useState<OrchidFilePath>(null);

    const [get_open_nodes, set_get_open_nodes] = useState<
        () => OrchidFilePath[]
    >(() => () => []);

    const [get_open_folders, set_get_open_folders] =
        useState<() => OrchidOpenFolders>();

    useOnExplorerKeydown(
        (e) => {
            switch (e.key) {
                case "ArrowDown": {
                    const open_nodes = get_open_nodes();

                    const cursor_index = open_nodes.findIndex((node) =>
                        file_path_eq(node, file_cursor)
                    );

                    if (
                        cursor_index > -1 &&
                        cursor_index < open_nodes.length - 1
                    ) {
                        set_file_cursor(open_nodes[cursor_index + 1]);
                    }

                    break;
                }
                case "ArrowUp": {
                    const open_nodes = get_open_nodes();

                    const cursor_index = open_nodes.findIndex((node) =>
                        file_path_eq(node, file_cursor)
                    );

                    if (cursor_index > 0) {
                        set_file_cursor(open_nodes[cursor_index - 1]);
                    }

                    break;
                }
            }

            !!cursor_keydown && cursor_keydown(e);
        },
        [get_open_nodes, file_cursor, cursor_keydown]
    );

    useSaveFoldersHandler(() => {
        if (!!get_open_folders) {
            file_explorer_ws.save_open_folders(get_open_folders());
        }
    }, [get_open_folders]);

    if (!!oft) {
        return (
            <FileCursorContext.Provider
                value={{
                    file_cursor,
                    set_file_cursor,
                    set_keydown_handler: set_cursor_keydown,
                }}
            >
                <div
                    className="fe-container"
                    onMouseDown={() =>
                        take_editor_focus(EditorFocus.file_explorer)
                    }
                >
                    <OftExplorer
                        oft={oft}
                        indents={0}
                        default_open={false}
                        parent_path={null}
                        set_get_open_nodes={set_get_open_nodes}
                        set_get_open_folders={set_get_open_folders}
                    />
                </div>
            </FileCursorContext.Provider>
        );
    } else {
        return (
            <div
                className="fe-container"
                onMouseDown={() => take_editor_focus(EditorFocus.file_explorer)}
            >
                <div className="spinner-container">
                    <GridLoader size={12} color={palette.mediumForestGreen} />
                </div>
            </div>
        );
    }
};

export default withConfigEvents(FileExplorer);
