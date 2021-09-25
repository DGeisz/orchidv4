use crate::abstract_file_master::generator::port::AFMGeneratorControl;
use crate::abstract_file_master::port::AFMControl;
use crate::abstract_file_master::AbstractFileMaster;

pub mod port;

pub struct AFMGenerator;

impl AFMGenerator {
    pub fn new() -> Box<dyn AFMGeneratorControl> {
        Box::new(AFMGenerator)
    }
}

impl AFMGeneratorControl for AFMGenerator {
    fn gen_afm(&self) -> Box<dyn AFMControl> {
        AbstractFileMaster::new()
    }
}
