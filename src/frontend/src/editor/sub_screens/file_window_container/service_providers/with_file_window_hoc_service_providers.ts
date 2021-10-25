import React from "react";
import { withFileMasterClusters } from "./file_master_clusters/file_master_clusters";
import { withFwKeyboardHandlers } from "./file_window_keyboard_handlers/file_window_keyboard_handlers";

export function withFWCHocServiceProviders<T>(
    Component: React.FC<T>
): React.FC<T> {
    return withFwKeyboardHandlers(withFileMasterClusters(Component));
}
