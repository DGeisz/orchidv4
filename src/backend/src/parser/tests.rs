use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::{
    HSTContainer, HSTLexElement, HSTLexSocket, HSTLexType, HSTLine, HSTLineType, HSTStructure,
    HSTStructureSocket,
};
use crate::parser::portable_reps::parsed_rep_tree::{
    Declaration, Expression, LetDec, Module, ParsedRepTree, TermDef,
};
use crate::parser::Parser;

#[test]
pub fn test_simple_parse_hst() {
    /* First we need a parser */
    let parser = Parser::new();

    /* Now let's start off with an HST root with no structure, but a parsable */
    let mut hst = HSTStructureSocket {
        id: "root".to_string(),
        structure: HSTStructure::None,
        left_input: Some("let".to_string()),
        right_input: None,
        error_msg: None,
    };

    /* Now we're going to parse this bad boi */
    let parse_tree = parser.parse_hybrid_syntax_tree(&mut hst);

    /* Ok, parse_hst should have modified hst, so check this
    to be sure it did*/
    assert_eq!(
        hst,
        HSTStructureSocket {
            id: "root".to_string(),
            left_input: None,
            right_input: None,
            error_msg: None,
            structure: Some(HSTStructure::Container(Box::new(HSTContainer {
                // TODO: Figure out what this id should be
                id: "fill in later".to_string(),
                left_border: false,
                indented: false,
                children: vec![HSTStructureSocket {
                    id: "fill".to_string(),
                    left_input: None,
                    right_input: None,
                    error_msg: None,
                    structure: Some(HSTStructure::Line(Box::new(HSTLine {
                        id: "fill".to_string(),
                        line_type: HSTLineType::Basic,
                        comment: None,
                        right_lex: None,
                        label_lex: None,
                        main_lex: HSTLexSocket {
                            id: "fill".to_string(),
                            left_input: None,
                            right_input: None,
                            element: Some(Box::new(HSTLexElement {
                                lex_type: HSTLexType::Let,
                                tex_template: None,
                                lex_sockets: vec![
                                    HSTLexSocket {
                                        id: "fill".to_string(),
                                        left_input: None,
                                        right_input: None,
                                        element: None
                                    },
                                    HSTLexSocket {
                                        id: "fill".to_string(),
                                        left_input: None,
                                        right_input: None,
                                        element: None
                                    }
                                ]
                            }))
                        }
                    })))
                }]
            }))),
        }
    );

    /* Ok, check if the parse tree is correct */
    assert_eq!(
        parse_tree,
        ParsedRepTree {
            root_module: Module {
                guards: vec![],
                return_expression: None,
                declarations: vec![Declaration::Let(LetDec {
                    term_def: TermDef {
                        term: None,
                        term_type: None
                    },
                    value: None
                })]
            }
        }
    )
}
