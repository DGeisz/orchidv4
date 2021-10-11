import React, { useContext, useEffect, useState } from "react";
import { CURSOR_NAME } from "../../sub_screens/file_window/sub_screens/file_editor/utils/latex_utils";

interface CursorBlinkType {
    restart_cursor: () => void;
}

const CursorBlinkContext = React.createContext<CursorBlinkType>({
    restart_cursor: () => {},
});

export const CursorBlinkProvider: React.FC = (props) => {
    const [cursor_index, set_index] = useState<number>(0);

    useEffect(() => {
        const cursor_obj = document.getElementById(CURSOR_NAME);

        if (!!cursor_obj) {
            cursor_obj.style.visibility = "visible";
        }

        const interval = setInterval(() => {
            const cursor_obj = document.getElementById(CURSOR_NAME);

            if (!!cursor_obj) {
                cursor_obj.style.visibility =
                    cursor_obj.style.visibility === "hidden"
                        ? "visible"
                        : "hidden";
            }
        }, 530);

        return () => {
            clearInterval(interval);
        };
    }, [cursor_index]);

    return (
        <CursorBlinkContext.Provider
            value={{
                restart_cursor: () => {
                    set_index((cursor_index) => cursor_index + 1);
                },
            }}
        >
            {props.children}
        </CursorBlinkContext.Provider>
    );
};

export const useRestartCursor = () => {
    return useContext(CursorBlinkContext).restart_cursor;
};
