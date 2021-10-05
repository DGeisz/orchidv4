import React from "react";
import { withFileMasterClusters } from "./file_master_clusters/file_master_clusters";
import { withFileWindowFocus } from "./file_window_focus/file_window_focus";
import { withFwKeyboardHandlers } from "./file_window_keyboard_handlers/file_window_keyboard_handlers";

export function withFWCHocServiceProviders<T>(
    Component: React.FC<T>
): React.FC<T> {
    return withFwKeyboardHandlers(
        withFileMasterClusters(withFileWindowFocus(Component))
    );
}
