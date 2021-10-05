import React, { useContext, useEffect, useState } from "react";
import { KeyboardHandler } from "../../../global_types/keyboard_events";
import { v4 } from "uuid";

interface HandlerContextType {
    keydown_handler: KeyboardHandler;
    set_keydown_handler: (handler: KeyboardHandler) => void;

    keypress_handler: KeyboardHandler;
    set_keypress_handler: (handler: KeyboardHandler) => void;

    handlers_id: string;
    set_handlers_id: (id: string) => void;
}

const HandlerContext = React.createContext<HandlerContextType>({
    keydown_handler: () => {},
    set_keydown_handler: () => {},

    keypress_handler: () => {},
    set_keypress_handler: () => {},

    handlers_id: "",
    set_handlers_id: () => {},
});

export function withFwcKeyboardHandlers(Component: React.FC): React.FC {
    return () => {
        const [keydown_handler, set_keydown_handler] =
            useState<KeyboardHandler>(() => () => {});

        const [keypress_handler, set_keypress_handler] =
            useState<KeyboardHandler>(() => () => {});

        const [handlers_id, set_handlers_id] = useState<string>("");

        return (
            <HandlerContext.Provider
                value={{
                    keydown_handler,
                    set_keydown_handler: (handler) =>
                        set_keydown_handler(() => handler),
                    keypress_handler,
                    set_keypress_handler: (handler) =>
                        set_keypress_handler(() => handler),
                    handlers_id,
                    set_handlers_id,
                }}
            >
                <Component />
            </HandlerContext.Provider>
        );
    };
}

/* First return is keydown, second is keypress,
 * third is string that uniquely ids these handlers
 */
export function useFwcKeyboardHandlers(): [
    KeyboardHandler,
    KeyboardHandler,
    string
] {
    const { keydown_handler, keypress_handler, handlers_id } =
        useContext(HandlerContext);

    return [keydown_handler, keypress_handler, handlers_id];
}

export function useOnFwcKeydown(handler: KeyboardHandler, dep_array: any[]) {
    const { set_keydown_handler, set_handlers_id } = useContext(HandlerContext);

    useEffect(() => {
        set_handlers_id(v4());
        set_keydown_handler(handler);
    }, dep_array);
}

export function useOnFwcKeypress(handler: KeyboardHandler, dep_array: any[]) {
    const { set_keypress_handler, set_handlers_id } =
        useContext(HandlerContext);

    useEffect(() => {
        set_handlers_id(v4());
        set_keypress_handler(handler);
    }, dep_array);
}
