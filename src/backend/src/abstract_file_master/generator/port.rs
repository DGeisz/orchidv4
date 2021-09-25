use crate::abstract_file_master::port::AFMControl;

pub trait AFMGeneratorControl {
    fn gen_afm(&self) -> Box<dyn AFMControl>;
}
