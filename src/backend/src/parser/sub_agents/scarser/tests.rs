use crate::parser::sub_agents::scarser::scarser;

// use crate::parser::sub_agents::scarser::portable_reps::intermediate_syntax_tree::{
//     IstDec, IstDecArg, IstDecOp, IstExpr, IstSymbolDef, IstTermDef,
// };

// lalrpop_mod!(pub calculator1); // synthesized by LALRPOP
//
// #[test]
// fn calculator1() {
//     assert!(calculator1::TermParser::new().parse("22").is_ok());
//     assert!(calculator1::TermParser::new().parse("(22)").is_ok());
//     assert!(calculator1::TermParser::new().parse("((((22))))").is_ok());
//     assert!(calculator1::TermParser::new().parse("((22)").is_err());
// }

#[test]
fn basic_scarser() {
    assert!(scarser::DecParser::new().parse("Let A :: $\\zeta$").is_ok());

    println!(
        "this is parse: {:?}",
        scarser::DecParser::new().parse("Let  A :: $\\zeta$ )")
    );
}
