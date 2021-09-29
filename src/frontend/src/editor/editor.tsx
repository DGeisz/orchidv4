import React, { useContext, useEffect, useState } from "react";
import "./editor_styles.scss";
import { DraggableCore } from "react-draggable";
import EditorHeader from "./building_blocks/editor_header/editor_header";
import { HiMenu } from "react-icons/hi";
import { palette } from "../global_styles/palette";
import FileExplorer from "./sub_screens/file_explorer/file_explorer";
import FileWindowContainer from "./sub_screens/file_window_container/file_window_container";
import { EditorCompCommProvider } from "./service_providers/editor_comp_comm/editor_comp_comm";
import {
    EditorFocus,
    useEditorFocus,
    withEditorFocus,
} from "./service_providers/editor_focus/editor_focus";

const Editor: React.FC = () => {
    const [width, set_width] = useState<number>(200);
    const [file_explorer_visible, show_file_explorer] = useState<boolean>(true);

    const [fe_keydown_handler, set_fe_keydown_handler] = useState<
        (e: KeyboardEvent) => void
    >(() => () => {});

    const editor_focus = useEditorFocus();

    useEffect(() => {
        function keydown_handler(e: KeyboardEvent) {
            if (
                ["Backspace", "ArrowLeft", "ArrowRight", "Enter"].indexOf(
                    e.key
                ) > -1
            ) {
                e.preventDefault();
            }

            switch (editor_focus) {
                case EditorFocus.file_explorer: {
                    fe_keydown_handler(e);
                    break;
                }
                case EditorFocus.file_window_container: {
                }
            }
        }

        function keypress_handler(e: KeyboardEvent) {}

        document.addEventListener("keydown", keydown_handler);
        document.addEventListener("keypress", keypress_handler);

        return () => {
            document.removeEventListener("keydown", keydown_handler);
            document.removeEventListener("keypress", keypress_handler);
        };
    }, [editor_focus, fe_keydown_handler]);

    return (
        <EditorCompCommProvider>
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
                                        <FileExplorer
                                            set_keydown_handler={
                                                set_fe_keydown_handler
                                            }
                                        />
                                    </div>
                                </div>
                                <div
                                    className="e-left-right-bar"
                                    id="drag-handle"
                                />
                            </div>
                            <div className="editor-right">
                                <FileWindowContainer />
                            </div>
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
                        <div className="editor-right">
                            <FileWindowContainer />
                        </div>
                    </div>
                )}
            </div>
        </EditorCompCommProvider>
    );
};

export default withEditorFocus(Editor);
