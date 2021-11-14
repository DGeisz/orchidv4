use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::latex_utils::{
    add_tex_color, DANGER,
};
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
    pub id: String,
    pub node: Option<Box<VRSNode>>,
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub enum VRSNode {
    Container(VRSContainer),
    Line(VRSLine),
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct VRSContainer {
    pub id: String,
    pub left_border: bool,
    pub indented: bool,
    pub children: Vec<VRSNodeSocket>,
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct VRSLine {
    pub id: String,
    pub title: Option<String>,
    pub comment: Option<String>,
    pub main_tex: VRSTexSocket,
    pub right_tex: Option<VRSTexSocket>,
    pub label_tex: Option<VRSTexSocket>,
    pub border_bottom: bool,
    pub border_top: bool,
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct VRSTexSocket {
    pub id: String,
    pub element: Option<Box<VRSTexElement>>,
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct VRSTexElement {
    tex_template: Vec<String>,
    tex_sockets: Vec<VRSTexSocket>,
}

pub fn vrs_error() -> VRSTexElement {
    VRSTexElement {
        tex_template: vec![add_tex_color("ERROR", DANGER)],
        tex_sockets: vec![],
    }
}
