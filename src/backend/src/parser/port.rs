use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::HSTStructureSocket;
use crate::parser::portable_reps::parsed_rep_tree::ParsedRepTree;
use crate::parser::ParserError;

pub trait ParserControl {
    fn parse_hybrid_syntax_tree(
        &self,
        hybrid_syntax_tree: &mut HSTStructureSocket,
    ) -> Result<ParsedRepTree, ParserError>;
}
