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
        children: OrchidFileTree[];
    };
}

export function is_orchid_module(oft: OrchidFileTree): oft is OrchidModule {
    return oft.hasOwnProperty("OrchidModule");
}

export type OrchidFileTree = OrchidFile | OrchidFolder | OrchidModule;
