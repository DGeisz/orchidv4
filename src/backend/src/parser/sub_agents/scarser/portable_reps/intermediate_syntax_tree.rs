#[derive(Eq, PartialEq, Debug)]
pub enum IstDec {
    Full(IstDecOp, IstDecArg),
    None,
}

#[derive(Eq, PartialEq, Debug)]
pub enum IstDecOp {
    Let,
    Theorem,
    Lemma,
    Prop,
}

#[derive(Eq, PartialEq, Debug)]
pub enum IstDecArg {
    Full(IstTermDef, IstExpr),
    Partial(IstTermDef),
    None,
}

#[derive(Eq, PartialEq, Debug)]
pub enum IstTermDef {
    Full(IstSymbolDef, IstExpr),
    TermPartial(IstSymbolDef),
    TypePartial(IstExpr),
    None,
}

#[derive(Eq, PartialEq, Debug)]
pub enum IstSymbolDef {
    WithRep { seq: String, repr: String },
    Solo(String),
    None,
}

#[derive(Eq, PartialEq, Debug)]
pub enum IstExpr {
    None,
}
