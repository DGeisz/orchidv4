use tokio_tungstenite::tungstenite::stream::Mode;

#[derive(Debug, PartialEq, Eq)]
pub struct ParsedRepTree {
    pub root_module: Module,
}

#[derive(Debug, PartialEq, Eq)]
pub struct Module {
    pub imports: Vec<Import>,
    pub parameters: Vec<TermDef>,
    pub body: Vec<Declaration>,
    pub return_expr: Option<Expression>,
}

#[derive(Debug, PartialEq, Eq)]
pub enum Import {
    Extend(),
    Open(),
}

#[derive(Debug, PartialEq, Eq)]
pub struct Extend {
    term: String,
}

#[derive(Debug, PartialEq, Eq)]
pub struct Open {
    term: String,
    args: Vec<String>,
    extend_satisfiers: Vec<Satisfier>,
}

#[derive(Debug, PartialEq, Eq)]
pub struct Satisfier {
    term: String,
}

#[derive(Debug, PartialEq, Eq)]
pub struct TermDef {
    pub term: String,
    pub term_type: Option<Expression>,
}

#[derive(Debug, PartialEq, Eq)]
pub enum Declaration {}

#[derive(Debug, PartialEq, Eq)]
pub enum Expression {}
