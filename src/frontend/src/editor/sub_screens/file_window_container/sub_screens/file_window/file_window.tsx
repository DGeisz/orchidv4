import React, { useEffect, useState } from "react";
import "./file_window_styles.scss";
import FileTab from "./building_blocks/file_tab/file_tab";
import { FileEditorMaster } from "./sub_screens/file_editor/sub_agents/file_editor_master/file_editor_master";
import { useSetFileWindowFocusHandler } from "../../service_providers/file_window_focus/file_window_focus";
import { useRemoveFileMasterFromCluster } from "../../service_providers/file_master_clusters/file_master_clusters";
import FileEditor from "./sub_screens/file_editor/file_editor";
import {
    useOnFwKeydown,
    useOnFwKeypress,
} from "../../service_providers/file_window_keyboard_handlers/file_window_keyboard_handlers";
import {
    KeyboardHandler,
    noOpHandler,
} from "../../../../../global_types/keyboard_events";
import { useOnFwcKeypress } from "../../../../service_providers/fwc_keyboard_handlers/fwc_keyboard_handlers";
import { OrchidFilePath } from "../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";

interface Props {
    window_index: number;
    file_editor_masters: FileEditorMaster[];
    has_file_window_focus: boolean;
}

const FileWindow: React.FC<Props> = (props) => {
    const [child_focus, set_child_focus] = useState<number>(0);

    const remove_file_master = useRemoveFileMasterFromCluster(
        props.window_index
    );

    useEffect(() => {
        if (child_focus > props.file_editor_masters.length - 1) {
            set_child_focus(props.file_editor_masters.length - 1);
        }
    }, [props.file_editor_masters.length]);

    useSetFileWindowFocusHandler(
        props.window_index,
        (focus) => {
            set_child_focus(focus);
        },
        []
    );

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
            <div className="fw-file-bar">
                {props.file_editor_masters.map((master, i) => (
                    <FileTab
                        key={master.get_file_id()}
                        file_name={master.get_formatted_name()}
                        tab_active={i === child_focus}
                        on_select={() => set_child_focus(i)}
                        close_tab={() => remove_file_master(i)}
                    />
                ))}
            </div>
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
                    />
                </>
            </div>
        </div>
    );
};

export default FileWindow;
