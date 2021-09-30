import React, { useContext, useState } from "react";
import { FileEditorMaster } from "../../sub_screens/file_window/sub_screens/file_editor/sub_agents/file_editor_master/file_editor_master";

interface FMCContextType {
    file_master_clusters: FileEditorMaster[][];
    set_fmc: (set: () => FileEditorMaster[][]) => void;
}

const FMCContext = React.createContext<FMCContextType>({
    file_master_clusters: [],
    set_fmc: () => [],
});

export function withFileMasterClusters<T>(Component: React.FC<T>): React.FC<T> {
    return (props) => {
        const [file_master_clusters, set_fmc] = useState<FileEditorMaster[][]>(
            []
        );

        return (
            <FMCContext.Provider
                value={{
                    file_master_clusters,
                    set_fmc,
                }}
            >
                <Component {...props} />
            </FMCContext.Provider>
        );
    };
}

export function useFileMasterClusters(): [
    FileEditorMaster[][],
    (set: () => FileEditorMaster[][]) => void
] {
    const { file_master_clusters, set_fmc } = useContext(FMCContext);

    return [file_master_clusters, set_fmc];
}

export function useRemoveFileMasterFromCluster(
    cluster_index: number
): (fm_index: number) => void {
    const { file_master_clusters, set_fmc } = useContext(FMCContext);

    return (fm_index) => {
        if (!!file_master_clusters[cluster_index]) {
            const cluster = file_master_clusters[cluster_index];

            if (!!cluster[fm_index]) {
                const new_clusters = [...file_master_clusters];
                const new_cluster = [...cluster];

                console.log("Old clusters", new_clusters, new_clusters.length);

                new_cluster.splice(fm_index, 1);

                console.log("New cluster1", new_clusters, new_clusters.length);

                if (new_cluster.length > 0) {
                    new_clusters[cluster_index] = new_cluster;
                } else {
                    new_clusters.splice(cluster_index, 1);
                }

                console.log(
                    "New clusters: ",
                    new_clusters,
                    new_clusters.length
                );

                set_fmc(() => new_clusters);
            }
        }
    };
}
