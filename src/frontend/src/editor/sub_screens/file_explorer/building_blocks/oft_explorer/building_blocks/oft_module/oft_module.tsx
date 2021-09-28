import React from "react";
import { OrchidModule } from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_tree";
import { OrchidFilePath } from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";

interface Props {
    module: OrchidModule;
    path: OrchidFilePath;
    indents: number;
    default_open: boolean;
    move_cursor_up_externally: (old_file: string) => void;
    move_cursor_down_externally: (old_file: string) => void;
}

const OftModule: React.FC<Props> = (props) => {
    return <div />;
};

export default OftModule;
