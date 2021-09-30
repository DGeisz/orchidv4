import React, { useState } from "react";
import { useHandleOpenFile } from "../../service_providers/editor_comp_comm/editor_comp_comm";
import "./file_window_container_styles.scss";
import FileWindow from "./sub_screens/file_window/file_window";
import { DraggableCore } from "react-draggable";

const a = [1];

const FileWindowContainer: React.FC = () => {
    useHandleOpenFile((file_path) => {
        console.log("Received file path: ", file_path);
    }, []);

    const [child_widths, set_child_widths] = useState<number[]>(
        a.map(() => window.screen.width / Math.max(a.length, 1))
    );

    const [start_x, set_start_x] = useState<number[]>(a.map(() => 400));

    return (
        <div className="fwc-container">
            {a.map((_, index) => {
                // return <FileWindow window_index={index} />;
                const drag_id = `fw-handle-${index}`;

                if (index < a.length - 1) {
                    return (
                        <DraggableCore
                            handle={`#${drag_id}`}
                            onStart={(_, { x }) => {
                                let new_x = [...start_x];
                                new_x[index] = x - child_widths[index];
                                console.log("Starting: ", x);

                                set_start_x(new_x);
                            }}
                            onDrag={(_, { x }) => {
                                let new_widths = [...child_widths];
                                new_widths[index] = x - start_x[index];
                                console.log("Dragging: ", x);

                                set_child_widths(new_widths);
                            }}
                        >
                            <div
                                className="fwc-child-container"
                                style={{
                                    // width: child_widths[index],
                                    minWidth: child_widths[index],
                                }}
                            >
                                <FileWindow window_index={index} />
                                <div
                                    className="fwc-child-drag-bar"
                                    id={drag_id}
                                />
                            </div>
                        </DraggableCore>
                    );
                } else {
                    return <FileWindow window_index={index} />;
                }
            })}
        </div>
    );
};

export default FileWindowContainer;
