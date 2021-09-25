use mockall::*;

#[automock]
pub trait IdGenControl {
    fn gen_id(&self) -> String;
}

pub fn mock_id_gen_control() -> MockIdGenControl {
    MockIdGenControl::new()
}
