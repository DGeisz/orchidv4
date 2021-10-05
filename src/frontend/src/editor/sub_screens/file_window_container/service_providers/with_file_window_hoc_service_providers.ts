import React from "react";
import { withFileMasterClusters } from "./file_master_clusters/file_master_clusters";
import { withFileWindowFocus } from "./file_window_focus/file_window_focus";

export function withFWCHocServiceProviders<T>(
    Component: React.FC<T>
): React.FC<T> {
    return withFileMasterClusters(withFileWindowFocus(Component));
}
