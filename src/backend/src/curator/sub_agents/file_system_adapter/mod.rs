use crate::curator::sub_agents::file_system_adapter::port::FSAControl;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_config::OrchidConfig;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OFPError, OrchidFilePath, OrchidOpenFiles,
};
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::{
    OFTError, OrchidFileTree, OrchidOpenFolders,
};
use crate::curator::sub_agents::file_system_adapter::utils::clean_file_name::clean_file_name;
use std::cmp::Ordering;
use std::fs;
use std::fs::{File, ReadDir};
use std::path::PathBuf;
use std::{env, io};
use tokio::io::{Error, ErrorKind};

pub const ORCHID_FILE_EXTENSION: &str = ".orch";
pub const ORCHID_CONFIG_FOLDER: &str = ".orch";
pub const ORCHID_CONFIG_FILE: &str = "config.json";

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
                                            open: false,
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

    fn open_config_file(mut base_path: PathBuf) -> io::Result<OrchidConfig> {
        /* Add the path to the config file */
        base_path.push(ORCHID_CONFIG_FOLDER);

        /* This will create the .orch config folder if it doesn't exist
        (This throws an error if it already exists, so we just don't handle the error)*/
        let res = fs::create_dir(base_path.clone());

        base_path.push(ORCHID_CONFIG_FILE);

        let config_raw = File::open(base_path)?;
        let config: OrchidConfig = serde_json::from_reader(config_raw)?;

        Ok(config)
    }

    fn save_config_file(
        mut base_path: PathBuf,
        config: OrchidConfig,
    ) -> Result<(), std::io::Error> {
        /* Add the path to the config file */
        base_path.push(ORCHID_CONFIG_FOLDER);
        base_path.push(ORCHID_CONFIG_FILE);

        let page_file = File::create(base_path)?;
        serde_json::to_writer(page_file, &config)?;

        Ok(())
    }
}

impl FSAControl for FileSystemAdapter {
    fn get_root_file_tree(&self) -> Result<OrchidFileTree, OFTError> {
        /* First just start off by reading what's in the current directory */
        let (current_path, current_dir) = self.get_current_directory()?;

        let mut path_clone = current_path.clone();

        /* Then get the children in this dir */
        let children = self.get_file_tree_from_path(current_path)?;

        /* Assemble the root file tree */
        let mut root = OrchidFileTree::Folder {
            folder_name: current_dir,
            open: false,
            children,
        };

        /* If we're able to properly read the config file,
        apply the open folders object from the file */
        if let Ok(config) = FileSystemAdapter::open_config_file(path_clone) {
            root.apply_open_folders(&config.open_folders);
        }

        Ok(root)
    }

    fn open_file(&self, path: &OrchidFilePath) -> Result<(), OFPError> {
        /* Now the path will contain the current directory,
        so we have to get rid of that*/
        if let OrchidFilePath::Folder { child, .. } | OrchidFilePath::OrchidModule { child, .. } =
            path
        {
            if let Some(child_path) = child {
                let path_buf = child_path.to_path_buf()?;

                return match fs::File::open(path_buf) {
                    Ok(_) => {
                        /*TODO: Actually read the contents of the file,
                        for now we just return unit*/
                        Ok(())
                    }
                    Err(err) => Err(OFPError::Err),
                };
            }
        }

        Err(OFPError::BadPath)
    }

    fn save_open_folders(
        &self,
        open_folders: OrchidOpenFolders,
    ) -> Result<OrchidFileTree, OFTError> {
        /* First just start off by reading what's in the current directory */
        let (current_path, _) = self.get_current_directory()?;

        if let Ok(mut config) = FileSystemAdapter::open_config_file(current_path.clone()) {
            config.open_folders = open_folders;
            FileSystemAdapter::save_config_file(current_path, config);
        } else {
            FileSystemAdapter::save_config_file(
                current_path,
                OrchidConfig {
                    open_folders,
                    open_files: OrchidOpenFiles::new_empty(),
                },
            )?;
        }

        self.get_root_file_tree()
    }

    fn save_open_files(&self, open_files: OrchidOpenFiles) -> Result<OrchidFileTree, OFTError> {
        /* First just start off by reading what's in the current directory */
        let (current_path, _) = self.get_current_directory()?;

        if let Ok(mut config) = FileSystemAdapter::open_config_file(current_path.clone()) {
            config.open_files = open_files;
            FileSystemAdapter::save_config_file(current_path, config);
        } else {
            FileSystemAdapter::save_config_file(
                current_path,
                OrchidConfig {
                    open_folders: OrchidOpenFolders::new_dummy(),
                    open_files,
                },
            )?;
        }

        self.get_root_file_tree()
    }

    fn get_open_files(&self) -> Option<OrchidOpenFiles> {
        let (current_path, _) = self.get_current_directory().ok()?;

        if let Ok(config) = FileSystemAdapter::open_config_file(current_path.clone()) {
            Some(config.open_files)
        } else {
            None
        }
    }
}
