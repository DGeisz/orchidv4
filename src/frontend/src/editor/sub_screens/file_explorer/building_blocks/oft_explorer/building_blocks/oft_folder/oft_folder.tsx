import React, { useState } from "react";
import { OrchidFolder } from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_tree";
import "../../oft_explorer_styles.scss";
import { FaFolder, FaChevronRight, FaChevronDown } from "react-icons/fa";
import OftExplorer from "../../oft_explorer";

interface Props {
    folder: OrchidFolder;
    indents: number;
}

const OftFolder: React.FC<Props> = (props) => {
    const folder = props.folder.Folder;

    const [folder_open, set_open] = useState<boolean>(false);

    const toggle = () => set_open(!folder_open);

    return (
        <div className="oft-node-container">
            <div className="oft-node-title-container">
                {[...Array(props.indents)].map((_, index) => (
                    <div
                        className="oft-node-indent"
                        key={`${folder.folder_name}::${index}`}
                    />
                ))}
                <div className="oft-chev-container" onClick={toggle}>
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
            </div>
            {folder_open && (
                <div className="oft-indented-children">
                    {folder.children.map((child_oft, index) => (
                        <OftExplorer
                            key={`${folder.folder_name}--${index}`}
                            oft={child_oft}
                            indents={props.indents + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OftFolder;
