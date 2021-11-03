use crate::parser::sub_agents::scarser::port::ScarserControl;

pub mod port;
pub mod sub_agents;

pub struct Scarser {}

impl ScarserControl for Scarser {}
