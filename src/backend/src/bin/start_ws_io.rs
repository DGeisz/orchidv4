use backend::abstract_file_master::generator::AFMGenerator;
use backend::backend_io::ws_io::sub_agents::ws_command_parser::port::WsCommandParserPort;
use backend::backend_io::ws_io::WsIo;
use backend::curator::sub_agents::file_system_adapter::FileSystemAdapter;
use backend::curator::sub_agents::id_generator::IdGenerator;
use backend::curator::Curator;
use backend::kernel::Kernel;
use backend::parser::Parser;

/* First create a function that assembles the backend
   and returns a message port to be used by WsIo
*/
fn assemble_backend() -> Box<dyn WsCommandParserPort> {
    /* Create an id generator */
    let id_gen = IdGenerator::new();
    /* Create the parser */
    let parser = Parser::new();
    /* Create the kernel */
    let kernel = Kernel::new();
    /* Create the afm generator */
    let afm_generator = AFMGenerator::new(id_gen);
    /* Create the file system adapter */
    let fsa = FileSystemAdapter::new();
    /* Put that all together into the curator */
    let curator = Curator::new(afm_generator, fsa, parser, kernel);

    WsIo::gen_consumption_port(curator)
}

#[tokio::main]
async fn main() {
    env_logger::init();

    WsIo::run_ws_io("127.0.0.1:7200", assemble_backend).await;
}
