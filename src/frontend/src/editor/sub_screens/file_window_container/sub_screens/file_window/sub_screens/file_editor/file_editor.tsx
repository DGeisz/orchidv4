import React, { useState } from "react";
import RctNode from "./building_blocks/rct_node/rct_node";
import { EditorContext } from "./context/EditorContext";
import { exampleNode } from "./editor_types/assembled_visual_rep/assembled_visual_rep";

const FileEditor: React.FC = () => {
    const [select_socket, set_select_socket] = useState<
        (socket_id: string) => void
    >(() => {});
    const [select_mode, set_select_mode] = useState<boolean>(false);
    const [select_seq, set_select_seq] = useState<string>("");

    const [edit_rep_mode, set_edit_rep_mode] = useState<boolean>(false);
    const [edit_rep_id, set_edit_rep_id] = useState<string>("");

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
            <RctNode avr_node={exampleNode} />
        </EditorContext.Provider>
    );
};

export default FileEditor;
