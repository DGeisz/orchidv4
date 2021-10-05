import React, { useContext, useEffect, useState } from "react";
import { KeyboardHandler } from "../../../global_types/keyboard_events";

interface HandlerContextType {
    keydown_handler: KeyboardHandler;
    set_keydown_handler: (handler: KeyboardHandler) => void;

    keypress_handler: KeyboardHandler;
    set_keypress_handler: (handler: KeyboardHandler) => void;
}

const HandlerContext = React.createContext<HandlerContextType>({
    keydown_handler: () => {},
    set_keydown_handler: () => {},
    keypress_handler: () => {},
    set_keypress_handler: () => {},
});

export function withFwcKeyboardHandlers(Component: React.FC): React.FC {
    return () => {
        const [keydown_handler, set_keydown_handler] =
            useState<KeyboardHandler>(() => () => {});

        const [keypress_handler, set_keypress_handler] =
            useState<KeyboardHandler>(() => () => {});

        return (
            <HandlerContext.Provider
                value={{
                    keydown_handler,
                    set_keydown_handler: (handler) =>
                        set_keydown_handler(() => handler),
                    keypress_handler,
                    set_keypress_handler: (handler) =>
                        set_keypress_handler(() => handler),
                }}
            >
                <Component />
            </HandlerContext.Provider>
        );
    };
}

/* First return is keydown, second is keypress*/
export function useFwcKeyboardHandlers(): [KeyboardHandler, KeyboardHandler] {
    const { keydown_handler, keypress_handler } = useContext(HandlerContext);

    return [keydown_handler, keypress_handler];
}

export function useOnFwcKeydown(handler: KeyboardHandler, dep_array: any[]) {
    const { set_keydown_handler } = useContext(HandlerContext);

    useEffect(() => {
        set_keydown_handler(handler);
    }, dep_array);
}

export function useOnFwcKeypress(handler: KeyboardHandler, dep_array: any[]) {
    const { set_keypress_handler } = useContext(HandlerContext);

    useEffect(() => {
        set_keypress_handler(handler);
    }, dep_array);
}
