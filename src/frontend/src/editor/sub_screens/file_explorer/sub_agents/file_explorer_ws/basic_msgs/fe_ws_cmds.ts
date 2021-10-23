/** Command to get the root file structure */
import { OrchidOpenFolders } from "../portable_reps/orchid_open_folders";

export const GetRootOFT = JSON.stringify("GetRootOFT");

/** Command to persist open folders */
export interface SaveOpenFoldersCmd {
    SaveOpenFolders: {
        open_folders: OrchidOpenFolders;
    };
}
