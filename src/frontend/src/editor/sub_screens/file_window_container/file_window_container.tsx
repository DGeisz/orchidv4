import React, { useState } from "react";
import { useHandleOpenFile } from "../../service_providers/editor_comp_comm/editor_comp_comm";
import "./file_window_container_styles.scss";
import FileWindow from "./sub_screens/file_window/file_window";
import { DraggableCore } from "react-draggable";
import { FileEditorMaster } from "./sub_screens/file_window/sub_screens/file_editor/sub_agents/file_editor_master/file_editor_master";
import { useFileWindowContainerWs } from "./sub_agents/file_window_container_ws/file_window_container_ws";
import { res_is_full_vrs } from "./sub_agents/file_window_container_ws/basic_msgs/fwc_ws_res";
import { useSetFileWindowChildFocus } from "./service_providers/file_window_focus/file_window_focus";
import { useFileMasterClusters } from "./service_providers/file_master_clusters/file_master_clusters";
import { withFWCHocServiceProviders } from "./service_providers/with_file_window_hoc_service_providers";

const FileWindowContainer: React.FC = () => {
    const [focused_file_window, set_focused_file_window] = useState<number>(-1);

    const [file_master_clusters, set_fmc] = useFileMasterClusters();

    const set_file_window_child_editor_focus = useSetFileWindowChildFocus();

    const fwc_ws = useFileWindowContainerWs(
        (res, fwc_id) => {
            if (res_is_full_vrs(res)) {
                if (res.FullVRS.caller_id === fwc_id) {
                    const { vrs } = res.FullVRS;

                    let file_window_index = -1;
                    let file_editor_index = -1;

                    /* First see we have a file open with the given path */
                    outer: for (
                        let i = 0;
                        i < file_master_clusters.length;
                        i++
                    ) {
                        const file_window = file_master_clusters[i];

                        for (let k = 0; k < file_window.length; k++) {
                            const file_editor_master = file_window[k];

                            if (file_editor_master.path_eq(vrs.file_path)) {
                                file_window_index = i;
                                file_editor_index = k;

                                break outer;
                            }
                        }
                    }

                    /* If file window index and file editor index
                     * are greater than zero, that means we already
                     * have reference to this file, so we simply
                     * put the corresponding window and file in focus */
                    if (file_window_index > -1 && file_editor_index > -1) {
                        set_focused_file_window(file_window_index);
                        set_file_window_child_editor_focus(
                            file_window_index,
                            file_editor_index
                        );
                    } else {
                        /* Otherwise, we need to create
                         * a new file editor in the focused window */
                        const new_file_master = new FileEditorMaster(vrs);

                        set_fmc(() => {
                            if (file_master_clusters.length === 0) {
                                set_focused_file_window(0);

                                return [[new_file_master]];
                            } else {
                                const new_list = [...file_master_clusters];
                                const old_window =
                                    new_list[focused_file_window];

                                let new_window;

                                if (!!old_window && old_window.length > 0) {
                                    new_window = [
                                        new_file_master,
                                        ...old_window,
                                    ];
                                } else {
                                    new_window = [new_file_master];
                                }

                                new_list[focused_file_window] = new_window;

                                return new_list;
                            }
                        });
                    }
                }
            }
        },
        [file_master_clusters, focused_file_window]
    );

    useHandleOpenFile(
        (file_path) => {
            /* We could manually verify at this point,
             * but why bother when we already handled all the logic
             * in the res handler
             */
            fwc_ws.open_file(file_path);
        },
        [file_master_clusters]
    );

    /* Next two pieces of state are specifically
     * for handling the width of different windows */
    const [child_widths, set_child_widths] = useState<number[]>(
        file_master_clusters.map(
            () => window.screen.width / Math.max(file_master_clusters.length, 1)
        )
    );

    const [start_x, set_start_x] = useState<number[]>(
        file_master_clusters.map(() => 400)
    );

    if (file_master_clusters.length > 0) {
        return (
            <div className="fwc-container">
                {file_master_clusters.map((fems, index) => {
                    const drag_id = `fw-handle-${index}`;

                    if (index < file_master_clusters.length - 1) {
                        return (
                            <DraggableCore
                                key={`fwc${index}`}
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
                                    <FileWindow
                                        window_index={index}
                                        file_editor_masters={fems}
                                        has_file_window_focus={
                                            focused_file_window === index
                                        }
                                    />
                                    <div
                                        className="fwc-child-drag-bar"
                                        id={drag_id}
                                    />
                                </div>
                            </DraggableCore>
                        );
                    } else {
                        return (
                            <FileWindow
                                key={`fwc${index}`}
                                window_index={index}
                                file_editor_masters={fems}
                                has_file_window_focus={
                                    focused_file_window === index
                                }
                            />
                        );
                    }
                })}
            </div>
        );
    } else {
        return (
            <div className="fwc-empty-container">Create or open a file 🤗</div>
        );
    }
};

export default withFWCHocServiceProviders(FileWindowContainer);
