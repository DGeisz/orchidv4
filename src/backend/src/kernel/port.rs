use crate::kernel::basic_msgs::kernel_diagnostic::KernelDiagnostic;
use crate::parser::portable_reps::parsed_rep_tree::ParsedRepTree;

pub trait KernelControl {
    fn check_parsed_rep_tree(&self, prt: ParsedRepTree) -> Vec<KernelDiagnostic>;
}
