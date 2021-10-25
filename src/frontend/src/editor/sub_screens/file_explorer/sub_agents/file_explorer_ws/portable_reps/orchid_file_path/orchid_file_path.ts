export interface FileLink {
    File: {
        file_name: string;
        formatted_name: string;
    };
}

export function is_file_link(ofp: OrchidFilePath): ofp is FileLink {
    return !!ofp && ofp.hasOwnProperty("File");
}

export interface FolderLink {
    Folder: {
        folder_name: string;
        child: OrchidFilePath;
    };
}

export function is_folder_link(ofp: OrchidFilePath): ofp is FolderLink {
    return !!ofp && ofp.hasOwnProperty("Folder");
}

export interface ModuleLink {
    OrchidModule: {
        folder_name: string;
        formatted_name: string;
        child: OrchidFilePath;
    };
}

export function is_module_link(ofp: OrchidFilePath): ofp is ModuleLink {
    return !!ofp && ofp.hasOwnProperty("OrchidModule");
}

export type OrchidFilePath = FileLink | FolderLink | ModuleLink | null;

/* Now add the Orchid open files */
export interface OrchidOpenFiles {
    clusters: OrchidFileCluster[];
}

interface OrchidFileCluster {
    focused_child: number;
    file_paths: OrchidFilePath[];
}

export function clone_file_path(ofp: OrchidFilePath): OrchidFilePath {
    if (is_file_link(ofp)) {
        return { ...ofp };
    } else if (is_folder_link(ofp)) {
        let new_folder = { ...ofp };
        new_folder.Folder.child = clone_file_path(ofp.Folder.child);

        return new_folder;
    } else if (is_module_link(ofp)) {
        let new_module = { ...ofp };
        new_module.OrchidModule.child = clone_file_path(ofp.OrchidModule.child);

        return new_module;
    } else {
        return null;
    }
}

function has_children(ofp: OrchidFilePath): boolean {
    if (is_folder_link(ofp)) {
        return !!ofp.Folder.child;
    } else if (is_module_link(ofp)) {
        return !!ofp.OrchidModule.child;
    }

    /* Both file and null have no children */
    return false;
}

export function file_path_eq(
    base_path: OrchidFilePath,
    cmp_path: OrchidFilePath
): boolean {
    if (is_folder_link(base_path) && is_folder_link(cmp_path)) {
        const base_folder = base_path.Folder;
        const cmp_folder = cmp_path.Folder;

        if (base_folder.folder_name === cmp_folder.folder_name) {
            return file_path_eq(base_folder.child, cmp_folder.child);
        }
    } else if (is_module_link(base_path) && is_module_link(cmp_path)) {
        /* Perform identical steps as above for module */
        const base_mod = base_path.OrchidModule;
        const cmp_mod = cmp_path.OrchidModule;

        if (base_mod.folder_name === cmp_mod.folder_name) {
            return file_path_eq(base_mod.child, cmp_mod.child);
        }
    } else if (is_file_link(base_path) && is_file_link(cmp_path)) {
        /* For this, we simply need to check whether the file names
         * are the same */
        return base_path.File.file_name === cmp_path.File.file_name;
    } else if (base_path === null && cmp_path === null) {
        return true;
    }

    return false;
}

/* First return indicates whether the cmp_path references
 * the parent link of the base_path, second return indicates
 * whether the two paths are equal*/
