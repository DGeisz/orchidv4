use crate::backend_io::ws_io::sub_ias::ws_command_parser::b_msgs::message_consumption_response::MessageConsumptionResponse;
use mockall::*;
use serde::{Deserialize, Serialize};

/// This port provides an interface that consumes
/// the raw text coming straight from ws messages,
/// and potentially provide responses to be sent back
/// to all websocket clients.
#[automock]
pub trait WsCommandParserPort {
    /// Consumes a raw ws message and optionally returns
    /// text meant to be sent back through all ws clients
    fn consume_ws_message(&mut self, message: String) -> MessageConsumptionResponse;
}

pub fn mock_ws_message_consumer() -> MockWsCommandParserPort {
    MockWsCommandParserPort::new()
}
