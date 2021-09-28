use crate::abstract_file_master::generator::port::AFMGeneratorControl;
use crate::abstract_file_master::port::AFMControl;
use crate::curator::port::CuratorControl;
use crate::curator::sub_agents::file_system_adapter::port::FSAControl;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::{
    OFTError, OrchidFileTree,
};
use std::collections::HashMap;

pub mod port;
pub mod sub_agents;

#[cfg(test)]
mod tests;

pub struct Curator {
    /// HashMap of all open Abstract File Masters
    abstract_file_masters: HashMap<String, Box<dyn AFMControl>>,
    /// AFM Generator
    afm_generator: Box<dyn AFMGeneratorControl>,
    file_system_adapter: Box<dyn FSAControl>,
}

impl Curator {
    pub fn new(
        afm_generator: Box<dyn AFMGeneratorControl>,
        file_system_adapter: Box<dyn FSAControl>,
    ) -> Box<dyn CuratorControl> {
        Box::new(Curator {
            afm_generator,
            abstract_file_masters: HashMap::new(),
            file_system_adapter,
        })
    }
}

impl CuratorControl for Curator {
    fn get_root_file_tree(&self) -> Result<OrchidFileTree, OFTError> {
        self.file_system_adapter.get_root_file_tree()
    }
}
