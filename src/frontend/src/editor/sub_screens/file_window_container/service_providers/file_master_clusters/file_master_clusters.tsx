import React, { useContext, useEffect, useState } from "react";
import { FileEditorMaster } from "../../sub_screens/file_window/sub_screens/file_editor/sub_agents/file_editor_master/file_editor_master";
import { OrchidOpenFiles } from "../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";

interface FMCContextType {
    file_master_clusters: FileEditorMaster[][];
    set_fmc: (set: () => FileEditorMaster[][]) => void;
    cluster_child_indices: number[];
    set_cluster_child_indices: (indices: number[]) => void;
    /* Include this so that we don't save initial empty file
     * clusters before we've actually fetched the persisted clusters */
    received_external_clusters: boolean;
    set_received_external_clusters: (set: boolean) => void;
}

const FMCContext = React.createContext<FMCContextType>({
    file_master_clusters: [],
    set_fmc: () => [],
    cluster_child_indices: [],
    set_cluster_child_indices: () => {},
    received_external_clusters: false,
    set_received_external_clusters: () => {},
});

export function withFileMasterClusters<T>(Component: React.FC<T>): React.FC<T> {
    return (props) => {
        const [file_master_clusters, set_fmc] = useState<FileEditorMaster[][]>(
            []
        );

        const [cluster_child_indices, set_cluster_child_indices] = useState<
            number[]
        >([]);

        const [received_external_clusters, set_received_external_clusters] =
            useState<boolean>(false);

        return (
            <FMCContext.Provider
                value={{
                    file_master_clusters,
                    set_fmc,
                    cluster_child_indices,
                    set_cluster_child_indices,
                    received_external_clusters,
                    set_received_external_clusters,
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

                new_cluster.splice(fm_index, 1);

                if (new_cluster.length > 0) {
                    new_clusters[cluster_index] = new_cluster;
                } else {
                    new_clusters.splice(cluster_index, 1);
                }

                set_fmc(() => new_clusters);
            }
        }
    };
}

export function useRearrangeFileMasterCluster(
    cluster_index: number
): (source_index: number, destination_index: number) => void {
    const { file_master_clusters, set_fmc } = useContext(FMCContext);

    return (source_index, destination_index) => {
        if (!!file_master_clusters[cluster_index]) {
            const cluster = file_master_clusters[cluster_index];

            if (
                !!cluster[source_index] &&
                destination_index >= 0 &&
                destination_index < cluster.length
            ) {
                const new_clusters = [...file_master_clusters];
                const new_cluster = [...cluster];

                const fm = cluster[source_index];

                /* Remove the fm from the old location */
                new_cluster.splice(source_index, 1);

                /* Add the fm to the new location */
                new_cluster.splice(destination_index, 0, fm);

                /* Set the new clusters */
                new_clusters[cluster_index] = new_cluster;

                set_fmc(() => new_clusters);
            }
        }
    };
}

export function useClusterChildFocus(
    cluster_index: number
): [number, (index: number) => void] {
    const { cluster_child_indices, set_cluster_child_indices } =
        useContext(FMCContext);

    const child_index = cluster_child_indices[cluster_index];

    if (typeof child_index !== "undefined") {
        return [
            child_index,
            (index) => {
                const new_indices = [...cluster_child_indices];
                new_indices[cluster_index] = index;

                set_cluster_child_indices(new_indices);
            },
        ];
    } else {
        return [
            0,
            (index) => {
                const new_indices = [...cluster_child_indices];
                new_indices[cluster_index] = index;

                set_cluster_child_indices(new_indices);
            },
        ];
    }
}

export function useSetClusterChildFocus(): (
    cluster_index: number,
    child: number
) => void {
    const { cluster_child_indices, set_cluster_child_indices } =
        useContext(FMCContext);

    return (cluster_index, child) => {
        const new_indices = [...cluster_child_indices];
        new_indices[cluster_index] = child;

        set_cluster_child_indices(new_indices);
    };
}

export function useSetClusters(): (open_files: OrchidOpenFiles) => void {
    const {
        set_fmc,
        set_cluster_child_indices,
        received_external_clusters,
        set_received_external_clusters,
    } = useContext(FMCContext);

    return (open_files) => {
        const new_clusters = open_files.clusters.map((cluster) => {
            return cluster.file_paths.map(
                (file_path) => new FileEditorMaster(file_path)
            );
        });

        set_fmc(() => new_clusters);

        const new_child_indices = open_files.clusters.map(
            (cluster) => cluster.focused_child
        );

        set_cluster_child_indices(new_child_indices);
        !received_external_clusters && set_received_external_clusters(true);
    };
}

export function useOnClusterChange(
    handler: (open_files: OrchidOpenFiles) => void
) {
    const {
        file_master_clusters,
        cluster_child_indices,
        received_external_clusters,
    } = useContext(FMCContext);

    useEffect(() => {
        if (received_external_clusters) {
            const open_files: OrchidOpenFiles = {
                clusters: file_master_clusters.map((cluster, index) => {
                    const focused_child =
                        typeof cluster_child_indices[index] !== "undefined"
                            ? cluster_child_indices[index]
                            : 0;

                    const file_paths = cluster.map((master) =>
                        master.get_file_path()
                    );

                    return {
                        focused_child,
                        file_paths,
                    };
                }),
            };

            handler(open_files);
        }
    }, [file_master_clusters, cluster_child_indices]);
}
