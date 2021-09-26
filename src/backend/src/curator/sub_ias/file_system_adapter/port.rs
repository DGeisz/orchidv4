use crate::curator::sub_ias::file_system_adapter::sprs::orchid_file_tree::{
    OFTError, OrchidFileTree,
};

pub trait FSAControl {
    fn get_file_tree(&self) -> Result<OrchidFileTree, OFTError>;
}
