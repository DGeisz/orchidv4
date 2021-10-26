use crate::parser::sub_agents::syntax_env::port::SyntaxEnvControl;

pub mod port;

pub struct SyntaxEnv {}

impl SyntaxEnv {
    pub fn new() -> Box<dyn SyntaxEnvControl> {
        Box::new(SyntaxEnv {})
    }
}

impl SyntaxEnvControl for SyntaxEnv {}
