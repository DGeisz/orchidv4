use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::latex_utils::{
    add_tex_color, tex_text, DEEP_BLUE, MEDIUM_FOREST_GREEN, MEDIUM_PINK,
};
use crate::abstract_file_master::portable_reps::visual_rep_skeleton::{
    VRSContainer, VRSLine, VRSNode, VRSNodeSocket, VRSTexElement, VRSTexSocket,
};

pub mod latex_utils;

/// Here HST is hybrid syntax tree
pub struct HSTStructureSocket {
    id: String,
    structure: HSTStructure,
    left_input: Option<String>,
    right_input: Option<String>,
}

impl HSTStructureSocket {
    pub fn new_empty(id: String) -> HSTStructureSocket {
        HSTStructureSocket {
            id,
            structure: HSTStructure::None,
            left_input: None,
            right_input: None,
        }
    }

    pub fn to_vrs_node_socket(&self) -> VRSNodeSocket {
        VRSNodeSocket::new(self.id.clone(), self.structure.to_vrs_node())
    }
}

pub enum HSTStructure {
    Line(Box<HSTLine>),
    Container(Box<HSTContainer>),
    None,
}

impl HSTStructure {
    pub fn to_vrs_node(&self) -> Option<Box<VRSNode>> {
        match &self {
            HSTStructure::Line(line) => Some(Box::new(VRSNode::Line(line.to_vrs_line()))),
            HSTStructure::Container(container) => {
                Some(Box::new(VRSNode::Container(container.to_vrs_container())))
            }
            HSTStructure::None => None,
        }
    }
}

pub enum HSTLineType {
    Axiom,
    Theorem,
    Lemma,
    Basic,
}

pub struct HSTLine {
    id: String,
    line_type: HSTLineType,
    comment: Option<String>,
    main_lex: HSTLexSocket,
    right_lex: Option<HSTLexSocket>,
    label_lex: Option<HSTLexSocket>,
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

        VRSLine::new(
            self.id.clone(),
            title,
            self.comment.clone(),
            self.main_lex.to_vrs_tex_socket(),
            match &self.right_lex {
                Some(lex) => Some(lex.to_vrs_tex_socket()),
                None => None,
            },
            match &self.label_lex {
                Some(lex) => Some(lex.to_vrs_tex_socket()),
                None => None,
            },
            border_bottom,
            border_top,
        )
    }
}

pub struct HSTContainer {
    id: String,
    left_border: bool,
    indented: bool,
    children: Vec<HSTStructureSocket>,
}

impl HSTContainer {
    pub fn to_vrs_container(&self) -> VRSContainer {
        VRSContainer::new(
            self.id.clone(),
            self.left_border,
            self.indented,
            self.children
                .iter()
                .map(|child| child.to_vrs_node_socket())
                .collect(),
        )
    }
}

pub struct HSTLexSocket {
    id: String,
    left_input: Option<String>,
    right_input: Option<String>,
    element: Option<Box<HSTLexElement>>,
}

impl HSTLexSocket {
    pub fn to_vrs_tex_socket(&self) -> VRSTexSocket {
        VRSTexSocket::new(
            self.id.clone(),
            match &self.element {
                Some(element) => Some(Box::new(element.to_vrs_tex_element())),
                None => None,
            },
        )
    }
}

pub enum HSTLexType {
    Let,
    // TypeMap,
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
    // CustomLabel(String),
}

pub struct HSTLexElement {
    lex_type: HSTLexType,
    lex_sockets: Vec<HSTLexSocket>,
    tex_template: Option<Vec<String>>,
}

impl HSTLexElement {
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
