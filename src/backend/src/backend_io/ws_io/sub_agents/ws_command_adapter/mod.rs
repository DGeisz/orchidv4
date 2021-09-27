use crate::backend_io::ws_io::basic_msgs::ws_commands::WsCommand;
use crate::backend_io::ws_io::basic_msgs::ws_response::WsResponse;
use crate::backend_io::ws_io::sub_agents::ws_command_adapter::port::WsCommandAdapterPort;
use crate::curator::port::CuratorControl;

pub mod port;

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
        unimplemented!()
    }
}
