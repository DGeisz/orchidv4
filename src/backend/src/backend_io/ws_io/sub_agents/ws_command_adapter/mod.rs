use crate::abstract_file_master::portable_reps::visual_rep_skeleton::VisualRepSkeleton;
use crate::backend_io::ws_io::basic_msgs::ws_commands::WsCommand;
use crate::backend_io::ws_io::basic_msgs::ws_response::{WsError, WsResponse};
use crate::backend_io::ws_io::sub_agents::ws_command_adapter::port::WsCommandAdapterPort;
use crate::curator::port::CuratorControl;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::OFPError;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::{
    OFTError, OrchidFileTree,
};

pub mod port;

const NO_OP_RES: (WsResponse, bool) = (WsResponse::Err(WsError::NoOp), false);

#[cfg(test)]
mod tests;

pub struct WsCommandAdapter {
    curator: Box<dyn CuratorControl>,
}

impl WsCommandAdapter {
    pub fn new(curator: Box<dyn CuratorControl>) -> Box<dyn WsCommandAdapterPort> {
        Box::new(WsCommandAdapter { curator })
    }
}

impl WsCommandAdapterPort for WsCommandAdapter {
    fn consume_ws_command(&mut self, ws_command: WsCommand) -> (WsResponse, bool) {
        match ws_command {
            WsCommand::GetRootOFT => match self.curator.get_root_file_tree() {
                Ok(oft) => (WsResponse::OFT(oft), false),
                Err(_) => NO_OP_RES,
            },
            WsCommand::OpenFile { path } => match self.curator.open_file(path) {
                Ok(vrs) => (WsResponse::FullVRS { vrs }, false),
                Err(_) => NO_OP_RES,
            },
            WsCommand::SaveOpenFolders { open_folders } => {
                self.curator.save_open_folders(open_folders);
                NO_OP_RES
            }
        }
    }
}
