import React, { useEffect, useState } from "react";
import "./file_editor_styles.scss";
import RctNode from "./building_blocks/rct_node/rct_node";
import { EditorContext } from "./context/EditorContext";
import { AVRNode } from "./editor_types/assembled_visual_rep/assembled_visual_rep";
import { GridLoader } from "react-spinners";
import { palette } from "../../../../../../../global_styles/palette";
import { FileEditorMaster } from "./sub_agents/file_editor_master/file_editor_master";
import { useWindowFocus } from "../../../../../../service_providers/editor_focus/editor_focus";
import { useRestartCursor } from "../../../../service_providers/cursor_blink/cursor_blink";

interface Props {
    file_editor_master: FileEditorMaster;
    has_file_window_focus: boolean;
}

const FileEditor: React.FC<Props> = (props) => {
    const [select_socket, set_select_socket] = useState<
        (socket_id: string) => void
    >(() => {});

    const [file_hydrated, set_hydrated] = useState<boolean>(false);

    const [select_mode, set_select_mode] = useState<boolean>(false);
    const [select_seq, set_select_seq] = useState<string>("");

    const [edit_rep_mode, set_edit_rep_mode] = useState<boolean>(false);
    const [edit_rep_id, set_edit_rep_id] = useState<string>("");

    const [assembled_visual_rep, set_avr] = useState<AVRNode>();

    const window_in_focus = useWindowFocus();

    const restart_cursor = useRestartCursor();

    useEffect(() => {
        if (window_in_focus && props.has_file_window_focus) {
            props.file_editor_master.set_has_focus(true);
        } else {
            props.file_editor_master.set_has_focus(false);
        }
    }, [window_in_focus, props.has_file_window_focus]);

    useEffect(() => {
        props.file_editor_master.set_set_avr(set_avr);
        props.file_editor_master.set_set_external_select_mode(set_select_mode);
        props.file_editor_master.set_set_external_select_seq(set_select_seq);
        props.file_editor_master.set_set_external_rep_id(set_edit_rep_id);
        props.file_editor_master.set_set_external_rep_mode(set_edit_rep_mode);
        props.file_editor_master.set_restart_cursor(restart_cursor);

        set_select_socket(() => props.file_editor_master.select_socket);
        props.file_editor_master.process_change();

        if (props.file_editor_master.is_hydrated()) {
            set_hydrated(true);
        } else {
            set_hydrated(false);
            props.file_editor_master.add_on_hydrated(() => set_hydrated(true));
        }

        return () => {
            /* Clear out all the connections between the old
             * file editor master and the editor view */
            props.file_editor_master.set_set_avr(() => {});
            props.file_editor_master.set_set_external_select_mode(() => {});
            props.file_editor_master.set_set_external_select_seq(() => {});
            props.file_editor_master.set_set_external_rep_id(() => {});
            props.file_editor_master.set_set_external_rep_mode(() => {});
            props.file_editor_master.set_restart_cursor(() => {});

            set_select_socket(() => () => {});
        };
    }, [props.file_editor_master.get_file_id()]);

    if (!!assembled_visual_rep && file_hydrated) {
        return (
            <EditorContext.Provider
                value={{
                    select_socket,
                    select_mode,
                    select_seq,
                    edit_rep_mode,
                    edit_rep_id,
                    page_id: "",
                }}
            >
                <RctNode avr_node={assembled_visual_rep} />
            </EditorContext.Provider>
        );
    } else {
        return (
            <div className="fe-loading-container">
                <GridLoader size={20} color={palette.mediumForestGreen} />
            </div>
        );
    }
};

export default FileEditor;
