use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::latex_utils::{
    add_tex_color, tex_text, DEEP_BLUE, MEDIUM_FOREST_GREEN, MEDIUM_PINK,
};
use crate::abstract_file_master::portable_reps::visual_rep_skeleton::{
    VRSContainer, VRSLine, VRSNode, VRSNodeSocket, VRSTexElement, VRSTexSocket,
};

pub mod latex_utils;

/// Here HST is hybrid syntax tree
#[derive(Debug, PartialEq, Eq)]
pub struct HSTStructureSocket {
    pub id: String,
    pub structure: Option<HSTStructure>,
    pub left_input: Option<String>,
    pub right_input: Option<String>,
    pub error_msg: Option<String>,
}

impl HSTStructureSocket {
    pub fn new_empty(id: String) -> HSTStructureSocket {
        HSTStructureSocket {
            id,
            structure: None,
            left_input: None,
            right_input: None,
            error_msg: None,
        }
    }

    pub fn to_vrs_node_socket(&self) -> VRSNodeSocket {
        VRSNodeSocket {
            id: self.id.clone(),
            node: match &self.structure {
                Some(s) => Some(s.to_vrs_node()),
                None => None,
            },
        }
    }

    pub fn append_input(
        &mut self,
        input: String,
        socket_id: String,
        left: bool,
    ) -> Result<(), HSTError> {
        if socket_id == self.id {
            if left {
                self.left_input = Some(input);
            } else {
                self.right_input = Some(input);
            }

            Ok(())
        } else {
            self.structure
                .as_mut()
                .ok_or(HSTError::SocketNotFound)?
                .append_input(input, socket_id, left)
        }
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum HSTStructure {
    Line(Box<HSTLine>),
    Container(Box<HSTContainer>),
}

impl HSTStructure {
    pub fn to_vrs_node(&self) -> Box<VRSNode> {
        match &self {
            HSTStructure::Line(line) => Box::new(VRSNode::Line(line.to_vrs_line())),
            HSTStructure::Container(container) => {
                Box::new(VRSNode::Container(container.to_vrs_container()))
            }
        }
    }

    pub fn append_input(
        &mut self,
        input: String,
        socket_id: String,
        left: bool,
    ) -> Result<(), HSTError> {
        Err(HSTError::SocketNotFound)
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum HSTLineType {
    Axiom,
    Theorem,
    Lemma,
    Basic,
}

#[derive(Debug, PartialEq, Eq)]
pub struct HSTLine {
    pub id: String,
    pub line_type: HSTLineType,
    pub comment: Option<String>,
    pub main_lex: HSTLexSocket,
    pub right_lex: Option<HSTLexSocket>,
    pub label_lex: Option<HSTLexSocket>,
}

impl HSTLine {
    pub fn to_vrs_line(&self) -> VRSLine {
        let title: Option<String>;
        let border_top: bool;
        let border_bottom: bool;

        match &self.line_type {
            HSTLineType::Axiom => {
                title = Some(add_tex_color(tex_text("Axiom").as_str(), DEEP_BLUE));
                border_top = false;
                border_bottom = true;
            }
            HSTLineType::Theorem => {
                title = Some(add_tex_color(
                    tex_text("Theorem").as_str(),
                    MEDIUM_FOREST_GREEN,
                ));
                border_top = false;
                border_bottom = true;
            }
            HSTLineType::Lemma => {
                title = Some(add_tex_color(tex_text("Lemma").as_str(), MEDIUM_PINK));
                border_top = false;
                border_bottom = true;
            }
            HSTLineType::Basic => {
                title = None;
                border_top = false;
                border_bottom = false;
            }
        }

        VRSLine {
            id: self.id.clone(),
            title,
            comment: self.comment.clone(),
            main_tex: self.main_lex.to_vrs_tex_socket(),
            right_tex: self
                .label_lex
                .as_ref()
                .and_then(|lex| Some(lex.to_vrs_tex_socket())),
            label_tex: self
                .label_lex
                .as_ref()
                .and_then(|lex| Some(lex.to_vrs_tex_socket())),
            border_bottom,
            border_top,
        }
    }
}

#[derive(Debug, PartialEq, Eq)]
pub struct HSTContainer {
    pub id: String,
    pub left_border: bool,
    pub indented: bool,
    pub children: Vec<HSTStructureSocket>,
}

impl HSTContainer {
    pub fn to_vrs_container(&self) -> VRSContainer {
        VRSContainer {
            id: self.id.clone(),
            left_border: self.left_border,
            indented: self.indented,
            children: self
                .children
                .iter()
                .map(|child| child.to_vrs_node_socket())
                .collect(),
        }
    }
}

#[derive(Debug, PartialEq, Eq)]
pub struct HSTLexSocket {
    pub id: String,
    pub left_input: Option<String>,
    pub right_input: Option<String>,
    pub element: Option<Box<HSTLexElement>>,
    pub error_msg: Option<String>,
}

impl HSTLexSocket {
    pub fn to_vrs_tex_socket(&self) -> VRSTexSocket {
        VRSTexSocket {
            id: self.id.clone(),
            element: match &self.element {
                Some(element) => Some(Box::new(element.to_vrs_tex_element())),
                None => None,
            },
        }
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum HSTLexType {
    Let,
    TypeMap,
    Term,
    TermType,
    // UseMod,
    // Mod,
    // Theory,
    // Given,
    // Assume,
    // Fn,
    // Pi,
    // ForAll,
    // Syntax,
    // TreeNode,
    CustomLabel(String),
}

#[derive(Debug, PartialEq, Eq)]
pub struct HSTLexElement {
    pub lex_type: HSTLexType,
    pub lex_sockets: Vec<HSTLexSocket>,
    pub tex_template: Option<Vec<String>>,
}

impl HSTLexElement {
    // TODO: Make this into a result, and deal with it
    pub fn to_vrs_tex_element(&self) -> VRSTexElement {
        let tex_template: Vec<String>;

        match &self.lex_type {
            HSTLexType::Let => {
                tex_template = vec![format!(
                    "{} {} {{",
                    add_tex_color(tex_text("Let").as_str(), ""),
                    1
                )];
            } // HSTLexType::TypeMap => {}
              // HSTLexType::UseMod => {}
              // HSTLexType::Mod => {}
              // HSTLexType::Theory => {}
              // HSTLexType::Given => {}
              // HSTLexType::Assume => {}
              // HSTLexType::Fn => {}
              // HSTLexType::Pi => {}
              // HSTLexType::ForAll => {}
              //
              // HSTLexType::Syntax => {}
              // HSTLexType::TreeNode => {}
              // HSTLexType::CustomLabel(_) => {}
        }

        unimplemented!()
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum HSTError {
    SocketNotFound,
}
