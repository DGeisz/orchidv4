//! ws_io is an IA that uses websocket connections to interface
//! with the orchid backend

use crate::backend_io::ws_io::sub_ias::ws_command_adapter::WsCommandAdapter;
use crate::backend_io::ws_io::sub_ias::ws_command_parser::port::WsCommandParserPort;
use crate::backend_io::ws_io::sub_ias::ws_command_parser::WsCommandParser;
use crate::backend_io::ws_io::sub_ias::ws_server::WsServer;
use crate::curator::port::CuratorControl;
use crate::curator::Curator;

pub mod b_msgs;
pub mod sub_ias;

/// Empty struct acting as the IA
pub struct WsIo;

impl WsIo {
    pub fn gen_consumption_port(curator: Box<dyn CuratorControl>) -> Box<dyn WsCommandParserPort> {
        let ws_command_adapter = WsCommandAdapter::new(curator);

        WsCommandParser::new(ws_command_adapter)
    }

    pub async fn run_ws_io(
        addr: &'static str,
        generate_consumption_port: fn() -> Box<dyn WsCommandParserPort>,
    ) {
        WsServer::run_server(addr, generate_consumption_port).await
    }
}
