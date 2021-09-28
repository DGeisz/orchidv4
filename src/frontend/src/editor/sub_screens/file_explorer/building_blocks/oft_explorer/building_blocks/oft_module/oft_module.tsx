import React from "react";
import { OrchidModule } from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_tree";
import { OrchidFilePath } from "../../../../sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";

interface Props {
    module: OrchidModule;
    path: OrchidFilePath;
    indents: number;
    default_open: boolean;
    set_get_open_nodes: (set: () => () => OrchidFilePath[]) => void;
}

const OftModule: React.FC<Props> = (props) => {
    return <div />;
};

export default OftModule;
