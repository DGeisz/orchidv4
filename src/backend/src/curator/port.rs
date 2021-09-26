use crate::curator::sub_ias::file_system_adapter::sprs::orchid_file_tree::{
    OFTError, OrchidFileTree,
};
use mockall::*;

/// Control port for the curator
#[automock]
pub trait CuratorControl {
    fn get_file_tree(&self) -> Result<OrchidFileTree, OFTError>;
}

pub fn mock_curator_control() -> MockCuratorControl {
    MockCuratorControl::new()
}
