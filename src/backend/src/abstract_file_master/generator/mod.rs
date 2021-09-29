use crate::abstract_file_master::generator::port::AFMGeneratorControl;
use crate::abstract_file_master::port::AFMControl;
use crate::abstract_file_master::AbstractFileMaster;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OFPError, OrchidFilePath,
};

pub mod port;

pub struct AFMGenerator;

impl AFMGenerator {
    pub fn new() -> Box<dyn AFMGeneratorControl> {
        Box::new(AFMGenerator)
    }
}

impl AFMGeneratorControl for AFMGenerator {
    fn get_new_afm_at_path(
        &self,
        id: String,
        path: OrchidFilePath,
    ) -> Result<Box<dyn AFMControl>, OFPError> {
        AbstractFileMaster::new(id, path)
    }
}
