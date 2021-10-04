use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::OrchidFilePath;
use serde::{Deserialize, Serialize};

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct VisualRepSkeleton {
    file_id: String,
    file_name: String,
    formatted_name: String,
    file_path: OrchidFilePath,
    root_node_socket: VRSNodeSocket,
}

impl VisualRepSkeleton {
    pub fn new(
        file_id: String,
        file_name: String,
        formatted_name: String,
        file_path: OrchidFilePath,
        root_node_socket: VRSNodeSocket,
    ) -> VisualRepSkeleton {
        VisualRepSkeleton {
            file_name,
            file_id,
            formatted_name,
            file_path,
            root_node_socket,
        }
    }
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct VRSNodeSocket {
    id: String,
    node: Option<Box<VRSNode>>,
}

impl VRSNodeSocket {
    pub fn new(id: String, node: Option<Box<VRSNode>>) -> VRSNodeSocket {
        VRSNodeSocket { id, node }
    }
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub enum VRSNode {
    Container(VRSContainer),
    Line(VRSLine),
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct VRSContainer {
    id: String,
    left_border: bool,
    indented: bool,
    children: Vec<VRSNodeSocket>,
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct VRSLine {
    id: String,
    title: Option<String>,
    comment: Option<String>,
    main_tex: VRSTexSocket,
    right_tex: Option<VRSTexSocket>,
    label_tex: Option<VRSTexSocket>,
    border_bottom: bool,
    border_top: bool,
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct VRSTexSocket {
    id: String,
    element: Option<Box<VRSTexElement>>,
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct VRSTexElement {
    tex_template: Vec<String>,
    tex_sockets: Vec<VRSTexSocket>,
}
