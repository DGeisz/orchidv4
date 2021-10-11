use crate::abstract_file_master::generator::port::AFMGeneratorControl;
use crate::abstract_file_master::port::AFMControl;
use crate::abstract_file_master::AbstractFileMaster;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OFPError, OrchidFilePath,
};
use crate::curator::sub_agents::id_generator::port::IdGenControl;
use std::rc::Rc;

pub mod port;

pub struct AFMGenerator {
    id_generator: Rc<dyn IdGenControl>,
}

impl AFMGenerator {
    pub fn new(id_generator: Rc<dyn IdGenControl>) -> Box<dyn AFMGeneratorControl> {
        Box::new(AFMGenerator { id_generator })
    }
}

impl AFMGeneratorControl for AFMGenerator {
    fn get_new_afm_at_path(&self, path: OrchidFilePath) -> Result<Box<dyn AFMControl>, OFPError> {
        AbstractFileMaster::new(Rc::clone(&self.id_generator), path)
    }
}
