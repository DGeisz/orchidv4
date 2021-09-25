use crate::curator::curator_control::CuratorControl;
use crate::utils::id_generator::IdGenControl;
use std::collections::HashMap;

pub mod curator_control;

#[cfg(test)]
mod tests;

pub struct Curator {}

impl Curator {}

impl CuratorControl for Curator {
    fn get_directory_info(&self) {
        unimplemented!()
    }
}
