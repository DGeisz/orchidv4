import React, { useContext, useState } from "react";

export enum EditorFocus {
    file_explorer,
    file_window_container,
}

interface EFContextType {
    editor_focus: EditorFocus;
    take_focus: (focus: EditorFocus) => void;
}

const EFContext = React.createContext<EFContextType>({
    editor_focus: EditorFocus.file_explorer,
    take_focus: () => {},
});

export function withEditorFocus(Component: React.FC): React.FC {
    return (props) => {
        const [editor_focus, set_focus] = useState<EditorFocus>(
            EditorFocus.file_explorer
        );

        return (
            <EFContext.Provider
                value={{
                    editor_focus,
                    take_focus: set_focus,
                }}
            >
                {props.children}
            </EFContext.Provider>
        );
    };
}

export function useEditorFocus(): EditorFocus {
    const { editor_focus } = useContext(EFContext);

    return editor_focus;
}

export function useTakeEditorFocus(): (focus: EditorFocus) => void {
    const { take_focus } = useContext(EFContext);

    return take_focus;
}
