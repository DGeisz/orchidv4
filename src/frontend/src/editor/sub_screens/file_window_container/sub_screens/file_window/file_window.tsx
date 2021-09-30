import React from "react";
import "./file_window_styles.scss";
import FileTab from "./building_blocks/file_tab/file_tab";

interface Props {
    window_index: number;
}

const FileWindow: React.FC<Props> = (props) => {
    return (
        <div className="fw-container">
            <div className="fw-file-bar">
                <FileTab
                    file_name="Here she is"
                    tab_active={true}
                    on_select={() => {}}
                    close_tab={() => {}}
                />
                <FileTab
                    file_name="Here she is"
                    tab_active={false}
                    on_select={() => {}}
                    close_tab={() => {}}
                />
                <FileTab
                    file_name="Here she is"
                    tab_active={false}
                    on_select={() => {}}
                    close_tab={() => {}}
                />
            </div>
            <div className="fw-body">
                <div className="left-swoosh">
                    <div className="left-swoosh-inner" />
                </div>
                <div className="right-swoosh">
                    <div className="right-swoosh-inner" />
                </div>
            </div>
        </div>
    );
};

export default FileWindow;
