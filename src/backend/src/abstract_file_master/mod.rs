use crate::abstract_file_master::generator::port::AFMGeneratorControl;
use crate::abstract_file_master::port::AFMControl;

pub mod generator;
pub mod port;

pub struct AbstractFileMaster {}

impl AbstractFileMaster {
    pub fn new() -> Box<dyn AFMControl> {
        Box::new(AbstractFileMaster)
    }
}

impl AFMControl for AbstractFileMaster {}
