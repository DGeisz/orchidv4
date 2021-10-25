import React, { useContext, useEffect, useState } from "react";

interface CEContextType {
    save_open_folders: () => void;
    set_save_handler: (handler: () => void) => void;
}

const CEContext = React.createContext<CEContextType>({
    save_open_folders: () => {},
    set_save_handler: () => {},
});

export function withConfigEvents<T>(Component: React.FC<T>): React.FC<T> {
    return (props) => {
        const [save_folders_i, set_save_folders_i] = useState<number>(0);
        const [save_handler, set_save_handler] = useState<() => void>(() => {});

        useEffect(() => {
            if (save_folders_i > 0) {
                save_handler();
            }
        }, [save_folders_i]);

        return (
            <CEContext.Provider
                value={{
                    save_open_folders: () =>
                        set_save_folders_i(save_folders_i + 1),
                    set_save_handler: (handler: () => void) =>
                        set_save_handler(() => handler),
                }}
            >
                <Component {...props} />
            </CEContext.Provider>
        );
    };
}

export function useSaveFolders(): () => void {
    return useContext(CEContext).save_open_folders;
}

export function useSaveFoldersHandler(handler: () => void, dep_array: any[]) {
    const { set_save_handler } = useContext(CEContext);

    useEffect(() => {
        set_save_handler(handler);

        return () => set_save_handler(() => {});
    }, dep_array);
}
