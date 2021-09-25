use crate::backend_io::ws_io::b_msgs::ws_commands::WsCommand;
use crate::backend_io::ws_io::b_msgs::ws_response::WsResponse;
use crate::backend_io::ws_io::sub_ias::ws_command_adapter::port::WsCommandAdapterPort;

pub mod port;

#[cfg(test)]
mod tests;

pub struct WsCommandAdapter {/*TODO: Impl curator*/}

impl WsCommandAdapterPort for WsCommandAdapter {
    fn consume_ws_command(&mut self, ws_command: WsCommand) -> (WsResponse, bool) {
        unimplemented!()
    }
}
