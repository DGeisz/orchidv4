use crate::abstract_file_master::port::AFMControl;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OFPError, OrchidFilePath,
};

pub trait AFMGeneratorControl {
    fn get_new_afm_at_path(&self, path: OrchidFilePath) -> Result<Box<dyn AFMControl>, OFPError>;
}
