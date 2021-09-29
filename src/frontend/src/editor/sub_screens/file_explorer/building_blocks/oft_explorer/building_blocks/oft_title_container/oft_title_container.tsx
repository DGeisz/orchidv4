import React from "react";
import "../../oft_explorer_styles.scss";
import { palette } from "../../../../../../../global_styles/palette";
import {
    EditorFocus,
    useEditorFocus,
} from "../../../../../../service_providers/editor_focus/editor_focus";

interface Props {
    indents: number;
    title_active: boolean;
    on_activate: () => void;
    on_double_click?: () => void;
}

const OftTitleContainer: React.FC<Props> = (props) => {
    const editor_focus = useEditorFocus();
    const fe_in_focus = editor_focus === EditorFocus.file_explorer;

    return (
        <div
            className="oft-node-title-container"
            style={{
                backgroundColor: props.title_active
                    ? fe_in_focus
                        ? palette.lightForestGreen
                        : palette.softestForestGreen
                    : undefined,
            }}
            onMouseDown={props.on_activate}
            onDoubleClick={props.on_double_click}
        >
            {[...Array(props.indents)].map((_, index) => (
                <div className="oft-node-indent" key={index} />
            ))}
            {props.children}
        </div>
    );
};

export default OftTitleContainer;
