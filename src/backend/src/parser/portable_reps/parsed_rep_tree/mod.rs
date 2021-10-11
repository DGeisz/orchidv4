pub struct ParsedRepTree {}

pub struct Module {
    guards: Vec<ModuleGuard>,
    declarations: Vec<Declaration>,
    return_expression: Expression,
}

pub enum Expression {
    Sort(SortExpr),
    Variable(String),
    Application(AppExpr),
    Lambda(LambdaExpr),
    Pi(PiExpr),
}

pub struct SortExpr {}

pub struct AppExpr {
    function: Option<Box<Expression>>,
    argument: Option<Box<Expression>>,
}

pub struct LambdaExpr {
    term_def: Option<TermDef>,
    value: Option<Box<Expression>>,
}

pub struct PiExpr {
    source_def: Option<TermDef>,
    target: Option<Box<Expression>>,
}

pub enum Declaration {
    Let(LetDec),
    Mod(ModDec),
    Use(UseModDec),
    Syntax(SyntaxDec),
}

pub struct TermDef {
    term: Option<String>,
    term_type: Option<Box<Expression>>,
}

pub struct LetDec {
    term_def: TermDef,
    value: Option<Box<Expression>>,
}

pub struct ModDec {
    id: Option<String>,
    module: Module,
}

pub struct UseModDec {
    path: Option<String>,
    parameters: Vec<GuardParameters>,
}

pub struct SyntaxDec {}

pub enum ModuleGuard {
    Const,
    ExtendMod,
    Universe,
}

pub enum GuardParameters {}
