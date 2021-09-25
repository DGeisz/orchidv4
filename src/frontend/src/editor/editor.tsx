import React, { useState } from "react";
import "./editor_styles.scss";
import { DraggableCore } from "react-draggable";
import EditorHeader from "./building_blocks/editor_header/editor_header";
import { HiMenu } from "react-icons/hi";
import { palette } from "../global_styles/palette";

const Editor: React.FC = () => {
    const [width, set_width] = useState<number>(200);

    const [file_explorer_visible, show_file_explorer] = useState<boolean>(true);

    return (
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
    );

    //
    // return (
    //     <DraggableCore
    //         handle=".handle"
    //         onDrag={(e, { x }) => {
    //             set_width(x);
    //         }}
    //     >
    //         <div className="out-container">
    //             <div className="left" style={{ width, minWidth: 100 }}>
    //                 Help
    //                 <div className="handle" />
    //             </div>
    //             <div className="right" style={{ minWidth: 100 }}>
    //                 Oh yeah
    //             </div>
    //         </div>
    //     </DraggableCore>
    // );
};

export default Editor;
