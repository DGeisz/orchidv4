use crate::kernel::basic_msgs::kernel_diagnostic::KernelDiagnostic;
use crate::kernel::port::KernelControl;
use crate::parser::portable_reps::parsed_rep_tree::ParsedRepTree;

pub mod basic_msgs;
pub mod port;

pub struct Kernel {}

impl Kernel {
    pub fn new() -> Box<dyn KernelControl> {
        Box::new(Kernel {})
    }
}

impl KernelControl for Kernel {
    fn check_parsed_rep_tree(&self, parsed_rep_tree: ParsedRepTree) -> Vec<KernelDiagnostic> {
        unimplemented!()
    }
}
