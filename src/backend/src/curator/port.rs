use mockall::*;

/// Control port for the curator
#[automock]
pub trait CuratorControl {
    fn get_file_tree(&self);
}

pub fn mock_curator_control() -> MockCuratorControl {
    MockCuratorControl::new()
}
