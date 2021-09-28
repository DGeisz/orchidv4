use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Eq, PartialEq, Debug, Clone)]
pub enum WsCommand {
    /* Command to fetch the Orchid file from the
    root where the backend is being run*/
    GetRootOFT,
}
