import React, { useContext, useEffect } from "react";
import {
    get_oft_name,
    OrchidFile,
} from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_tree";
import { RiFilePaper2Line } from "react-icons/ri";
import OftTitleContainer from "../oft_title_container/oft_title_container";
import {
    check_file_path_eq,
    OrchidFilePath,
} from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { FileCursorContext } from "../../../../context/cursor_context/cursor_context";

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

    useEffect(() => {
        props.set_get_open_nodes(() => () => [props.path]);
    }, []);

    const on_activate = () => {
        set_file_cursor(props.path);
    };

    const is_cursor = check_file_path_eq(file_cursor, props.path);

    return (
        <div className="oft-node-container">
            <OftTitleContainer
                indents={props.indents}
                title_active={is_cursor}
                on_activate={on_activate}
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
