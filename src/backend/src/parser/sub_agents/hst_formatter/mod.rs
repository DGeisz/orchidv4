use crate::abstract_file_master::dyn_subjects::hybrid_syntax_tree::{
    HSTContainer, HSTLine, HSTStructureSocket,
};

pub struct HSTFormatter;

impl HSTFormatter {
    pub fn format_module_container(container: &mut HSTContainer) {
        container.indented = false;
        container.left_border = false;
    }

    pub fn format_filled_module_socket(socket: &mut HSTStructureSocket) {
        socket.left_input = None;
        socket.right_input = None;
    }

    pub fn format_module_child_container(container: &mut HSTContainer) {
        container.indented = false;
        container.left_border = false;
    }
}
