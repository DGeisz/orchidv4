use crate::abstract_file_master::portable_reps::visual_rep_skeleton::VisualRepSkeleton;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OFPError, OrchidFilePath,
};
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::{
    OFTError, OrchidFileTree,
};
use mockall::*;

/// Control port for the curator
#[automock]
pub trait CuratorControl {
    fn get_root_file_tree(&self) -> Result<OrchidFileTree, OFTError>;
    fn open_file(&mut self, path: OrchidFilePath) -> Result<VisualRepSkeleton, OFPError>;
}

pub fn mock_curator_control() -> MockCuratorControl {
    MockCuratorControl::new()
}
