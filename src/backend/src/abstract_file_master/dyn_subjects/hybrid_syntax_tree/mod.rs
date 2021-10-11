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
}

pub enum HSTStructure {
    Line(Box<HSTLine>),
    Container(Box<HSTContainer>),
    None,
}

pub enum HSTLineType {}

pub struct HSTLine {
    id: String,
    line_type: HSTLineType,
    comment: Option<String>,
    main_lex: HSTLexSocket,
    right_lex: HSTLexSocket,
    label_lex: HSTLexSocket,
}

pub struct HSTContainer {
    id: String,
    left_border: bool,
    indented: bool,
    children: Vec<HSTStructureSocket>,
}

pub struct HSTLexSocket {
    id: String,
    left_input: Option<String>,
    right_input: Option<String>,
    element: Option<Box<HSTLexElement>>,
}

pub enum HSTLexType {
    Let,
    TypeMap,
    UseMod,
    Mod,
    Theory,
    Given,
    Assume,
    Fn,
    Pi,
    ForAll,
    Syntax,
}

pub struct HSTLexElement {
    lex_type: HSTLexType,
    lex_sockets: Vec<HSTLexSocket>,
}
