import React, { useState } from "react";
import "./editor_styles.scss";
import { DraggableCore } from "react-draggable";
import EditorHeader from "./building_blocks/editor_header/editor_header";
import { HiMenu } from "react-icons/hi";
import { palette } from "../global_styles/palette";
import FileExplorer from "./sub_screens/file_explorer/file_explorer";
import {
    TopLevelFocus,
    TopLevelFocusOption,
} from "./context/top_level_focus/top_level_focus";

const Editor: React.FC = () => {
    const [width, set_width] = useState<number>(200);
    const [file_explorer_visible, show_file_explorer] = useState<boolean>(true);

    /* For top level focus context */
    const [top_level_focus, set_focus] = useState<TopLevelFocusOption>(
        TopLevelFocusOption.file_explorer
    );

    return (
        <TopLevelFocus.Provider
            value={{
                current_focus: top_level_focus,
                give_focus_to_file_explorer: () =>
                    set_focus(TopLevelFocusOption.file_explorer),
                give_focus_to_file_window_container: () =>
                    set_focus(TopLevelFocusOption.file_window_container),
            }}
        >
            <div className="editor-container">
                <EditorHeader />

                {file_explorer_visible ? (
                    <DraggableCore
                        handle="#drag-handle"
                        onDrag={(e, { x }) => {
                            set_width(x);
                        }}
                    >
                        <div className="editor-body">
                            <div className="editor-left" style={{ width }}>
                                <div className="e-left-left">
                                    <div className="editor-left-top">
                                        <HiMenu
                                            className="fe-menu-toggle"
                                            color={palette.mediumForestGreen}
                                            onClick={() =>
                                                show_file_explorer(false)
                                            }
                                        />
                                        <FileExplorer />
                                    </div>
                                </div>
                                <div
                                    className="e-left-right-bar"
                                    id="drag-handle"
                                />
                            </div>
                            <div className="editor-right" />
                        </div>
                    </DraggableCore>
                ) : (
                    <div className="editor-body">
                        <div className="e-left-collapsed">
                            <HiMenu
                                className="fe-menu-toggle"
                                color={palette.mediumForestGreen}
                                onClick={() => show_file_explorer(true)}
                            />
                        </div>
                        <div className="editor-right" />
                    </div>
                )}
            </div>
        </TopLevelFocus.Provider>
    );
};

export default Editor;
