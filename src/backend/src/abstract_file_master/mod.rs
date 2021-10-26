use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::{HSTError, HSTStructureSocket};
use crate::abstract_file_master::generator::port::AFMGeneratorControl;
use crate::abstract_file_master::port::AFMControl;
use crate::abstract_file_master::portable_reps::visual_rep_skeleton::{
    VRSNodeSocket, VisualRepSkeleton,
};
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OFPError, OrchidFilePath,
};
use crate::curator::sub_agents::id_generator::port::IdGenControl;
use crate::kernel::basic_msgs::kernel_diagnostic::KernelDiagnostic;
use std::rc::Rc;

pub mod dyn_subjects;
pub mod generator;
pub mod port;
pub mod portable_reps;

pub struct AbstractFileMaster {
    id: String,
    id_generator: Rc<dyn IdGenControl>,
    file_path: OrchidFilePath,
    hst_root: HSTStructureSocket,
}

impl AbstractFileMaster {
    pub fn new(
        id_generator: Rc<dyn IdGenControl>,
        file_path: OrchidFilePath,
    ) -> Result<Box<dyn AFMControl>, OFPError> {
        /* This check lets us safely unwrap calls to get_tail_file in the future */
        if let Some(_) = file_path.get_tail_file() {
            let id = id_generator.gen_id();
            let hst_id = id_generator.gen_id();

            Ok(Box::new(AbstractFileMaster {
                id,
                id_generator,
                file_path,
                hst_root: HSTStructureSocket::new_empty(hst_id),
            }))
        } else {
            Err(OFPError::LastLinkNotFile)
        }
    }
}

impl AFMControl for AbstractFileMaster {
    fn get_id(&self) -> &String {
        &self.id
    }

    fn get_file_path(&self) -> &OrchidFilePath {
        &self.file_path
    }

    fn get_visual_rep_skeleton(&self) -> VisualRepSkeleton {
        let tail_file = self.file_path.get_tail_file().unwrap();

        VisualRepSkeleton::new(
            self.id.clone(),
            tail_file.get_file_name().clone(),
            tail_file.get_formatted_name().clone(),
            self.file_path.clone(),
            self.hst_root.to_vrs_node_socket(),
        )
    }

    fn get_hybrid_syntax_tree(&mut self) -> &mut HSTStructureSocket {
        &mut self.hst_root
    }

    fn process_kernel_diagnostics(&mut self, diagnostics: Vec<KernelDiagnostic>) {
        unimplemented!()
    }

    fn append_input(
        &mut self,
        input: String,
        socket_id: String,
        left: bool,
    ) -> Result<(), HSTError> {
        self.hst_root.append_input(input, socket_id, left)
    }
}
