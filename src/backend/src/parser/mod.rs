use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::{
    HSTStructure, HSTStructureSocket,
};
use crate::parser::port::ParserControl;
use crate::parser::portable_reps::parsed_rep_tree::{Module, ParsedRepTree};
use crate::parser::sub_agents::syntax_env::port::SyntaxEnvControl;
use crate::parser::sub_agents::syntax_env::SyntaxEnv;
use lalrpop_util::ParseError;

pub mod port;
pub mod portable_reps;
pub mod sub_agents;

#[cfg(test)]
pub mod tests;

pub struct Parser {}

impl Parser {
    pub fn new() -> Box<dyn ParserControl> {
        Box::new(Parser {})
    }

    pub fn parse_module(
        &self,
        hst: &mut HSTStructureSocket,
        mut env: Box<dyn SyntaxEnvControl>,
    ) -> Module {
    }

    fn parse_structure_socket(
        &self,
        socket: &mut HSTStructureSocket,
        mut env: Box<dyn SyntaxEnvControl>,
    ) -> ParsedRepTree {
        // if let HSTStructure::None = socket.structure {
        //     /* Ok, so now we're in scarse mode.  First
        //     let's check if there's anything in the left input*/
        //     if let Some(input) = &socket.left_input {
        //         /* If there is, we want to turn this into a declaration */
        //         let result: Result<IstDec, ParseError<_, _, _>> = self.dec_parser.parse(input);
        //
        //         match result {
        //             Ok(ist_dec) => match ist_dec {
        //                 IstDec::Full(op, arg) => match op {
        //                     IstDecOp::Let => match arg {
        //                         IstDecArg::Full(term_def, expr) => {}
        //                         IstDecArg::Partial(term_def) => {}
        //                         IstDecArg::None => {}
        //                     },
        //                     IstDecOp::Theorem => {}
        //                     IstDecOp::Lemma => {}
        //                     IstDecOp::Prop => {}
        //                 },
        //                 IstDec::None => {}
        //             },
        //             Err(..) => {}
        //         }
        //     }
        // } else {
        // }

        unimplemented!()
    }
}

impl ParserControl for Parser {
    fn parse_hybrid_syntax_tree(
        &self,
        hybrid_syntax_tree: &mut HSTStructureSocket,
    ) -> ParsedRepTree {
        self.parse_structure_socket(hybrid_syntax_tree, SyntaxEnv::new())
    }
}
