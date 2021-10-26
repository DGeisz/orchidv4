import React, { useEffect, useState } from "react";
import "./file_window_styles.scss";
import FileTab from "./building_blocks/file_tab/file_tab";
import { FileEditorMaster } from "./sub_screens/file_editor/sub_agents/file_editor_master/file_editor_master";
import {
    useClusterChildFocus,
    useRearrangeFileMasterCluster,
    useRemoveFileMasterFromCluster,
} from "../../service_providers/file_master_clusters/file_master_clusters";
import FileEditor from "./sub_screens/file_editor/file_editor";
import {
    useOnFwKeydown,
    useOnFwKeypress,
} from "../../service_providers/file_window_keyboard_handlers/file_window_keyboard_handlers";
import {
    KeyboardHandler,
    noOpHandler,
} from "../../../../../global_types/keyboard_events";
import { OrchidFilePath } from "../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Props {
    window_index: number;
    file_editor_masters: FileEditorMaster[];
    has_file_window_focus: boolean;
}

const FileWindow: React.FC<Props> = (props) => {
    // const [child_focus, set_child_focus] = useState<number>(0);
    const [child_focus, set_child_focus] = useClusterChildFocus(
        props.window_index
    );

    const remove_file_master = useRemoveFileMasterFromCluster(
        props.window_index
    );

    const rearrange_file_masters = useRearrangeFileMasterCluster(
        props.window_index
    );

    useEffect(() => {
        if (child_focus > props.file_editor_masters.length - 1) {
            set_child_focus(props.file_editor_masters.length - 1);
        }
    }, [props.file_editor_masters.length]);

    /* Set file window keyboard event handlers */
    let keydown: KeyboardHandler;
    let keypress: KeyboardHandler;

    let master_path: OrchidFilePath | null = null;

    if (!!props.file_editor_masters[child_focus]) {
        const master = props.file_editor_masters[child_focus];

        keydown = master.handle_keydown;
        keypress = master.handle_keypress;
        master_path = master.get_file_path();
    } else {
        keydown = noOpHandler;
        keypress = noOpHandler;
    }

    useOnFwKeydown(props.window_index, keydown, [child_focus, master_path]);
    useOnFwKeypress(props.window_index, keypress, [child_focus, master_path]);

    return (
        <div className="fw-container">
            <DragDropContext
                onDragEnd={(result) => {
                    if (!!result.destination) {
                        rearrange_file_masters(
                            result.source.index,
                            result.destination.index
                        );
                        set_child_focus(result.destination.index);
                    }
                }}
            >
                <Droppable droppableId="d1" direction="horizontal">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="fw-file-bar"
                        >
                            {props.file_editor_masters.map((master, i) => (
                                <Draggable
                                    key={master.get_file_id()}
                                    draggableId={master.get_file_id()}
                                    index={i}
                                >
                                    {(provided1) => {
                                        return (
                                            <div
                                                ref={provided1.innerRef}
                                                {...provided1.draggableProps}
                                                {...provided1.dragHandleProps}
                                            >
                                                <FileTab
                                                    file_editor_master={master}
                                                    tab_active={
                                                        i === child_focus
                                                    }
                                                    on_select={() =>
                                                        set_child_focus(i)
                                                    }
                                                    close_tab={() =>
                                                        remove_file_master(i)
                                                    }
                                                />
                                            </div>
                                        );
                                    }}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <div className="fw-body">
                <div className="left-swoosh">
                    <div className="left-swoosh-inner" />
                </div>
                <div className="right-swoosh">
                    <div className="right-swoosh-inner" />
                </div>
                <>
                    <FileEditor
                        file_editor_master={
                            props.file_editor_masters[child_focus]
                        }
                        has_file_window_focus={props.has_file_window_focus}
                    />
                </>
            </div>
        </div>
    );
};

export default FileWindow;
