import React, { useContext, useEffect, useState } from "react";

interface FWFContextType {
    set_file_window_focus: ((focus: number) => void)[];
    set_setter: (
        handler: (focus: number) => void,
        window_index: number
    ) => void;
}

const FWFContext = React.createContext<FWFContextType>({
    set_file_window_focus: [],
    set_setter: () => {},
});

export function withFileWindowFocus<T>(Component: React.FC<T>): React.FC<T> {
    return (props) => {
        const [set_file_window_focus, set_setter] = useState<
            ((focus: number) => void)[]
        >([]);

        return (
            <FWFContext.Provider
                value={{
                    set_file_window_focus,
                    set_setter: (
                        handler: (focus: number) => void,
                        window_index: number
                    ) => {
                        set_setter((prev) => {
                            const new_setters = [...prev];
                            new_setters[window_index] = handler;

                            return new_setters;
                        });
                    },
                }}
            >
                <Component {...props} />
            </FWFContext.Provider>
        );
    };
}

export function useSetFileWindowChildFocus(): (
    file_window_index: number,
    child_index: number
) => void {
    const { set_file_window_focus } = useContext(FWFContext);

    return (file_window_index: number, child_index: number) => {
        if (!!set_file_window_focus[file_window_index]) {
            set_file_window_focus[file_window_index](child_index);
        }
    };
}

export function useSetFileWindowFocusHandler(
    window_index: number,
    handler: (focus: number) => void,
    dep_array: any[]
) {
    const { set_setter } = useContext(FWFContext);

    useEffect(() => {
        set_setter(handler, window_index);
    }, dep_array);
}
