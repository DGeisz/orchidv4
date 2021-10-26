use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::{
    HSTStructure, HSTStructureSocket,
};
use crate::parser::port::ParserControl;
use crate::parser::portable_reps::parsed_rep_tree::ParsedRepTree;
use crate::parser::sub_agents::syntax_env::port::SyntaxEnvControl;
use crate::parser::sub_agents::syntax_env::SyntaxEnv;

pub mod port;
pub mod portable_reps;
pub mod sub_agents;

pub struct Parser {}

impl Parser {
    pub fn new() -> Box<dyn ParserControl> {
        Box::new(Parser {})
    }

    fn parse_structure_socket(
        socket: &mut HSTStructureSocket,
        mut env: Box<dyn SyntaxEnvControl>,
    ) -> ParsedRepTree {
        if let HSTStructure::None = socket.structure {
        } else {
            unimplemented!()
        }

        unimplemented!()
    }
}

impl ParserControl for Parser {
    fn parse_hybrid_syntax_tree(
        &self,
        hybrid_syntax_tree: &mut HSTStructureSocket,
    ) -> ParsedRepTree {
        Parser::parse_structure_socket(hybrid_syntax_tree, SyntaxEnv::new())
    }
}