export function compare_file_path(
    base_path: OrchidFilePath,
    cmp_path: OrchidFilePath
): {
    is_parent: boolean;
    is_equal: boolean;
} {
    if (is_folder_link(base_path) && is_folder_link(cmp_path)) {
        const base_folder = base_path.Folder;
        const cmp_folder = cmp_path.Folder;

        /* First check if the paths are coherent */
        if (base_folder.folder_name === cmp_folder.folder_name) {
            /* Check for parent condition: cmp_path doesn't have a child,
             * and base_path does. */
            if (!cmp_folder.child && !!base_folder.child) {
                /* We also need to check that base's child doesn't have
                 * any children */
                return {
                    is_parent: !has_children(base_folder.child),
                    is_equal: false,
                };
            }

            /* Otherwise, comparison depends on the children */
            return compare_file_path(base_folder.child, cmp_folder.child);
        }
    } else if (is_module_link(base_path) && is_module_link(cmp_path)) {
        /* Perform identical steps as above for module */
        const base_mod = base_path.OrchidModule;
        const cmp_mod = cmp_path.OrchidModule;

        if (base_mod.folder_name === cmp_mod.folder_name) {
            if (!cmp_mod.child && !!base_mod.child) {
                return {
                    is_parent: !has_children(base_mod.child),
                    is_equal: false,
                };
            }

            return compare_file_path(base_mod.child, cmp_mod.child);
        }
    } else if (is_file_link(base_path) && is_file_link(cmp_path)) {
        /* For this, we simply need to check whether the file names
         * are the same */
        return {
            is_parent: false,
            is_equal: base_path.File.file_name === cmp_path.File.file_name,
        };
    } else if (base_path === null && cmp_path === null) {
        return {
            is_parent: false,
            is_equal: true,
        };
    }

    /* Default */
    return {
        is_equal: false,
        is_parent: false,
    };
}

export function append_file_link(
    base_path: OrchidFilePath,
    new_link: OrchidFilePath
): OrchidFilePath {
    if (is_folder_link(base_path)) {
        if (!!base_path.Folder.child) {
            /* If folder has child, then we append the new link to the child path */
            return {
                Folder: {
                    ...base_path.Folder,
                    child: append_file_link(base_path.Folder.child, new_link),
                },
            };
        } else {
            /* If folder doesn't have a child, then slap the new link right
             * on that bad boi */
            return {
                Folder: {
                    ...base_path.Folder,
                    child: new_link,
                },
            };
        }
    } else if (is_module_link(base_path)) {
        /* Identical logic as with folder */
        if (!!base_path.OrchidModule.child) {
            return {
                OrchidModule: {
                    ...base_path.OrchidModule,
                    child: append_file_link(
                        base_path.OrchidModule.child,
                        new_link
                    ),
                },
            };
        } else {
            return {
                OrchidModule: {
                    ...base_path.OrchidModule,
                    child: new_link,
                },
            };
        }
    }

    /* In any other case, we throw an exception
     * because we can't append to a file or null */
    throw new Error("Can't append to file or null");
}

/* Switches the last link of the list with a new element */
export function switch_last_link(
    base_path: OrchidFilePath,
    new_link: OrchidFilePath
): OrchidFilePath {
    if (is_folder_link(base_path)) {
        /* Let's check if it has a child */
        if (!!base_path.Folder.child) {
            /* Given that it has a child, we recursively call the method on
             * the child*/
            return {
                Folder: {
                    ...base_path.Folder,
                    child: switch_last_link(base_path.Folder.child, new_link),
                },
            };
        }
    } else if (is_module_link(base_path)) {
        /* Logic is identical to switch last link */
        if (!!base_path.OrchidModule.child) {
            return {
                OrchidModule: {
                    ...base_path.OrchidModule,
                    child: switch_last_link(
                        base_path.OrchidModule.child,
                        new_link
                    ),
                },
            };
        }
    }

    /* We checked all cases where the base node isn't
     * the last link, so if we're here, it means base_path
     * is at its last link, which means we simply return the new_link */
    return new_link;
}

export function remove_last_link(base_path: OrchidFilePath): OrchidFilePath {
    if (is_folder_link(base_path)) {
        if (!!base_path.Folder.child) {
            return {
                Folder: {
                    ...base_path.Folder,
                    child: remove_last_link(base_path.Folder.child),
                },
            };
        }
    } else if (is_module_link(base_path)) {
        if (!!base_path.OrchidModule.child) {
            return {
                OrchidModule: {
                    ...base_path.OrchidModule,
                    child: remove_last_link(base_path.OrchidModule.child),
                },
            };
        }
    }

    return null;
}
