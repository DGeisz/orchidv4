//! ws_io is an IA that uses websocket connections to interface
//! with the orchid backend

use crate::backend_io::ws_io::ws_command_adapter::WsCommandAdapter;
use crate::backend_io::ws_io::ws_command_parser::ws_message_consumer::WsMessageConsumer;
use crate::backend_io::ws_io::ws_command_parser::WsCommandParser;
use crate::backend_io::ws_io::ws_server::run_server;
use crate::curator::curator_control::CuratorControl;
use crate::curator::Curator;
use crate::utils::id_generator::UuidGenerator;

pub mod b_msgs;
pub mod sub_ias;

/// Empty struct acting as the IA
pub struct WsIo;

impl WsIo {
    pub async fn run_ws_io(addr: &'static str, curator: Box<dyn CuratorControl>) {}
}

/* TODO: Fix kernel assembler */
fn assemble_kernel_with_ws_msg_consumer() -> Box<dyn WsMessageConsumer> {
    // let page_generator = PageGenerator::new(UuidGenerator::new());
    let curator = Curator::new(page_generator);
    // let ws_command_adapter = WsCommandAdapter::new(curator);
    //
    // WsCommandParser::new(ws_command_adapter)
    unimplemented!()
}

/// Runs a ws io interface with all the pieces properly
/// assembled to run the full kernel
pub async fn run_ws_io(addr: &'static str) {
    /*
    Basically run the ws server with all the proper parts of
    ws_io put together
    */
    run_server(addr, assemble_kernel_with_ws_msg_consumer).await;
}
