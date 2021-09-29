import React, { useContext, useEffect, useState } from "react";
import { OrchidFilePath } from "../../sub_screens/file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";

interface ECCContextType {
    open_file: (path: OrchidFilePath) => void;
    set_open_file: (handler: (path: OrchidFilePath) => void) => void;
}

const ECCContext = React.createContext<ECCContextType>({
    open_file: () => {},
    set_open_file: () => {},
});

/* Here CompComm stands for component service_providers */
export const EditorCompCommProvider: React.FC = (props) => {
    const [open_file, set_open_file] = useState<(path: OrchidFilePath) => void>(
        () => () => {}
    );

    return (
        <ECCContext.Provider
            value={{
                open_file,
                set_open_file: (handler) => set_open_file(() => handler),
            }}
        >
            {props.children}
        </ECCContext.Provider>
    );
};

/* Hook used handle opening files  */
export function useHandleOpenFile(
    handler: (file_path: OrchidFilePath) => void,
    dep_array: any[]
) {
    const { set_open_file } = useContext(ECCContext);

    useEffect(() => {
        set_open_file(handler);
    }, dep_array);
}

/* Hook used that simply returns open_file */
export function useOpenFile() {
    const { open_file } = useContext(ECCContext);

    return open_file;
}
