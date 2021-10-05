import React, { useContext, useEffect } from "react";
import { OrchidFile } from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_tree";
import { RiFilePaper2Line } from "react-icons/ri";
import OftTitleContainer from "../oft_title_container/oft_title_container";
import {
    file_path_eq,
    OrchidFilePath,
} from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { FileCursorContext } from "../../../../context/cursor_context/cursor_context";
import { useOpenFile } from "../../../../../../service_providers/editor_comp_comm/editor_comp_comm";
import {
    EditorFocus,
    useTakeEditorFocus,
} from "../../../../../../service_providers/editor_focus/editor_focus";

interface Props {
    file: OrchidFile;
    path: OrchidFilePath;
    indents: number;
    set_get_open_nodes: (set: () => () => OrchidFilePath[]) => void;
}

const OftFile: React.FC<Props> = (props) => {
    const file = props.file.File;

    const { file_cursor, set_file_cursor, set_keydown_handler } =
        useContext(FileCursorContext);

    const open_file = useOpenFile();

    useEffect(() => {
        props.set_get_open_nodes(() => () => [props.path]);
    }, []);

    const take_editor_focus = useTakeEditorFocus();

    const on_activate = () => {
        set_file_cursor(props.path);
        take_editor_focus(EditorFocus.file_explorer);
    };

    const is_cursor = file_path_eq(file_cursor, props.path);

    useEffect(() => {
        if (is_cursor) {
            set_keydown_handler(() => (e: KeyboardEvent) => {
                if (e.key === "Enter") {
                    open_file(props.path);
                }
            });
        }
    }, [open_file, is_cursor]);

    return (
        <div className="oft-node-container">
            <OftTitleContainer
                indents={props.indents}
                title_active={is_cursor}
                on_activate={on_activate}
                on_double_click={() => open_file(props.path)}
            >
                <div className="oft-chev-container" />
                <div className="oft-icon-title-container">
                    <RiFilePaper2Line className="oft-file-icon" />
                    <div className="oft-text">{file.formatted_name}</div>
                </div>
            </OftTitleContainer>
        </div>
    );
};

export default OftFile;
