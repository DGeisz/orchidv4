import React, { useContext, useEffect, useState } from "react";
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
    set_get_open_nodes: (set: () => () => OrchidFilePath[]) => void;
}

const OftFolder: React.FC<Props> = (props) => {
    const folder = props.folder.Folder;
    const { file_cursor, set_file_cursor, set_keydown_handler } =
        useContext(FileCursorContext);

    const [get_open_nodes_list, set_get_open_nodes_list] = useState<
        (() => OrchidFilePath[])[]
    >([]);

    useEffect(() => {
        props.set_get_open_nodes(() => () => {
            let open_nodes = get_open_nodes_list.reduce<OrchidFilePath[]>(
                (previousValue, currentValue) => {
                    if (!!currentValue) {
                        return [...previousValue, ...currentValue()];
                    } else {
                        return previousValue;
                    }
                },
                []
            );

            open_nodes.unshift(props.path);

            return open_nodes;
        });
    }, [get_open_nodes_list]);

    const [folder_open, set_open] = useState<boolean>(props.default_open);

    const toggle = () => {
        if (folder_open) {
            set_get_open_nodes_list([]);
        }

        set_open(!folder_open);
    };
    const children_default_open = folder.children.length === 1;

    const on_activate = () => {
        set_file_cursor(props.path);
    };

    const is_cursor = check_file_path_eq(file_cursor, props.path);

    useEffect(() => {
        if (is_cursor) {
            set_keydown_handler(() => (e: KeyboardEvent) => {
                if (e.key === "Enter") {
                    toggle();
                }
            });

            return () => set_keydown_handler(() => () => {});
        }
    }, [is_cursor, folder_open]);

    return (
        <div className="oft-node-container">
            <OftTitleContainer
                indents={props.indents}
                title_active={is_cursor}
                on_activate={on_activate}
            >
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
                            set_get_open_nodes={(set) => {
                                set_get_open_nodes_list((prev) => {
                                    const next = [...prev];

                                    next[index] = set();

                                    return next;
                                });
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OftFolder;