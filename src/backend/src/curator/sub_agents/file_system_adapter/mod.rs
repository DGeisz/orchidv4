use crate::curator::sub_agents::file_system_adapter::port::FSAControl;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::{
    OFTError, OrchidFileTree,
};
use crate::curator::sub_agents::file_system_adapter::utils::clean_file_name::clean_file_name;
use std::cmp::Ordering;
use std::env;
use std::fs;
use std::fs::ReadDir;
use std::path::PathBuf;
use tokio::io::{Error, ErrorKind};

pub const ORCHID_FILE_EXTENSION: &str = ".orch";

pub mod port;
pub mod portable_reps;
pub mod utils;

#[cfg(test)]
pub mod tests;

pub struct FileSystemAdapter;

impl FileSystemAdapter {
    pub fn new() -> Box<dyn FSAControl> {
        Box::new(FileSystemAdapter)
    }

    /* First return is the path of the current dir,
    second is the final component of the path (pathless directory) */
    fn get_current_directory(&self) -> Result<(PathBuf, String), OFTError> {
        /* First get the current dir with full path */
        if let Ok(path) = env::current_dir() {
            /* Now just get the last part of the path (current dir) */
            if let Some(dir_os_str) = path.clone().iter().last() {
                /* Now convert the boi to a regular string */
                if let Some(dir_str) = dir_os_str.to_str() {
                    return Ok((path, dir_str.to_string()));
                }
            }
        }

        Err(OFTError::Err)
    }

    fn get_file_tree_from_path(&self, path: PathBuf) -> Result<Vec<Box<OrchidFileTree>>, OFTError> {
        match fs::read_dir(path.clone()) {
            Ok(files) => {
                let mut oft_vec = Vec::new();

                for file_res in files {
                    if let Ok(file) = file_res {
                        if let Ok(file_name) = file.file_name().into_string() {
                            if let Ok(file_type) = file.file_type() {
                                if file_type.is_dir() {
                                    let mut new_path = path.clone();
                                    new_path.push(file_name.clone());

                                    if let Ok(children) = self.get_file_tree_from_path(new_path) {
                                        oft_vec.push(Box::new(OrchidFileTree::Folder {
                                            folder_name: file_name,
                                            children,
                                        }))
                                    }
                                } else {
                                    if file_name.ends_with(ORCHID_FILE_EXTENSION) {
                                        oft_vec.push(Box::new(OrchidFileTree::File {
                                            formatted_name: clean_file_name(&file_name),
                                            file_name,
                                        }))
                                    }
                                }
                            }
                        }
                    }
                }

                oft_vec.sort_by(|a, b| match (&**a, &**b) {
                    (
                        OrchidFileTree::File {
                            file_name: a_name, ..
                        },
                        OrchidFileTree::File {
                            file_name: b_name, ..
                        },
                    ) => a_name.cmp(b_name),
                    (
                        OrchidFileTree::OrchidModule {
                            folder_name: a_name,
                            ..
                        },
                        OrchidFileTree::OrchidModule {
                            folder_name: b_name,
                            ..
                        },
                    ) => a_name.cmp(b_name),
                    (
                        OrchidFileTree::Folder {
                            folder_name: a_name,
                            ..
                        },
                        OrchidFileTree::Folder {
                            folder_name: b_name,
                            ..
                        },
                    ) => a_name.cmp(b_name),
                    (OrchidFileTree::Folder { .. }, ..) => Ordering::Less,
                    (OrchidFileTree::OrchidModule { .. }, OrchidFileTree::Folder { .. }) => {
                        Ordering::Greater
                    }
                    (OrchidFileTree::OrchidModule { .. }, OrchidFileTree::File { .. }) => {
                        Ordering::Less
                    }
                    (OrchidFileTree::File { .. }, ..) => Ordering::Greater,
                });

                Ok(oft_vec)
            }
            Err(_) => Err(OFTError::Err),
        }
    }
}

impl FSAControl for FileSystemAdapter {
    fn get_root_file_tree(&self) -> Result<OrchidFileTree, OFTError> {
        /* First just start off by reading what's in the current directory */
        let (current_path, current_dir) = self.get_current_directory()?;

        /* Then get the children in this dir */
        let children = self.get_file_tree_from_path(current_path)?;

        Ok(OrchidFileTree::Folder {
            folder_name: current_dir,
            children,
        })
    }
}
