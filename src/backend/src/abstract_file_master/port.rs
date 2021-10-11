use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::HSTStructureSocket;
use crate::abstract_file_master::portable_reps::visual_rep_skeleton::VisualRepSkeleton;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::OrchidFilePath;
use crate::kernel::basic_msgs::kernel_diagnostic::KernelDiagnostic;

pub trait AFMControl {
    fn get_id(&self) -> &String;
    fn get_file_path(&self) -> &OrchidFilePath;
    fn get_visual_rep_skeleton(&self) -> VisualRepSkeleton;
    fn get_hybrid_syntax_tree(&mut self) -> &mut HSTStructureSocket;
    fn process_kernel_diagnostics(&mut self, diagnostics: Vec<KernelDiagnostic>);
}
