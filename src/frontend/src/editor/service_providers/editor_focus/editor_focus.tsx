import React, { useContext, useState } from "react";

export enum EditorFocus {
    file_explorer,
    file_window_container,
}

interface EFContextType {
    editor_focus: EditorFocus;
    take_focus: (focus: EditorFocus) => void;

    has_window_focus: boolean;
    set_window_focus: (focus: boolean) => void;
}

const EFContext = React.createContext<EFContextType>({
    editor_focus: EditorFocus.file_explorer,
    take_focus: () => {},

    has_window_focus: true,
    set_window_focus: () => {},
});

export function withEditorFocus(Component: React.FC): React.FC {
    return () => {
        const [editor_focus, set_focus] = useState<EditorFocus>(
            EditorFocus.file_explorer
        );

        const [window_focus, set_window_focus] = useState<boolean>(
            document.hasFocus()
        );

        return (
            <EFContext.Provider
                value={{
                    editor_focus,
                    take_focus: set_focus,
                    has_window_focus: window_focus,
                    set_window_focus,
                }}
            >
                <Component />
            </EFContext.Provider>
        );
    };
}

export function useEditorFocus(): EditorFocus {
    return useContext(EFContext).editor_focus;
}

export function useTakeEditorFocus(): (focus: EditorFocus) => void {
    return useContext(EFContext).take_focus;
}

export function useWindowFocus(): boolean {
    return useContext(EFContext).has_window_focus;
}

export function useSetWindowFocus(): (focus: boolean) => void {
    return useContext(EFContext).set_window_focus;
}
