use backend::abstract_file_master::generator::AFMGenerator;
use backend::backend_io::ws_io::sub_agents::ws_command_parser::port::WsCommandParserPort;
use backend::backend_io::ws_io::WsIo;
use backend::curator::sub_agents::file_system_adapter::FileSystemAdapter;
use backend::curator::sub_agents::id_generator::IdGenerator;
use backend::curator::Curator;

/* First create a function that assembles the backend
   and returns a message port to be used by WsIo
*/
fn assemble_backend() -> Box<dyn WsCommandParserPort> {
    /* Create the afm generator */
    let afm_generator = AFMGenerator::new();
    /* Create the file system adapter */
    let fsa = FileSystemAdapter::new();
    /* Create an id generator */
    let id_gen = IdGenerator::new();
    /* Put that all together into the curator */
    let curator = Curator::new(id_gen, afm_generator, fsa);

    WsIo::gen_consumption_port(curator)
}

#[tokio::main]
async fn main() {
    env_logger::init();

    WsIo::run_ws_io("127.0.0.1:7200", assemble_backend).await;
}
