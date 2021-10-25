use serde::{Deserialize, Serialize};
use std::io::Error;
use std::path::PathBuf;

#[cfg(test)]
mod tests;

#[derive(Serialize, Deserialize, Debug, Eq, PartialEq, Clone)]
pub enum OrchidFilePath {
    File(OrchidFileLink),
    Folder {
        folder_name: String,
        child: Option<Box<OrchidFilePath>>,
    },
    OrchidModule {
        folder_name: String,
        formatted_name: String,
        child: Option<Box<OrchidFilePath>>,
    },
}

#[derive(Serialize, Deserialize, Debug, Eq, PartialEq, Clone)]
pub struct OrchidFileLink {
    file_name: String,
    formatted_name: String,
}

impl OrchidFileLink {
    pub fn new(file_name: String, formatted_name: String) -> OrchidFileLink {
        OrchidFileLink {
            file_name,
            formatted_name,
        }
    }

    pub fn get_file_name(&self) -> &String {
        &self.file_name
    }

    pub fn get_formatted_name(&self) -> &String {
        &self.formatted_name
    }
}

impl OrchidFilePath {
    pub fn to_path_buf(&self) -> Result<PathBuf, OFPError> {
        let mut base_path = std::env::current_dir()?;

        self.to_path_buf_helper(&mut base_path);

        Ok(base_path)
    }

    fn to_path_buf_helper(&self, path: &mut PathBuf) {
        match self {
            OrchidFilePath::File(file_link) => path.push(&file_link.file_name),
            OrchidFilePath::Folder { folder_name, child }
            | OrchidFilePath::OrchidModule {
                folder_name, child, ..
            } => {
                path.push(folder_name);

                if let Some(path_child) = child {
                    path_child.to_path_buf_helper(path);
                }
            }
        }
    }

    pub fn to_path_string(&self) -> String {
        let mut path_str = String::from("./");
        path_str.push_str(&self.to_path_string_helper());

        path_str
    }

    fn to_path_string_helper(&self) -> String {
        match self {
            OrchidFilePath::File(file_link) => file_link.file_name.clone(),
            OrchidFilePath::Folder { folder_name, child }
            | OrchidFilePath::OrchidModule {
                folder_name, child, ..
            } => {
                let mut final_str = String::new();

                final_str.push_str(folder_name);
                final_str.push('/');
                final_str.push_str(&match child {
                    None => String::new(),
                    Some(path_child) => path_child.to_path_string_helper(),
                });

                final_str
            }
        }
    }

    pub fn get_tail_file(&self) -> Option<&OrchidFileLink> {
        match self {
            OrchidFilePath::File(file_link) => Some(file_link),
            OrchidFilePath::Folder { child, .. } | OrchidFilePath::OrchidModule { child, .. } => {
                match child {
                    None => None,
                    Some(child_link) => child_link.get_tail_file(),
                }
            }
        }
    }
}

#[derive(Debug)]
pub enum OFPError {
    Err,
    LastLinkNotFile,
    BadPath,
}

impl From<std::io::Error> for OFPError {
    fn from(_: Error) -> Self {
        OFPError::Err
    }
}

#[derive(Serialize, Deserialize, Debug, Eq, PartialEq, Clone)]
pub struct OrchidOpenFiles {
    clusters: Vec<OrchidFileCluster>,
}

impl OrchidOpenFiles {
    pub fn new_empty() -> OrchidOpenFiles {
        OrchidOpenFiles { clusters: vec![] }
    }
}

#[derive(Serialize, Deserialize, Debug, Eq, PartialEq, Clone)]
pub struct OrchidFileCluster {
    focused_child: u8,
    file_paths: Vec<OrchidFilePath>,
}
