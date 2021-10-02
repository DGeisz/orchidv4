pub enum HSTNodeType {
    Sort,
    Lambda,
    Pi,
    Let,
    Theorem,
    Lemma,
    Use,
    Mod,
    Open,
    Universe,
    Satisfy,
    BasicTree,
    Named { name: String, latex: Option<String> },
}

pub struct HSTNode {
    node_type: HSTNodeType,
}
