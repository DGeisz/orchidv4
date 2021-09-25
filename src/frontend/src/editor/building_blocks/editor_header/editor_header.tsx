import React from "react";
import "./editor_header_styles.scss";
import logo from "./imgs/o-logo-mini.png";
import DarkModeSwitch from "./building_blocks/dark_mode_switch/dark_mode_switch";

const EditorHeader: React.FC = () => {
    return (
        <div className="eh-container">
            <div className="eh-left">
                <img className="eh-logo" src={logo} alt="Logo" />
                <div className="eh-header-option">File</div>
            </div>
            <div className="eh-right">
                <DarkModeSwitch />
            </div>
        </div>
    );
};

export default EditorHeader;
