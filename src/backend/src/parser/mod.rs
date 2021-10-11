use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::HSTStructureSocket;
use crate::parser::port::ParserControl;
use crate::parser::portable_reps::parsed_rep_tree::ParsedRepTree;

pub mod port;
pub mod portable_reps;

pub struct Parser {}

impl Parser {
    pub fn new() -> Box<dyn ParserControl> {
        Box::new(Parser {})
    }
}

impl ParserControl for Parser {
    fn parse_hybrid_syntax_tree(
        &self,
        hybrid_syntax_tree: &mut HSTStructureSocket,
    ) -> ParsedRepTree {
        unimplemented!()
    }
}
