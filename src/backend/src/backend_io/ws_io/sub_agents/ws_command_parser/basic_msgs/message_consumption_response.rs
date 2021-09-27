use serde::{Deserialize, Serialize};

/// The response from a message consumer
#[derive(Clone, Deserialize, Serialize, Eq, PartialEq, Debug)]
pub enum MessageConsumptionResponse {
    /// Indicates we have a message to send back
    /// to all ws clients
    Message(String),
    /// Indicates that the server should terminate
    /// after sending out this final message
    Terminate(String),
    /// Indicates that the server should continue, but
    /// no message should be sent back to ws clients
    None,
}
