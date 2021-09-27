use crate::backend_io::ws_io::basic_msgs::ws_commands::WsCommand;
use crate::backend_io::ws_io::basic_msgs::ws_response::WsResponse;
use mockall::*;

#[automock]
pub trait WsCommandAdapterPort {
    /// Consumes a parsed command and returns the ws
    /// response to the command from the curator
    ///
    /// First return is the actual response, second return
    /// is whether to terminate the server following the completion
    /// of the response
    fn consume_ws_command(&mut self, ws_command: WsCommand) -> (WsResponse, bool);
}

pub fn mock_ws_command_consumer() -> MockWsCommandAdapterPort {
    MockWsCommandAdapterPort::new()
}
