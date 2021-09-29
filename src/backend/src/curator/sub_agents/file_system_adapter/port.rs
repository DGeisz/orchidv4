use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OFPError, OrchidFilePath,
};
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::{
    OFTError, OrchidFileTree,
};

pub trait FSAControl {
    fn get_root_file_tree(&self) -> Result<OrchidFileTree, OFTError>;

    fn open_file(&self, path: &OrchidFilePath) -> Result<(), OFPError>;
}
