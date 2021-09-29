import React from "react";
import { useHandleOpenFile } from "../../service_providers/editor_comp_comm/editor_comp_comm";

const FileWindowContainer: React.FC = () => {
    useHandleOpenFile((file_path) => {
        console.log("Received file path: ", file_path);
    }, []);

    return <div />;
};

export default FileWindowContainer;
