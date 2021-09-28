import React, { useContext, useState } from "react";
import {
    convert_to_path_link,
    get_oft_name,
    OrchidFolder,
} from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_tree";
import "../../oft_explorer_styles.scss";
import { FaFolder, FaChevronRight, FaChevronDown } from "react-icons/fa";
import OftExplorer from "../../oft_explorer";
import OftTitleContainer from "../oft_title_container/oft_title_container";
import {
    check_file_path_eq,
    OrchidFilePath,
    remove_last_link,
    switch_last_link,
} from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { FileCursorContext } from "../../../../context/cursor_context/cursor_context";

interface Props {
    folder: OrchidFolder;
    path: OrchidFilePath;
    indents: number;
    default_open: boolean;
    move_cursor_up_externally: (old_file: string) => void;
    move_cursor_down_externally: (old_file: string) => void;
}

const OftFolder: React.FC<Props> = (props) => {
    const folder = props.folder.Folder;
    const { file_cursor, set_file_cursor } = useContext(FileCursorContext);

    const [folder_open, set_open] = useState<boolean>(props.default_open);

    const toggle = () => set_open(!folder_open);
    const children_default_open = folder.children.length === 1;

    const on_activate = () => {
        set_file_cursor(props.path);
    };

    const is_cursor = check_file_path_eq(file_cursor, props.path);

    const child_move_cursor_up = (old_file: string) => {
        /* Get index of the child */
        const child_i = folder.children.findIndex(
            (child) => get_oft_name(child) === old_file
        );

        if (child_i === 0) {
            /* If the this is the first index, we
             * simply make this folder the cursor */
            set_file_cursor(remove_last_link(file_cursor));
        } else if (child_i > 0) {
            /* Make a new path link for the child at the previous
             * index, and switch the last link to that link */
            set_file_cursor(
                switch_last_link(
                    file_cursor,
                    convert_to_path_link(folder.children[child_i - 1])
                )
            );
        }
    };

    const child_move_cursor_down = (old_file: string) => {
        /* Get index of child */
        const child_i = folder.children.findIndex(
            (child) => get_oft_name(child) === old_file
        );

        if (child_i === folder.children.length - 1) {
            /* if this is the last element, pop the child off the path,
             * and externally call move cursor down */
            set_file_cursor(remove_last_link(file_cursor));
            props.move_cursor_down_externally(get_oft_name(props.folder));
        } else if (child_i >= 0) {
            /* Switch the last path link with a new link
             * corresponding to the file beneath it */
            set_file_cursor(
                switch_last_link(
                    file_cursor,
                    convert_to_path_link(folder.children[child_i + 1])
                )
            );
        }
    };

    return (
        <div className="oft-node-container">
            <OftTitleContainer indents={props.indents} title_active={is_cursor}>
                <div className="oft-chev-container" onMouseDown={toggle}>
                    {folder.children.length > 0 &&
                        (folder_open ? (
                            <FaChevronDown className="oft-chev-down" />
                        ) : (
                            <FaChevronRight className="oft-chev-right" />
                        ))}
                </div>
                <div
                    className="oft-icon-title-container"
                    onDoubleClick={toggle}
                    onMouseDown={on_activate}
                >
                    <FaFolder className="oft-folder-icon" />
                    <div className="oft-text">{folder.folder_name}</div>
                </div>
            </OftTitleContainer>
            {folder_open && (
                <div className="oft-indented-children">
                    {folder.children.map((child_oft, index) => (
                        <OftExplorer
                            key={`${folder.folder_name}--${index}`}
                            parent_path={props.path}
                            oft={child_oft}
                            indents={props.indents + 1}
                            default_open={children_default_open}
                            move_cursor_up_externally={child_move_cursor_up}
                            move_cursor_down_externally={child_move_cursor_down}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OftFolder;
