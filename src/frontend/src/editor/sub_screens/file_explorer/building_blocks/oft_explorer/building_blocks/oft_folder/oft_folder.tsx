import React, { useContext, useEffect, useState } from "react";
import { OrchidFolder } from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_tree";
import "../../oft_explorer_styles.scss";
import { FaChevronDown, FaChevronRight, FaFolder } from "react-icons/fa";
import OftExplorer from "../../oft_explorer";
import OftTitleContainer from "../oft_title_container/oft_title_container";
import {
    file_path_eq,
    OrchidFilePath,
} from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { FileCursorContext } from "../../../../context/cursor_context/cursor_context";
import {
    EditorFocus,
    useTakeEditorFocus,
} from "../../../../../../service_providers/editor_focus/editor_focus";

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
                on_double_click={toggle}
            >
                <div
                    className="oft-chev-container"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        toggle();
                    }}
                >
                    {folder.children.length > 0 &&
                        (folder_open ? (
                            <FaChevronDown className="oft-chev-down" />
                        ) : (
                            <FaChevronRight className="oft-chev-right" />
                        ))}
                </div>
                <div className="oft-icon-title-container">
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
