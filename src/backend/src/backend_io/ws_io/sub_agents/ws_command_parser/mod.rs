use crate::backend_io::ws_io::basic_msgs::ws_commands::WsCommand;
use crate::backend_io::ws_io::sub_agents::ws_command_adapter::port::WsCommandAdapterPort;
use crate::backend_io::ws_io::sub_agents::ws_command_parser::basic_msgs::message_consumption_response::MessageConsumptionResponse;
use crate::backend_io::ws_io::sub_agents::ws_command_parser::port::WsCommandParserPort;
use log::trace;
use crate::backend_io::ws_io::basic_msgs::ws_response::{WsResponse, WsError};

pub mod basic_msgs;
pub mod port;

#[cfg(test)]
mod tests;

/// The struct that attempts to parse
/// the raw text from websocket messages
/// into meaningful commands
pub struct WsCommandParser {
    command_consumer: Box<dyn WsCommandAdapterPort>,
}

impl WsCommandParser {
    pub fn new(command_consumer: Box<dyn WsCommandAdapterPort>) -> Box<dyn WsCommandParserPort> {
        Box::new(WsCommandParser { command_consumer })
    }
}

impl WsCommandParserPort for WsCommandParser {
    fn consume_ws_message(&mut self, message: String) -> MessageConsumptionResponse {
        /*
        Attempt to deserialize the message
        */
        let de_result: Result<WsCommand, _> = serde_json::from_str(&message);

        trace!("This is result: {:?}", de_result);

        match de_result {
            Ok(ws_command) => {
                let (response, terminate) = self.command_consumer.consume_ws_command(ws_command);

                /*
                Check if the response is an error with a no-op,
                and if so return None early.

                For now, if we get a no op error, just return None
                */
                if let WsResponse::Err(err) = &response {
                    if let WsError::NoOp = err {
                        return MessageConsumptionResponse::None;
                    }
                }

                let ser_res = serde_json::to_string(&response).unwrap();

                /*
                Send a termination message back to the server if terminate is flagged
                */
                if terminate {
                    MessageConsumptionResponse::Terminate(ser_res)
                } else {
                    MessageConsumptionResponse::Message(ser_res)
                }
            }
            Err(_) => MessageConsumptionResponse::None,
        }
    }
}
