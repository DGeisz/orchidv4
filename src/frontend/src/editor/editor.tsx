import React, { useEffect, useState } from "react";
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
} from "./service_providers/editor_focus/editor_focus";
import { useExplorerKeydown } from "./service_providers/file_explorer_keydown_handler/file_explorer_keydown_handler";
import { withHocEditorServiceProviders } from "./service_providers/with_hoc_editor_service_providers";
import { useFwcKeyboardHandlers } from "./service_providers/fwc_keyboard_handlers/fwc_keyboard_handlers";

const Editor: React.FC = () => {
    const [width, set_width] = useState<number>(200);
    const [file_explorer_visible, show_file_explorer] = useState<boolean>(true);

    const fe_keydown_handler = useExplorerKeydown();

    const [fwc_keydown_handler, fwc_keypress_handler, fwc_handlers_id] =
        useFwcKeyboardHandlers();

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
                    fwc_keydown_handler(e);
                    break;
                }
            }
        }

        function keypress_handler(e: KeyboardEvent) {
            switch (editor_focus) {
                case EditorFocus.file_window_container: {
                    fwc_keypress_handler(e);
                    break;
                }
            }
        }

        document.addEventListener("keydown", keydown_handler);
        document.addEventListener("keypress", keypress_handler);

        return () => {
            document.removeEventListener("keydown", keydown_handler);
            document.removeEventListener("keypress", keypress_handler);
        };
    }, [editor_focus, fe_keydown_handler, fwc_handlers_id]);

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
                                        <FileExplorer />
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

export default withHocEditorServiceProviders(Editor);
