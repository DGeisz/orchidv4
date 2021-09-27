use backend::abstract_file_master::generator::AFMGenerator;
use backend::backend_io::ws_io::sub_agents::ws_command_parser::port::WsCommandParserPort;
use backend::backend_io::ws_io::WsIo;
use backend::curator::Curator;

/* First create a function that assembles the backend
   and returns a message port to be used by WsIo
*/
fn assemble_backend() -> Box<dyn WsCommandParserPort> {
    let afm_generator = AFMGenerator::new();
    let curator = Curator::new(afm_generator);

    WsIo::gen_consumption_port(curator)
}

#[tokio::main]
async fn main() {
    env_logger::init();

    WsIo::run_ws_io("127.0.0.1:7200", assemble_backend).await;
}
