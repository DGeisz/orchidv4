use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub enum OrchidFileTree {
    File {
        file_name: String,
        formatted_name: String,
    },
    Folder {
        folder_name: String,
        children: Vec<Box<OrchidFileTree>>,
    },
    OrchidModule {
        folder_name: String,
        formatted_name: String,
        children: Vec<Box<OrchidFileTree>>,
    },
}

pub enum OFTError {
    Err,
}
