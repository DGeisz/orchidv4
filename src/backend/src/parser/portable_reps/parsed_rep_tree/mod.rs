use tokio_tungstenite::tungstenite::stream::Mode;

#[derive(Debug, PartialEq, Eq)]
pub struct ParsedRepTree {
    pub root_module: Module,
}

#[derive(Debug, PartialEq, Eq)]
pub struct Module {
    args: Vec<TermDef>,
    imports: Vec<TermImport>,
    declaration: Vec<Declaration>,
    return_expr: Option<Expression>
}

#[derive(Debug, PartialEq, Eq)]
pub struct TermDef {
    term: String,
    term_type: Option<Expression>
}

#[derive(Debug, PartialEq, Eq)]
pub enum Declaration {

}

#[derive(Debug, PartialEq, Eq)]
pub enum Expression {

}

#[derive(Debug, PartialEq, Eq)]
pub struct TermImport {

}
