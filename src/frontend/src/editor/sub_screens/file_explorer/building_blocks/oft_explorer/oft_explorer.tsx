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
import {
    append_file_link,
    OrchidFilePath,
} from "../../sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { OrchidOpenFolders } from "../../sub_agents/file_explorer_ws/portable_reps/orchid_open_folders";

interface Props {
    oft: OrchidFileTree;
    parent_path: OrchidFilePath;
    indents: number;
    default_open: boolean;
    set_get_open_nodes: (set: () => () => OrchidFilePath[]) => void;
    set_get_open_folders: (set: () => () => OrchidOpenFolders) => void;
}

const OftExplorer: React.FC<Props> = (props) => {
    const { oft, indents } = props;

    if (is_orchid_file(oft)) {
        const new_link: OrchidFilePath = {
            File: {
                ...oft.File,
            },
        };

        const new_path = !!props.parent_path
            ? append_file_link(props.parent_path, new_link)
            : new_link;

        return (
            <OftFile
                file={oft}
                indents={indents}
                path={new_path}
                set_get_open_nodes={props.set_get_open_nodes}
            />
        );
    } else if (is_orchid_folder(oft)) {
        const new_link: OrchidFilePath = {
            Folder: {
                folder_name: oft.Folder.folder_name,
                child: null,
            },
        };

        const new_path = !!props.parent_path
            ? append_file_link(props.parent_path, new_link)
            : new_link;

        return (
            <OftFolder
                folder={oft}
                path={new_path}
                indents={indents}
                default_open={props.default_open}
                set_get_open_nodes={props.set_get_open_nodes}
                set_get_open_folders={props.set_get_open_folders}
            />
        );
    } else if (is_orchid_module(oft)) {
        const new_link: OrchidFilePath = {
            OrchidModule: {
                formatted_name: oft.OrchidModule.formatted_name,
                folder_name: oft.OrchidModule.folder_name,
                child: null,
            },
        };

        const new_path = !!props.parent_path
            ? append_file_link(props.parent_path, new_link)
            : new_link;

        return (
            <OftModule
                module={oft}
                path={new_path}
                indents={indents}
                default_open={props.default_open}
                set_get_open_nodes={props.set_get_open_nodes}
            />
        );
    }

    return null;
};

export default OftExplorer;
