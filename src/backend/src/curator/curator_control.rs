use mockall::*;

/// Control port for the curator
#[automock]
pub trait CuratorControl {}

pub fn mock_curator_control() -> MockCuratorControl {
    MockCuratorControl::new()
}
