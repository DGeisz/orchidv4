use crate::backend_io::ws_io::basic_msgs::ws_commands::WsCommand;
use crate::backend_io::ws_io::basic_msgs::ws_response::{WsError, WsResponse};
use crate::backend_io::ws_io::sub_agents::ws_command_adapter::{WsCommandAdapter, NO_OP_RES};
use crate::curator::port::mock_curator_control;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::{
    OFTError, OrchidFileTree,
};

#[test]
fn test_get_root_oft() {
    /* Mock the curator */
    let mut mock_curator = mock_curator_control();

    let oft = OrchidFileTree::Folder {
        folder_name: "ex".to_string(),
        open: false,
        children: vec![Box::new(OrchidFileTree::File {
            file_name: "ex.orch".to_string(),
            formatted_name: "Ex".to_string(),
        })],
    };

    let oft_clone = oft.clone();

    mock_curator
        .expect_get_root_file_tree()
        .times(1)
        .return_once(|| Ok(oft_clone));

    mock_curator
        .expect_get_root_file_tree()
        .times(1)
        .return_once(|| Err(OFTError::Err));

    /* Create the command adapter */
    let mut ws_command_adapter = WsCommandAdapter::new(Box::new(mock_curator));

    /* The first time we should get back out oft */
    assert_eq!(
        ws_command_adapter.consume_ws_command(WsCommand::GetRootOFT),
        (WsResponse::OFT(oft), false)
    );

    /* The second time we should get back an error */
    assert_eq!(
        ws_command_adapter.consume_ws_command(WsCommand::GetRootOFT),
        NO_OP_RES
    );
}
