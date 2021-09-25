use mockall::*;

/// Control port for the curator
#[automock]
pub trait CuratorControl {
    fn get_directory_info(&self);
}

pub fn mock_curator_control() -> MockCuratorControl {
    MockCuratorControl::new()
}
