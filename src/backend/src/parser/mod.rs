use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::{
    HSTLexSocket, HSTLexType, HSTLineType, HSTStructure, HSTStructureSocket,
};
use crate::parser::port::ParserControl;
use crate::parser::portable_reps::parsed_rep_tree::{
    Declaration, Expression, LetDec, Module, ModuleGuard, ParsedRepTree, TermDef,
};
use crate::parser::sub_agents::hst_formatter::HSTFormatter;
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

    fn parse_module(
        &self,
        hst: &mut HSTStructureSocket,
        env: &mut Box<dyn SyntaxEnvControl>,
    ) -> Result<Module, ParserError> {
        /* First see if there actually is a structure here */
        match &mut hst.structure {
            None => {
                /* TODO: Scarse the left input and if successful,
                recursively call this method again*/
                unimplemented!()
            }
            Some(structure) => {
                /* Ok, for a module, we expect a container with
                three children, the first two being containers, the last being a line
                So we basically take this apart accordingly*/
                if let HSTStructure::Container(container) = structure {
                    /* First format the container */
                    HSTFormatter::format_module_container(container);

                    /* Get rid of any hanging inputs to the socket (we have to do this here cause of the borrow checker) */
                    hst.left_input = None;
                    hst.right_input = None;

                    if let [guard_socket, decs_socket, return_socket] =
                        container.children.as_mut_slice()
                    {
                        /* Ok now we're going to deal with each of the fields of the module one by one */
                        Ok(Module {
                            guards: match &mut guard_socket.structure {
                                None => vec![],
                                Some(guard_struct) => {
                                    if let HSTStructure::Container(guard_container) = guard_struct {
                                        HSTFormatter::format_module_child_container(
                                            guard_container,
                                        );
                                        /* Alright, so now we're trying to parse each of the children into a module guard */
                                        let mut guards = vec![];

                                        for child in &mut guard_container.children {
                                            guards.push(self.parse_guard(child, env)?);
                                        }

                                        guards
                                    } else {
                                        /* This wasn't expected, flag the hst, return an error */
                                        guard_socket.error_msg =
                                            Some("Expected a container".to_string());

                                        return Err(ParserError::UnexpectedHSTStructure);
                                    }
                                }
                            },
                            declarations: match &mut decs_socket.structure {
                                None => vec![],
                                Some(decs_structure) => {
                                    if let HSTStructure::Container(decs_container) = decs_structure
                                    {
                                        /* Alright, so now we're trying to parse each of the children into a declaration */
                                        let mut declarations = vec![];

                                        for child in &mut decs_container.children {
                                            declarations.push(self.parse_declaration(child, env)?);
                                        }

                                        declarations
                                    } else {
                                        /* This wasn't expected, flag the HST, return an error */
                                        decs_socket.error_msg = Some(
                                            "Expected a container of declarations".to_string(),
                                        );

                                        return Err(ParserError::UnexpectedHSTStructure);
                                    }
                                }
                            },
                            return_expression: self
                                .parse_structure_expression(return_socket, env)?,
                        })
                    } else {
                        /* Unexpected configuration of structure */
                        hst.error_msg = Some("Unexpected configuration of children".to_string());

                        return Err(ParserError::UnexpectedConfiguration);
                    }
                } else {
                    /* We expected a container. Flag the HST, and return an error */
                    hst.error_msg = Some("Expected a container".to_string());

                    return Err(ParserError::UnexpectedHSTStructure);
                }
            }
        }
    }

    fn parse_guard(
        &self,
        hst: &mut HSTStructureSocket,
        env: &mut Box<dyn SyntaxEnvControl>,
    ) -> Result<ModuleGuard, ParserError> {
        unimplemented!()
    }

    fn parse_declaration(
        &self,
        hst: &mut HSTStructureSocket,
        env: &mut Box<dyn SyntaxEnvControl>,
    ) -> Result<Declaration, ParserError> {
        match &mut hst.structure {
            None => {
                /* TODO: Handle the case where we need to scarse */
                unimplemented!()
            }
            Some(structure) => {
                match structure {
                    HSTStructure::Line(line) => {
                        /* First handle the case where we're dealing with just a single line */
                        match line.line_type {
                            HSTLineType::Axiom => {
                                /* Axioms aren't decs, unexpected */
                                hst.error_msg = Some("Expected a declaration".to_string());

                                return Err(ParserError::UnexpectedLineType);
                            }
                            HSTLineType::Theorem | HSTLineType::Lemma => {
                                /* We deal with theorems and lemmas in the same way */
                                /* We're dealing with Prop (Type) | Witness (value)   Label (var) */
                                /* The prop and witness are both just expressions, the label is a term */
                                let prop = self.parse_lex_expression(&mut line.main_lex, env)?;

                                let witness = match &mut line.right_lex {
                                    None => None,
                                    Some(lex) => self.parse_lex_expression(lex, env)?,
                                };

                                let term = match &mut line.label_lex {
                                    None => None,
                                    Some(lex) => self.parse_term_from_label(lex, env)?,
                                };

                                Ok(Declaration::Let(LetDec {
                                    term_def: TermDef {
                                        term,
                                        term_type: prop.and_then(|prop| Some(Box::new(prop))),
                                    },
                                    value: witness.and_then(|w| Some(Box::new(w))),
                                }))
                            }
                            HSTLineType::Basic => {
                                /* There are two main cases here.  The first in which
                                all line lexes are non-empty, which indicates a line in a
                                two-column proof.  Otherwise, we just parse the main lex
                                as a declaration*/
                                if let (Some(r_lex), Some(l_lex)) =
                                    (&mut line.right_lex, &mut line.label_lex)
                                {
                                    /* In this case, we parse everything like we did before for theorems and lemmas */
                                    let prop =
                                        self.parse_lex_expression(&mut line.main_lex, env)?;

                                    let witness = self.parse_lex_expression(r_lex, env)?;

                                    let term = self.parse_term_from_label(l_lex, env)?;

                                    Ok(Declaration::Let(LetDec {
                                        term_def: TermDef {
                                            term,
                                            term_type: prop.and_then(|prop| Some(Box::new(prop))),
                                        },
                                        value: witness.and_then(|w| Some(Box::new(w))),
                                    }))
                                } else if line.right_lex.is_some() || line.label_lex.is_some() {
                                    /* Now we're in no man's land.  Throw an unexpected configuration*/
                                    hst.error_msg = Some(
                                        "Unexpected configuration of line lex for expression"
                                            .to_string(),
                                    );

                                    return Err(ParserError::UnexpectedConfiguration);
                                } else {
                                    /* Finally, we're in a place where we can parse the main lex as a declaration */

                                    self.parse_lex_declaration(&mut line.main_lex, env)
                                }
                            }
                        }
                    }
                    HSTStructure::Container(_) => {
                        /* We'll just leave this unimplemented for the time being*/
                        unimplemented!()
                    }
                }
            }
        }
    }

    fn parse_lex_declaration(
        &self,
        lex: &mut HSTLexSocket,
        env: &mut Box<dyn SyntaxEnvControl>,
    ) -> Result<Declaration, ParserError> {
        let element = lex
            .element
            .as_mut()
            .ok_or(ParserError::UnexpectedEmptySocket)?;

        /* Only going to do let for now */
        match element.lex_type {
            HSTLexType::Let => {
                /* Alright we expect two sockets on this element, for the term def and the value */
                if let [term_lex, value_lex] = element.lex_sockets.as_mut_slice() {
                    Ok(Declaration::Let(LetDec {
                        term_def: self.parse_lex_term_def(term_lex, env)?,
                        value: self
                            .parse_lex_expression(value_lex, env)?
                            .and_then(|v| Some(Box::new(v))),
                    }))
                } else {
                    return Err(ParserError::UnexpectedConfiguration);
                }
            }
            // TODO: Need to change this
            _ => Err(ParserError::UnexpectedConfiguration),
        }
    }

    fn parse_lex_term_def(
        &self,
        lex: &mut HSTLexSocket,
        /* Sometimes a term def will only include a single element,
        and we need to indicate whether that should be construed as a term or a type*/
        env: &mut Box<dyn SyntaxEnvControl>,
    ) -> Result<TermDef, ParserError> {
        match &mut lex.element {
            Some(e) => {
                match e.lex_type {
                    HSTLexType::TypeMap => {
                        /* if this is a type map, then we can take the mother fucker apart */
                        if let [term_lex, term_type_lex] = e.lex_sockets.as_mut_slice() {
                            Ok(TermDef {
                                term: self.parse_lex_term(term_lex, env)?,
                                term_type: self
                                    .parse_lex_expression(term_type_lex, env)?
                                    .and_then(|tt| Some(Box::new(tt))),
                            })
                        } else {
                            lex.error_msg = Some("Expected a term and a type".to_string());

                            return Err(ParserError::UnexpectedConfiguration);
                        }
                    }
                    HSTLexType::Term => {
                        if let [term_lex] = e.lex_sockets.as_mut_slice() {
                            Ok(TermDef {
                                term: self.parse_lex_term(term_lex, env)?,
                                term_type: None,
                            })
                        } else {
                            lex.error_msg = Some("Expected a term".to_string());

                            return Err(ParserError::UnexpectedConfiguration);
                        }
                    }
                    HSTLexType::TermType => {
                        if let [tt_lex] = e.lex_sockets.as_mut_slice() {
                            Ok(TermDef {
                                term: None,
                                term_type: self
                                    .parse_lex_expression(tt_lex, env)?
                                    .and_then(|tt| Some(Box::new(tt))),
                            })
                        } else {
                            lex.error_msg = Some("Expected a type".to_string());

                            return Err(ParserError::UnexpectedConfiguration);
                        }
                    }
                    _ => Err(ParserError::UnexpectedConfiguration),
                }
            }
            None => Ok(TermDef {
                term_type: None,
                term: None,
            }),
        }
    }

    fn parse_lex_term(
        &self,
        lex: &mut HSTLexSocket,
        env: &mut Box<dyn SyntaxEnvControl>,
    ) -> Result<Option<String>, ParserError> {
        unimplemented!()
    }

    fn parse_lex_expression(
        &self,
        lex: &mut HSTLexSocket,
        env: &mut Box<dyn SyntaxEnvControl>,
    ) -> Result<Option<Expression>, ParserError> {
        unimplemented!()
    }

    fn parse_term_from_label(
        &self,
        lex: &mut HSTLexSocket,
        env: &mut Box<dyn SyntaxEnvControl>,
    ) -> Result<Option<String>, ParserError> {
        unimplemented!()
    }

    fn parse_structure_expression(
        &self,
        hst: &mut HSTStructureSocket,
        env: &mut Box<dyn SyntaxEnvControl>,
    ) -> Result<Option<Expression>, ParserError> {
        unimplemented!()
    }
}

impl ParserControl for Parser {
    fn parse_hybrid_syntax_tree(
        &self,
        hybrid_syntax_tree: &mut HSTStructureSocket,
    ) -> Result<ParsedRepTree, ParserError> {
        let mut syntax_env = SyntaxEnv::new();

        Ok(ParsedRepTree {
            root_module: self.parse_module(hybrid_syntax_tree, &mut syntax_env)?,
        })
    }
}

pub enum ParserError {
    UnexpectedHSTStructure,
    UnexpectedConfiguration,
    UnexpectedLineType,
    UnexpectedEmptySocket,
}
