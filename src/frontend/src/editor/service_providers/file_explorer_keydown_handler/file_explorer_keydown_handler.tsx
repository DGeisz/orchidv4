import React, { useContext, useEffect, useState } from "react";
import { KeyboardHandler } from "../../../global_types/keyboard_events";

interface FEKHContextType {
    keydown_handler: KeyboardHandler;
    set_keydown_handler: (handler: KeyboardHandler) => void;
}

const FEKHContext = React.createContext<FEKHContextType>({
    keydown_handler: () => {},
    set_keydown_handler: () => {},
});

export function withFileExplorerKeydown(Component: React.FC): React.FC {
    return () => {
        const [keydown_handler, set_handler] = useState<KeyboardHandler>(
            () => () => {}
        );

        return (
            <FEKHContext.Provider
                value={{
                    keydown_handler,
                    set_keydown_handler: (handler) =>
                        set_handler(() => handler),
                }}
            >
                <Component />
            </FEKHContext.Provider>
        );
    };
}

export function useExplorerKeydown(): KeyboardHandler {
    const { keydown_handler } = useContext(FEKHContext);

    return keydown_handler;
}

export function useOnExplorerKeydown(
    handler: KeyboardHandler,
    dep_array: any[]
) {
    const { set_keydown_handler } = useContext(FEKHContext);

    useEffect(() => {
        set_keydown_handler(handler);
    }, dep_array);
}
