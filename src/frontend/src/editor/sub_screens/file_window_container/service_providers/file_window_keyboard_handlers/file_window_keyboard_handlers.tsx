import React, { useContext, useEffect, useState } from "react";
import { KeyboardHandler } from "../../../../../global_types/keyboard_events";
import { v4 } from "uuid";

interface HandlerContextType {
    keydown_handlers: KeyboardHandler[];
    set_keydown_handler: (
        handler: KeyboardHandler,
        window_index: number
    ) => void;

    keypress_handlers: KeyboardHandler[];
    set_keypress_handler: (
        handler: KeyboardHandler,
        window_index: number
    ) => void;

    handlers_id: string;
    set_handlers_id: (id: string) => void;
}

const HandlerContext = React.createContext<HandlerContextType>({
    keydown_handlers: [],
    set_keydown_handler: () => {},

    keypress_handlers: [],
    set_keypress_handler: () => {},

    handlers_id: "",
    set_handlers_id: () => {},
});

export function withFwKeyboardHandlers<T>(Component: React.FC<T>): React.FC<T> {
    return (props) => {
        const [keydown_handlers, set_keydown_handlers] = useState<
            KeyboardHandler[]
        >([]);

        const [keypress_handlers, set_keypress_handlers] = useState<
            KeyboardHandler[]
        >([]);

        const [handlers_id, set_handlers_id] = useState<string>("");

        return (
            <HandlerContext.Provider
                value={{
                    keydown_handlers,
                    set_keydown_handler: (handler, window_index) => {
                        const new_handlers = [...keydown_handlers];
                        new_handlers[window_index] = handler;

                        set_keydown_handlers(() => new_handlers);
                    },
                    keypress_handlers,
                    set_keypress_handler: (handler, window_index) => {
                        const new_handlers = [...keypress_handlers];
                        new_handlers[window_index] = handler;

                        set_keypress_handlers(() => new_handlers);
                    },
                    handlers_id,
                    set_handlers_id,
                }}
            >
                <Component {...props} />
            </HandlerContext.Provider>
        );
    };
}

function defaultHandler() {
    console.log("From default handler");
}

/* First return is keydown, second is keypress,
third is a string that uniquely ids these handlers*/
export function useFwKeyboardHandlers(
    window_index: number
): [KeyboardHandler, KeyboardHandler, string] {
    const {
        keypress_handlers,
        keydown_handlers,
        handlers_id,
        set_handlers_id,
    } = useContext(HandlerContext);

    let keydown = keydown_handlers[window_index];
    let keypress = keypress_handlers[window_index];

    useEffect(() => {
        setTimeout(() => set_handlers_id(v4()), 200);
    }, []);

    if (!keydown) {
        keydown = defaultHandler;
    }

    if (!keypress) {
        keypress = defaultHandler;
    }

    return [keydown, keypress, handlers_id];
}

export function useOnFwKeydown(
    window_index: number,
    handler: KeyboardHandler,
    dep_array: any[]
) {
    const { set_keydown_handler, set_handlers_id } = useContext(HandlerContext);

    useEffect(() => {
        set_handlers_id(v4());
        set_keydown_handler(handler, window_index);
    }, dep_array);
}

export function useOnFwKeypress(
    window_index: number,
    handler: KeyboardHandler,
    dep_array: any[]
) {
    const { set_keypress_handler, set_handlers_id } =
        useContext(HandlerContext);

    useEffect(() => {
        set_handlers_id(v4());
        set_keypress_handler(handler, window_index);
    }, dep_array);
}
