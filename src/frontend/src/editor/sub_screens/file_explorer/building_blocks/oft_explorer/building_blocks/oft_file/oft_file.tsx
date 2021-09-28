import React from "react";
import { OrchidFile } from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_tree";
import { RiFilePaper2Line } from "react-icons/ri";

interface Props {
    file: OrchidFile;
    indents: number;
}

const OftFile: React.FC<Props> = (props) => {
    const file = props.file.File;

    return (
        <div className="oft-node-container">
            <div className="oft-node-title-container">
                {[...Array(props.indents)].map((_) => (
                    <div className="oft-node-indent" />
                ))}
                <div className="oft-chev-container" />
                <div className="oft-icon-title-container">
                    <RiFilePaper2Line className="oft-file-icon" />
                    <div className="oft-text">{file.formatted_name}</div>
                </div>
            </div>
        </div>
    );
};

export default OftFile;
