import React from "react";
import "./file_tab_styles.scss";
import { RiFilePaper2Line } from "react-icons/ri";

interface Props {
    file_name: string;
    tab_active: boolean;
    on_select: () => void;
    close_tab: () => void;
}

const FileTab: React.FC<Props> = (props) => {
    return (
        <div
            className={
                props.tab_active ? "file-tab-active" : "file-tab-inactive"
            }
            onMouseDown={props.on_select}
        >
            <RiFilePaper2Line className="file-tab-icon" />
            <div className="file-tab-name-container">{props.file_name}</div>
            <div className="file-tab-cross" onClick={props.close_tab}>
                ×
            </div>
            {props.tab_active && (
                <>
                    <div className="file-tab-swoosh-left">
                        <div className="ftl-inner" />
                    </div>
                    <div className="file-tab-swoosh-right">
                        <div className="ftr-inner" />
                    </div>
                </>
            )}
        </div>
    );
};

export default FileTab;
