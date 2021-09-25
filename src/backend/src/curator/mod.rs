use crate::abstract_file_master::generator::port::AFMGeneratorControl;
use crate::abstract_file_master::port::AFMControl;
use crate::curator::port::CuratorControl;
use std::collections::HashMap;

pub mod port;
pub mod sub_ias;

#[cfg(test)]
mod tests;

pub struct Curator {
    /// HashMap of all open Abstract File Masters
    afms: HashMap<String, Box<dyn AFMControl>>,
    /// AFM Generator
    afm_generator: Box<dyn AFMGeneratorControl>,
}

impl Curator {}

impl CuratorControl for Curator {
    fn get_file_tree(&self) {
        unimplemented!()
    }
}
