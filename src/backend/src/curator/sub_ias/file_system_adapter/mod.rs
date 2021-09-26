use crate::curator::sub_ias::file_system_adapter::port::FSAControl;
use crate::curator::sub_ias::file_system_adapter::sprs::orchid_file_tree::{
    OFTError, OrchidFileTree,
};
use crate::curator::sub_ias::file_system_adapter::utils::clean_file_name::clean_file_name;
use std::cmp::Ordering;
use std::fs;
use std::fs::ReadDir;
use std::path::PathBuf;
use tokio::io::{Error, ErrorKind};

pub const ORCHID_FILE_EXTENSION: &str = ".orch";

pub mod port;
pub mod sprs;
pub mod utils;

pub struct FileSystemAdapter;

impl FileSystemAdapter {
    fn get_file_tree(&self, path: PathBuf) -> Result<Vec<Box<OrchidFileTree>>, OFTError> {
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

                                    if let Ok(children) = self.get_file_tree(new_path) {
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
                    (OrchidFileTree::File { .. }, ..) => Ordering::Less,
                    (OrchidFileTree::OrchidModule { .. }, ..) => Ordering::Less,
                    (OrchidFileTree::Folder { .. }, ..) => Ordering::Less,
                    (.., OrchidFileTree::File { .. }) => Ordering::Greater,
                    (.., OrchidFileTree::OrchidModule { .. }) => Ordering::Greater,
                    (.., OrchidFileTree::Folder { .. }) => Ordering::Greater,
                });

                Ok(oft_vec)
            }
            Err(_) => Err(OFTError::Err),
        }
    }
}

impl FSAControl for FileSystemAdapter {
    fn get_file_tree(&self) -> Result<OrchidFileTree, OFTError> {
        /* First just start off by reading what's in the current directory */

        unimplemented!()
    }
}
