import React, { useContext } from "react";
import "../../oft_explorer_styles.scss";
import {
    TopLevelFocus,
    TopLevelFocusOption,
} from "../../../../../../context/top_level_focus/top_level_focus";
import { palette } from "../../../../../../../global_styles/palette";

interface Props {
    indents: number;
    title_active: boolean;
    on_activate: () => void;
}

const OftTitleContainer: React.FC<Props> = (props) => {
    const { current_focus } = useContext(TopLevelFocus);
    const fe_in_focus = current_focus === TopLevelFocusOption.file_explorer;

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
        >
            {[...Array(props.indents)].map((_, index) => (
                <div className="oft-node-indent" key={index} />
            ))}
            {props.children}
        </div>
    );
};

export default OftTitleContainer;
