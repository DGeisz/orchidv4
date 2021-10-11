import React, { useEffect, useState } from "react";
import "./file_tab_styles.scss";
import { RiFilePaper2Line } from "react-icons/ri";
import { FileEditorMaster } from "../../sub_screens/file_editor/sub_agents/file_editor_master/file_editor_master";
import { BeatLoader } from "react-spinners";
import { palette } from "../../../../../../../global_styles/palette";

interface Props {
    file_editor_master: FileEditorMaster;
    tab_active: boolean;
    on_select: () => void;
    close_tab: () => void;
}

const FileTab: React.FC<Props> = (props) => {
    const [loading, set_loading] = useState<boolean>(true);
    const [file_name, set_name] = useState<string>("");

    useEffect(() => {
        if (props.file_editor_master.is_hydrated()) {
            set_loading(false);
            set_name(props.file_editor_master.get_formatted_name());
        } else {
            props.file_editor_master.add_on_hydrated(() => {
                set_loading(false);
                set_name(props.file_editor_master.get_formatted_name());
            });
        }
    }, []);

    return (
        <div
            className={
                props.tab_active ? "file-tab-active" : "file-tab-inactive"
            }
            onMouseDown={props.on_select}
        >
            <RiFilePaper2Line className="file-tab-icon" />
            <div className="file-tab-name-container">
                {loading ? (
                    <BeatLoader color={palette.mediumForestGreen} size={8} />
                ) : (
                    file_name
                )}
            </div>
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
