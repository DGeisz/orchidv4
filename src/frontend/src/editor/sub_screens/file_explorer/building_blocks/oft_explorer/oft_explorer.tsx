import React from "react";
import {
    is_orchid_file,
    is_orchid_folder,
    is_orchid_module,
    OrchidFileTree,
} from "../../sub_agents/file_explorer_ws/portable_reps/orchid_file_tree";
import OftFile from "./building_blocks/oft_file/oft_file";
import OftFolder from "./building_blocks/oft_folder/oft_folder";
import OftModule from "./building_blocks/oft_module/oft_module";

interface Props {
    oft: OrchidFileTree;
    indents: number;
}

const OftExplorer: React.FC<Props> = (props) => {
    const { oft, indents } = props;

    if (is_orchid_file(oft)) {
        return <OftFile file={oft} indents={indents} />;
    } else if (is_orchid_folder(oft)) {
        return <OftFolder folder={oft} indents={indents} />;
    } else if (is_orchid_module(oft)) {
        return <OftModule module={oft} indents={indents} />;
    }

    return null;
};

export default OftExplorer;
