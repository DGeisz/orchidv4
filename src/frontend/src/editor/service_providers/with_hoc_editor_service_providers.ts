import React from "react";
import { withFileExplorerKeydown } from "./file_explorer_keydown_handler/file_explorer_keydown_handler";
import { withEditorFocus } from "./editor_focus/editor_focus";
import { withFwcKeyboardHandlers } from "./fwc_keyboard_handlers/fwc_keyboard_handlers";

export function withHocEditorServiceProviders(Component: React.FC): React.FC {
    return withFwcKeyboardHandlers(
        withFileExplorerKeydown(withEditorFocus(Component))
    );
}
