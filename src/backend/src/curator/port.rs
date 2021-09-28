use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::{
    OFTError, OrchidFileTree,
};
use mockall::*;

/// Control port for the curator
#[automock]
pub trait CuratorControl {
    fn get_root_file_tree(&self) -> Result<OrchidFileTree, OFTError>;
}

pub fn mock_curator_control() -> MockCuratorControl {
    MockCuratorControl::new()
}
