import React, { useEffect, useMemo, useState } from "react";
import { FileExplorerWs } from "./sub_agents/file_explorer_ws/file_explorer_ws";
import { OrchidFileTree } from "./sub_agents/file_explorer_ws/portable_reps/orchid_file_tree";
import { res_is_oft } from "./sub_agents/file_explorer_ws/basic_msgs/fe_ws_res";
import OftExplorer from "./building_blocks/oft_explorer/oft_explorer";
import "./file_explorer_styles.scss";

const FileExplorer: React.FC = () => {
    const [oft, set_oft] = useState<OrchidFileTree>();

    const file_explorer_ws = useMemo(
        () =>
            new FileExplorerWs((res) => {
                console.log("This is res: ", res);

                if (res_is_oft(res)) {
                    set_oft(res.OFT);
                }
            }),
        []
    );

    useEffect(() => {
        /* Get the root file tree when we first open
         * the file explorer */
        file_explorer_ws.get_root_oft();
    }, []);

    useEffect(() => {
        console.log("This is oft", oft);
    }, [oft]);

    if (!!oft) {
        return (
            <div className="fe-container">
                <OftExplorer oft={oft} indents={0} />
            </div>
        );
    } else {
        /*TODO: Add small spinner*/
        return <div />;
    }
};

export default FileExplorer;
