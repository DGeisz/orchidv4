use crate::abstract_file_master::generator::port::AFMGeneratorControl;
use crate::abstract_file_master::port::AFMControl;
use crate::abstract_file_master::portable_reps::visual_rep_skeleton::VisualRepSkeleton;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OFPError, OrchidFilePath,
};

pub mod generator;
pub mod port;
pub mod portable_reps;

pub struct AbstractFileMaster {
    id: String,
    file_path: OrchidFilePath,
}

impl AbstractFileMaster {
    pub fn new(id: String, file_path: OrchidFilePath) -> Result<Box<dyn AFMControl>, OFPError> {
        /* This check lets us safely unwrap calls to get_tail_file in the future */
        if let Some(_) = file_path.get_tail_file() {
            Ok(Box::new(AbstractFileMaster { id, file_path }))
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
        )
    }
}
