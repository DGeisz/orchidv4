use tokio_tungstenite::tungstenite::stream::Mode;

#[derive(Debug, PartialEq, Eq)]
pub struct ParsedRepTree {
    pub root_module: Module,
}

#[derive(Debug, PartialEq, Eq)]
pub struct Module {
    pub guards: Vec<ModuleGuard>,
    pub declarations: Vec<Declaration>,
    pub return_expression: Option<Expression>,
}

#[derive(Debug, PartialEq, Eq)]
pub enum Expression {
    Sort(SortExpr),
    Variable(String),
    Application(AppExpr),
    Lambda(LambdaExpr),
    Pi(PiExpr),
}

#[derive(Debug, PartialEq, Eq)]
pub struct SortExpr {}

#[derive(Debug, PartialEq, Eq)]
pub struct AppExpr {
    function: Option<Box<Expression>>,
    argument: Option<Box<Expression>>,
}

#[derive(Debug, PartialEq, Eq)]
pub struct LambdaExpr {
    term_def: Option<TermDef>,
    value: Option<Box<Expression>>,
}

#[derive(Debug, PartialEq, Eq)]
pub struct PiExpr {
    source_def: Option<TermDef>,
    target: Option<Box<Expression>>,
}

#[derive(Debug, PartialEq, Eq)]
pub enum Declaration {
    Let(LetDec),
    Mod(ModDec),
    Use(UseModDec),
    Syntax(SyntaxDec),
    None,
}

#[derive(Debug, PartialEq, Eq)]
pub struct TermDef {
    pub term: Option<String>,
    pub term_type: Option<Box<Expression>>,
}

#[derive(Debug, PartialEq, Eq)]
pub struct LetDec {
    pub term_def: TermDef,
    pub value: Option<Box<Expression>>,
}

#[derive(Debug, PartialEq, Eq)]
pub struct ModDec {
    id: Option<String>,
    module: Module,
}

#[derive(Debug, PartialEq, Eq)]
pub struct UseModDec {
    path: Option<String>,
    parameters: Vec<GuardParameters>,
}

#[derive(Debug, PartialEq, Eq)]
pub struct SyntaxDec {}

#[derive(Debug, PartialEq, Eq)]
pub enum ModuleGuard {
    Const,
    ExtendMod,
    Universe,
}

#[derive(Debug, PartialEq, Eq)]
pub enum GuardParameters {}
