use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::HSTLexType::TypeMap;
use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::{
    empty_lex_element, empty_lex_socket, empty_socket, HSTLexElement, PTLexElement,
    PTLexElementSockets, PTLexSocket, PTLine, PTStructSocket,
};
use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::{
    HSTLexSocket, HSTLexType, HSTLineType, HSTStructure, HSTStructureSocket,
};
use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::{
    PTContainer, PTContainerChildren,
};
use crate::parser::port::ParserControl;
use crate::parser::portable_reps::parsed_rep_tree::{Declaration, Expression, Import, Module};
use crate::parser::portable_reps::parsed_rep_tree::{ParsedRepTree, TermDef};
use crate::parser::sub_agents::hst_formatter::HSTFormatter;
use crate::parser::sub_agents::syntax_env::port::SyntaxEnvControl;
use crate::parser::sub_agents::syntax_env::SyntaxEnv;
use lalrpop_util::ParseError;
use std::cell::RefCell;
use std::rc::Rc;

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

    fn parse_module(&self, hst: &mut HSTStructureSocket) -> Result<Module, ParserError> {
        /* First see if there is actually a structure here */
        if let Some(_) = &hst.structure {
            let hst_imports = Rc::new(RefCell::new(None));
            let hst_parameters = Rc::new(RefCell::new(None));
            let hst_body = Rc::new(RefCell::new(None));
            let hst_return_expr = Rc::new(RefCell::new(None));

            /* Create the module's template */
            let template = PTStructSocket::Container(PTContainer {
                left_border: false,
                bottom_border: false,
                indented: false,
                children: PTContainerChildren::Template(vec![
                    PTStructSocket::Container(PTContainer {
                        left_border: false,
                        bottom_border: true,
                        indented: false,
                        children: PTContainerChildren::Refs(Rc::clone(&hst_imports)),
                    }),
                    PTStructSocket::Container(PTContainer {
                        left_border: false,
                        bottom_border: true,
                        indented: false,
                        children: PTContainerChildren::Refs(Rc::clone(&hst_parameters)),
                    }),
                    PTStructSocket::Container(PTContainer {
                        left_border: false,
                        bottom_border: true,
                        indented: false,
                        children: PTContainerChildren::Refs(Rc::clone(&hst_body)),
                    }),
                    PTStructSocket::Socket(Rc::clone(&hst_return_expr)),
                ]),
            });

            Parser::match_hst_to_struct_socket_template(hst, template)?;

            let mut imports = vec![];
            for import in (hst_imports.borrow_mut()).as_mut().unwrap().iter_mut() {
                imports.push(self.parse_import(import)?);
            }

            let mut parameters = vec![];
            for parameter in (hst_parameters.borrow_mut()).as_mut().unwrap().iter_mut() {
                parameters.push(self.parse_term_def_line(parameter)?)
            }

            let mut body = vec![];
            for declaration in (hst_body.borrow_mut()).as_mut().unwrap().iter_mut() {
                body.push(self.parse_declaration(declaration)?)
            }

            let return_expr =
                self.parse_structure_expression(hst_return_expr.borrow_mut().as_mut().unwrap())?;

            Ok(Module {
                imports,
                parameters,
                body,
                return_expr: Some(return_expr),
            })
        } else {
            /* In this case we scarse the left input,
            and if successful, we call this method again*/

            unimplemented!()
        }
    }

    fn parse_import(&self, hst: &mut HSTStructureSocket) -> Result<Import, ParserError> {
        unimplemented!()
    }

    fn parse_term_def_line(&self, hst: &mut HSTStructureSocket) -> Result<TermDef, ParserError> {
        let mut term_ref = &empty_lex_element();
        let mut hst_type = &empty_lex_socket();

        let template = PTStructSocket::Line(PTLine {
            line_type: HSTLineType::Basic,
            right_lex: None,
            label_lex: None,
            main_lex: PTLexSocket::Element(Some(PTLexElement {
                lex_type: TypeMap,
                sockets: PTLexElementSockets::Template(vec![
                    PTLexSocket::ElementRef(&mut term_ref),
                    PTLexSocket::Socket(&mut hst_type),
                ]),
            })),
        });

        unimplemented!()
    }

    fn extract_term_string_from_element(
        &self,
        element: &HSTLexElement,
    ) -> Result<String, ParserError> {
        if let HSTLexType::CustomLabel(term) = &element.lex_type {
            Ok(term.clone())
        } else {
            /* Here we are */
            Err(ParserError)
        }
    }

    fn parse_declaration(&self, hst: &mut HSTStructureSocket) -> Result<Declaration, ParserError> {
        unimplemented!()
    }

    fn parse_structure_expression(
        &self,
        hst: &mut HSTStructureSocket,
    ) -> Result<Expression, ParserError> {
        unimplemented!()
    }

    /// This takes in a template, and matches an HST to the template,
    /// extracting references to various elements that need further parsing
    ///
    /// Basically custom match f11y
    fn match_hst_to_struct_socket_template<'a>(
        hst: &'a mut HSTStructureSocket,
        template: PTStructSocket<'a>,
    ) -> Result<(), ParserError> {
        match template {
            PTStructSocket::Socket(socket_ref) => {
                *socket_ref.borrow_mut() = Some(hst);
            }
            PTStructSocket::Container(container_template) => {
                if let Some(structure) = &mut hst.structure {
                    if let HSTStructure::Container(container) = structure {
                        /* Make sure all the visual attribute fields are set */
                        container.left_border = container_template.left_border;
                        container.bottom_border = container_template.bottom_border;
                        container.indented = container_template.indented;

                        /* Now handle the children */
                        match container_template.children {
                            PTContainerChildren::Refs(refs_vec) => {
                                *refs_vec.borrow_mut() = Some(&mut container.children);
                                // *refs_vec = &mut container.children;
                            }
                            PTContainerChildren::Template(mut template_children) => {
                                if container.children.len() == template_children.len() {
                                    /* Parse the children */
                                    for (child, child_template) in
                                        container.children.iter_mut().zip(template_children)
                                    {
                                        Parser::match_hst_to_struct_socket_template(
                                            child,
                                            child_template,
                                        )?;
                                    }
                                } else {
                                    hst.error_msg = Some(format!(
                                        "Container template expected {} children, got {}",
                                        template_children.len(),
                                        container.children.len()
                                    ));

                                    return Err(ParserError::UnexpectedConfiguration);
                                }
                            }
                        }
                    } else {
                        hst.error_msg = Some("Expected container".to_string());
                        return Err(ParserError::UnexpectedHSTStructure);
                    }
                } else {
                    hst.error_msg = Some("Expected container".to_string());
                    return Err(ParserError::UnexpectedEmptySocket);
                }
            }
            PTStructSocket::Line(line_template) => {
                if let Some(structure) = &mut hst.structure {
                    if let HSTStructure::Line(line) = structure {
                        if line.line_type == line_template.line_type {
                            /* First work with right lex */
                            match (&mut line.right_lex, line_template.right_lex) {
                                (Some(right), Some(right_template)) => {
                                    Parser::match_hst_to_lex_socket_template(right, right_template)?
                                }
                                (None, None) => (),
                                _ => {
                                    hst.error_msg =
                                        Some("Right lex didn't match template".to_string());
                                    return Err(ParserError::UnexpectedConfiguration);
                                }
                            }

                            /* Then label lex */
                            match (&mut line.label_lex, line_template.label_lex) {
                                (Some(label), Some(label_template)) => {
                                    Parser::match_hst_to_lex_socket_template(label, label_template)?
                                }
                                (None, None) => (),
                                _ => {
                                    hst.error_msg =
                                        Some("Right lex didn't match template".to_string());
                                    return Err(ParserError::UnexpectedConfiguration);
                                }
                            }

                            /* And finally, main lex */
                            Parser::match_hst_to_lex_socket_template(
                                &mut line.main_lex,
                                line_template.main_lex,
                            )?;
                        } else {
                            hst.error_msg = Some("Hst line type didn't match template".to_string());
                            return Err(ParserError::UnexpectedConfiguration);
                        }
                    } else {
                        hst.error_msg = Some("Expected line".to_string());
                        return Err(ParserError::UnexpectedHSTStructure);
                    }
                } else {
                    hst.error_msg = Some("Expected line".to_string());
                    return Err(ParserError::UnexpectedEmptySocket);
                }
            }
        }

        Ok(())
    }

    /// Matches hst to a given lex socket template extracting
    /// references to parts of HST that require further parsing
    ///
    /// Effectively custom match f11y
    fn match_hst_to_lex_socket_template<'a>(
        hst: &'a mut HSTLexSocket,
        template: PTLexSocket<'a>,
    ) -> Result<(), ParserError> {
        match template {
            PTLexSocket::Socket(socket_ref) => {
                *socket_ref = hst;
            }
            PTLexSocket::ElementRef(element_ref) => {
                if let Some(element) = &mut hst.element {
                    *element_ref = element;
                } else {
                    hst.error_msg = Some("Expected non-empty socket".to_string());
                    return Err(ParserError::UnexpectedEmptySocket);
                }
            }
            PTLexSocket::Element(template_option) => match (&mut hst.element, template_option) {
                (Some(element), Some(element_template)) => {
                    if element.lex_type == element_template.lex_type {
                        match element_template.sockets {
                            PTLexElementSockets::Refs(sockets_ref) => {
                                *sockets_ref = &element.lex_sockets;
                            }
                            PTLexElementSockets::Template(template_sockets) => {
                                /* Make sure number of sockets line up properly */
                                if template_sockets.len() == element.lex_sockets.len() {
                                    for (socket, socket_template) in
                                        element.lex_sockets.iter_mut().zip(template_sockets)
                                    {
                                        Parser::match_hst_to_lex_socket_template(
                                            socket,
                                            socket_template,
                                        )?;
                                    }
                                } else {
                                    hst.error_msg = Some(format!(
                                        "Lex template expected {} sockets, recieved {}",
                                        template_sockets.len(),
                                        element.lex_sockets.len()
                                    ));

                                    return Err(ParserError::UnexpectedNumberOfChildren);
                                }
                            }
                        }
                    } else {
                        hst.error_msg = Some("Element type didn't match template".to_string());
                        return Err(ParserError::UnexpectedConfiguration);
                    }
                }
                (None, None) => (),
                _ => {
                    hst.error_msg =
                        Some("Element existence didn't align with template".to_string());
                    return Err(ParserError::UnexpectedConfiguration);
                }
            },
        }

        Ok(())
    }

    // fn parse_module(
    //     &self,
    //     hst: &mut HSTStructureSocket,
    //     env: &mut Box<dyn SyntaxEnvControl>,
    // ) -> Result<Module, ParserError> {
    //     /* First see if there actually is a structure here */
    //     match &mut hst.structure {
    //         None => {
    //             /* TODO: Scarse the left input and if successful,
    //             recursively call this method again*/
    //             unimplemented!()
    //         }
    //         Some(structure) => {
    //             /* Ok, for a module, we expect a container with
    //             three children, the first two being containers, the last being a line
    //             So we basically take this apart accordingly*/
    //             if let HSTStructure::Container(container) = structure {
    //                 /* First format the container */
    //                 HSTFormatter::format_module_container(container);

    //                 /* Get rid of any hanging inputs to the socket (we have to do this here cause of the borrow checker) */
    //                 hst.left_input = None;
    //                 hst.right_input = None;

    //                 if let [guard_socket, decs_socket, return_socket] =
    //                     container.children.as_mut_slice()
    //                 {
    //                     /* Ok now we're going to deal with each of the fields of the module one by one */
    //                     Ok(Module {
    //                         guards: match &mut guard_socket.structure {
    //                             None => vec![],
    //                             Some(guard_struct) => {
    //                                 if let HSTStructure::Container(guard_container) = guard_struct {
    //                                     HSTFormatter::format_module_child_container(
    //                                         guard_container,
    //                                     );
    //                                     /* Alright, so now we're trying to parse each of the children into a module guard */
    //                                     let mut guards = vec![];

    //                                     for child in &mut guard_container.children {
    //                                         guards.push(self.parse_guard(child, env)?);
    //                                     }

    //                                     guards
    //                                 } else {
    //                                     /* This wasn't expected, flag the hst, return an error */
    //                                     guard_socket.error_msg =
    //                                         Some("Expected a container".to_string());

    //                                     return Err(ParserError::UnexpectedHSTStructure);
    //                                 }
    //                             }
    //                         },
    //                         declarations: match &mut decs_socket.structure {
    //                             None => vec![],
    //                             Some(decs_structure) => {
    //                                 if let HSTStructure::Container(decs_container) = decs_structure
    //                                 {
    //                                     /* Alright, so now we're trying to parse each of the children into a declaration */
    //                                     let mut declarations = vec![];

    //                                     for child in &mut decs_container.children {
    //                                         declarations.push(self.parse_declaration(child, env)?);
    //                                     }

    //                                     declarations
    //                                 } else {
    //                                     /* This wasn't expected, flag the HST, return an error */
    //                                     decs_socket.error_msg = Some(
    //                                         "Expected a container of declarations".to_string(),
    //                                     );

    //                                     return Err(ParserError::UnexpectedHSTStructure);
    //                                 }
    //                             }
    //                         },
    //                         return_expression: self
    //                             .parse_structure_expression(return_socket, env)?,
    //                     })
    //                 } else {
    //                     /* Unexpected configuration of structure */
    //                     hst.error_msg = Some("Unexpected configuration of children".to_string());

    //                     return Err(ParserError::UnexpectedConfiguration);
    //                 }
    //             } else {
    //                 /* We expected a container. Flag the HST, and return an error */
    //                 hst.error_msg = Some("Expected a container".to_string());

    //                 return Err(ParserError::UnexpectedHSTStructure);
    //             }
    //         }
    //     }
    // }

    // fn parse_guard(
    //     &self,
    //     hst: &mut HSTStructureSocket,
    //     env: &mut Box<dyn SyntaxEnvControl>,
    // ) -> Result<ModuleGuard, ParserError> {
    //     unimplemented!()
    // }

    // fn parse_declaration(
    //     &self,
    //     hst: &mut HSTStructureSocket,
    //     env: &mut Box<dyn SyntaxEnvControl>,
    // ) -> Result<Declaration, ParserError> {
    //     match &mut hst.structure {
    //         None => {
    //             /* TODO: Handle the case where we need to scarse */
    //             unimplemented!()
    //         }
    //         Some(structure) => {
    //             match structure {
    //                 HSTStructure::Line(line) => {
    //                     /* First handle the case where we're dealing with just a single line */
    //                     match line.line_type {
    //                         HSTLineType::Axiom => {
    //                             /* Axioms aren't decs, unexpected */
    //                             hst.error_msg = Some("Expected a declaration".to_string());

    //                             return Err(ParserError::UnexpectedLineType);
    //                         }
    //                         HSTLineType::Theorem | HSTLineType::Lemma => {
    //                             /* We deal with theorems and lemmas in the same way */
    //                             /* We're dealing with Prop (Type) | Witness (value)   Label (var) */
    //                             /* The prop and witness are both just expressions, the label is a term */
    //                             let prop = self.parse_lex_expression(&mut line.main_lex, env)?;

    //                             let witness = match &mut line.right_lex {
    //                                 None => None,
    //                                 Some(lex) => self.parse_lex_expression(lex, env)?,
    //                             };

    //                             let term = match &mut line.label_lex {
    //                                 None => None,
    //                                 Some(lex) => self.parse_term_from_label(lex, env)?,
    //                             };

    //                             Ok(Declaration::Let(LetDec {
    //                                 term_def: TermDef {
    //                                     term,
    //                                     term_type: prop.and_then(|prop| Some(Box::new(prop))),
    //                                 },
    //                                 value: witness.and_then(|w| Some(Box::new(w))),
    //                             }))
    //                         }
    //                         HSTLineType::Basic => {
    //                             /* There are two main cases here.  The first in which
    //                             all line lexes are non-empty, which indicates a line in a
    //                             two-column proof.  Otherwise, we just parse the main lex
    //                             as a declaration*/
    //                             if let (Some(r_lex), Some(l_lex)) =
    //                                 (&mut line.right_lex, &mut line.label_lex)
    //                             {
    //                                 /* In this case, we parse everything like we did before for theorems and lemmas */
    //                                 let prop =
    //                                     self.parse_lex_expression(&mut line.main_lex, env)?;

    //                                 let witness = self.parse_lex_expression(r_lex, env)?;

    //                                 let term = self.parse_term_from_label(l_lex, env)?;

    //                                 Ok(Declaration::Let(LetDec {
    //                                     term_def: TermDef {
    //                                         term,
    //                                         term_type: prop.and_then(|prop| Some(Box::new(prop))),
    //                                     },
    //                                     value: witness.and_then(|w| Some(Box::new(w))),
    //                                 }))
    //                             } else if line.right_lex.is_some() || line.label_lex.is_some() {
    //                                 /* Now we're in no man's land.  Throw an unexpected configuration*/
    //                                 hst.error_msg = Some(
    //                                     "Unexpected configuration of line lex for expression"
    //                                         .to_string(),
    //                                 );

    //                                 return Err(ParserError::UnexpectedConfiguration);
    //                             } else {
    //                                 /* Finally, we're in a place where we can parse the main lex as a declaration */
    //                                 self.parse_lex_declaration(&mut line.main_lex, env)
    //                             }
    //                         }
    //                     }
    //                 }
    //                 HSTStructure::Container(_) => {
    //                     /* We'll just leave this unimplemented for the time being*/
    //                     unimplemented!()
    //                 }
    //             }
    //         }
    //     }
    // }

    // fn parse_lex_declaration(
    //     &self,
    //     lex: &mut HSTLexSocket,
    //     env: &mut Box<dyn SyntaxEnvControl>,
    // ) -> Result<Declaration, ParserError> {
    //     let element = lex
    //         .element
    //         .as_mut()
    //         .ok_or(ParserError::UnexpectedEmptySocket)?;

    //     /* Only going to do let for now */
    //     match element.lex_type {
    //         HSTLexType::Let => {
    //             /* Alright we expect two sockets on this element, for the term def and the value */
    //             if let [term_lex, value_lex] = element.lex_sockets.as_mut_slice() {
    //                 Ok(Declaration::Let(LetDec {
    //                     term_def: self.parse_lex_term_def(term_lex, env)?,
    //                     value: self
    //                         .parse_lex_expression(value_lex, env)?
    //                         .and_then(|v| Some(Box::new(v))),
    //                 }))
    //             } else {
    //                 return Err(ParserError::UnexpectedConfiguration);
    //             }
    //         }
    //         // TODO: Need to change this
    //         _ => Err(ParserError::UnexpectedConfiguration),
    //     }
    // }

    // fn parse_lex_term_def(
    //     &self,
    //     lex: &mut HSTLexSocket,
    //     /* Sometimes a term def will only include a single element,
    //     and we need to indicate whether that should be construed as a term or a type*/
    //     env: &mut Box<dyn SyntaxEnvControl>,
    // ) -> Result<TermDef, ParserError> {
    //     match &mut lex.element {
    //         Some(e) => {
    //             match e.lex_type {
    //                 HSTLexType::TypeMap => {
    //                     /* if this is a type map, then we can take the mother fucker apart */
    //                     if let [term_lex, term_type_lex] = e.lex_sockets.as_mut_slice() {
    //                         Ok(TermDef {
    //                             term: self.parse_lex_term(term_lex, env)?,
    //                             term_type: self
    //                                 .parse_lex_expression(term_type_lex, env)?
    //                                 .and_then(|tt| Some(Box::new(tt))),
    //                         })
    //                     } else {
    //                         lex.error_msg = Some("Expected a term and a type".to_string());

    //                         return Err(ParserError::UnexpectedConfiguration);
    //                     }
    //                 }
    //                 HSTLexType::Term => {
    //                     if let [term_lex] = e.lex_sockets.as_mut_slice() {
    //                         Ok(TermDef {
    //                             term: self.parse_lex_term(term_lex, env)?,
    //                             term_type: None,
    //                         })
    //                     } else {
    //                         lex.error_msg = Some("Expected a term".to_string());

    //                         return Err(ParserError::UnexpectedConfiguration);
    //                     }
    //                 }
    //                 HSTLexType::TermType => {
    //                     if let [tt_lex] = e.lex_sockets.as_mut_slice() {
    //                         Ok(TermDef {
    //                             term: None,
    //                             term_type: self
    //                                 .parse_lex_expression(tt_lex, env)?
    //                                 .and_then(|tt| Some(Box::new(tt))),
    //                         })
    //                     } else {
    //                         lex.error_msg = Some("Expected a type".to_string());

    //                         return Err(ParserError::UnexpectedConfiguration);
    //                     }
    //                 }
    //                 _ => Err(ParserError::UnexpectedConfiguration),
    //             }
    //         }
    //         None => Ok(TermDef {
    //             term_type: None,
    //             term: None,
    //         }),
    //     }
    // }

    // fn parse_lex_term(
    //     &self,
    //     lex: &mut HSTLexSocket,
    //     env: &mut Box<dyn SyntaxEnvControl>,
    // ) -> Result<Option<String>, ParserError> {
    //     unimplemented!()
    // }

    // fn parse_lex_expression(
    //     &self,
    //     lex: &mut HSTLexSocket,
    //     env: &mut Box<dyn SyntaxEnvControl>,
    // ) -> Result<Option<Expression>, ParserError> {
    //     unimplemented!()
    // }

    // fn parse_term_from_label(
    //     &self,
    //     lex: &mut HSTLexSocket,
    //     env: &mut Box<dyn SyntaxEnvControl>,
    // ) -> Result<Option<String>, ParserError> {
    //     unimplemented!()
    // }

    // fn parse_structure_expression(
    //     &self,
    //     hst: &mut HSTStructureSocket,
    //     env: &mut Box<dyn SyntaxEnvControl>,
    // ) -> Result<Option<Expression>, ParserError> {
    //     unimplemented!()
    // }
}

impl ParserControl for Parser {
    fn parse_hybrid_syntax_tree(
        &self,
        hybrid_syntax_tree: &mut HSTStructureSocket,
    ) -> Result<ParsedRepTree, ParserError> {
        Ok(ParsedRepTree {
            root_module: self.parse_module(hybrid_syntax_tree)?,
        })
    }
}

pub enum ParserError {
    UnexpectedHSTStructure,
    UnexpectedConfiguration,
    UnexpectedNumberOfChildren,
    UnexpectedLineType,
    UnexpectedEmptySocket,
}
