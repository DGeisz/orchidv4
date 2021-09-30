use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OrchidFileLink, OrchidFilePath,
};

#[test]
fn test_to_path_string() {
    /* First create a path that we want
    to convert into a string*/
    let path = OrchidFilePath::Folder {
        folder_name: "bee".to_string(),
        child: Some(Box::new(OrchidFilePath::OrchidModule {
            folder_name: "doa".to_string(),
            formatted_name: "Doa".to_string(),
            child: None,
        })),
    };

    assert_eq!(path.to_path_string(), "./bee/doa/".to_string());

    /* Now let's create a path with a file attached */
    let path = OrchidFilePath::OrchidModule {
        folder_name: "zor".to_string(),
        formatted_name: "Zor".to_string(),
        child: Some(Box::new(OrchidFilePath::Folder {
            folder_name: "tang".to_string(),
            child: Some(Box::new(OrchidFilePath::File(OrchidFileLink::new(
                "beck.orch".to_string(),
                "Beck".to_string(),
            )))),
        })),
    };

    assert_eq!(path.to_path_string(), "./zor/tang/beck.orch");
}
