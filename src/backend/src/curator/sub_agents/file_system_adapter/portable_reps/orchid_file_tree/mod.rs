use serde::{Deserialize, Serialize};
use std::io::Error;

#[derive(Serialize, Deserialize, Debug, Eq, PartialEq, Clone)]
pub enum OrchidFileTree {
    File {
        file_name: String,
        formatted_name: String,
    },
    Folder {
        folder_name: String,
        open: bool,
        children: Vec<Box<OrchidFileTree>>,
    },
    OrchidModule {
        folder_name: String,
        formatted_name: String,
        open: bool,
        children: Vec<Box<OrchidFileTree>>,
    },
}

impl OrchidFileTree {
    pub fn apply_open_folders(&mut self, open_folders: &OrchidOpenFolders) {
        if let OrchidFileTree::Folder {
            folder_name,
            open,
            children,
        }
        | OrchidFileTree::OrchidModule {
            folder_name,
            open,
            children,
            ..
        } = self
        {
            if folder_name == &open_folders.name {
                *open = open_folders.open;

                for open_child in &open_folders.children {
                    for folder_child in &mut *children {
                        if &open_child.name == folder_child.get_name() {
                            folder_child.apply_open_folders(open_child);
                            break;
                        }
                    }
                }
            }
        }
    }

    pub fn get_name(&self) -> &String {
        match self {
            OrchidFileTree::File { file_name, .. } => file_name,
            OrchidFileTree::Folder { folder_name, .. } => folder_name,
            OrchidFileTree::OrchidModule { folder_name, .. } => folder_name,
        }
    }
}

#[derive(Debug)]
pub enum OFTError {
    Err,
}

impl From<std::io::Error> for OFTError {
    fn from(_: Error) -> Self {
        OFTError::Err
    }
}

/// This structure is used to keep track of which folders
/// were open in the editor (purely an editor infrastructure
/// affair)
#[derive(Serialize, Deserialize, Debug, Eq, PartialEq, Clone)]
pub struct OrchidOpenFolders {
    name: String,
    open: bool,
    children: Vec<Box<OrchidOpenFolders>>,
}

impl OrchidOpenFolders {
    pub fn new_dummy() -> OrchidOpenFolders {
        OrchidOpenFolders {
            name: String::new(),
            open: false,
            children: vec![],
        }
    }
}
