import { OrchidFilePath } from "./orchid_file_path/orchid_file_path";

export interface OrchidFile {
    File: {
        file_name: string;
        formatted_name: string;
    };
}

export function is_orchid_file(oft: OrchidFileTree): oft is OrchidFile {
    return oft.hasOwnProperty("File");
}

export interface OrchidFolder {
    Folder: {
        folder_name: string;
        open: boolean;
        children: OrchidFileTree[];
    };
}

export function is_orchid_folder(oft: OrchidFileTree): oft is OrchidFolder {
    return oft.hasOwnProperty("Folder");
}

export interface OrchidModule {
    OrchidModule: {
        folder_name: string;
        formatted_name: string;
        open: boolean;
        children: OrchidFileTree[];
    };
}

export function is_orchid_module(oft: OrchidFileTree): oft is OrchidModule {
    return oft.hasOwnProperty("OrchidModule");
}

export type OrchidFileTree = OrchidFile | OrchidFolder | OrchidModule;

/* Gets the basic name of the node. Largely for node comparison */
export function get_oft_name(oft: OrchidFileTree): string {
    if (is_orchid_file(oft)) {
        return oft.File.file_name;
    } else if (is_orchid_folder(oft)) {
        return oft.Folder.folder_name;
    } else if (is_orchid_module(oft)) {
        return oft.OrchidModule.folder_name;
    }

    return "";
}

/* Convert to Orchid File Path link (just for the head of the tree) */
export function convert_to_path_link(oft: OrchidFileTree): OrchidFilePath {
    if (is_orchid_file(oft)) {
        return {
            File: {
                ...oft.File,
            },
        };
    } else if (is_orchid_folder(oft)) {
        return {
            Folder: {
                folder_name: oft.Folder.folder_name,
                child: null,
            },
        };
    } else if (is_orchid_module(oft)) {
        return {
            OrchidModule: {
                folder_name: oft.OrchidModule.folder_name,
                formatted_name: oft.OrchidModule.formatted_name,
                child: null,
            },
        };
    }

    return null;
}
