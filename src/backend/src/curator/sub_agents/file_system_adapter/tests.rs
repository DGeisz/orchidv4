use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::OrchidFileTree;
use crate::curator::sub_agents::file_system_adapter::FileSystemAdapter;
use std::panic::panic_any;

/* Helper function that checks a child file for a
given name and formatted name */
fn check_oft_file(
    file: &Box<OrchidFileTree>,
    asserted_file_name: String,
    asserted_formatted_name: String,
) {
    if let OrchidFileTree::File {
        file_name,
        formatted_name,
    } = &**file
    {
        assert_eq!(file_name, &asserted_file_name);
        assert_eq!(formatted_name, &asserted_formatted_name);
    } else {
        panic!("Provided file isn't a file")
    }
}

/// This test is assumed to be run using "cargo test",
/// meaning, from the top level of the this cargo project.
#[test]
fn test_get_file_tree() {
    let fsa = FileSystemAdapter::new();

    let file_tree = fsa.get_file_tree().unwrap();

    if let OrchidFileTree::Folder {
        folder_name,
        children,
    } = file_tree
    {
        /* Find `examples` folder */
        let examples_folder = children
            .iter()
            .find(|child| match &***child {
                OrchidFileTree::Folder { folder_name, .. } => folder_name == "examples",
                _ => false,
            })
            .unwrap();

        let asserted_tree = Box::new(OrchidFileTree::Folder {
            folder_name: "examples".to_string(),
            children: vec![
                Box::new(OrchidFileTree::Folder {
                    folder_name: "ex_folder".to_string(),
                    children: vec![
                        Box::new(OrchidFileTree::File {
                            file_name: "ex__orch1.orch".to_string(),
                            formatted_name: "Ex Orch1".to_string(),
                        }),
                        Box::new(OrchidFileTree::File {
                            file_name: "ex__orch2.orch".to_string(),
                            formatted_name: "Ex Orch2".to_string(),
                        }),
                    ],
                }),
                Box::new(OrchidFileTree::File {
                    file_name: "nat_num_ex.orch".to_string(),
                    formatted_name: "Nat num ex".to_string(),
                }),
                Box::new(OrchidFileTree::File {
                    file_name: "real_num_ex.orch".to_string(),
                    formatted_name: "Real num ex".to_string(),
                }),
            ],
        });

        assert_eq!(&asserted_tree, examples_folder);

        /* This next part is redundant, but I already wrote it so whatever */
        if let OrchidFileTree::Folder { children, .. } = &**examples_folder {
            /* First child should be `ex_folder` */
            let ex_folder = children.get(0).unwrap();

            if let OrchidFileTree::Folder {
                children,
                folder_name,
            } = &**ex_folder
            {
                assert_eq!(folder_name, "ex_folder");

                /* Check children are in correct order*/
                check_oft_file(
                    children.get(0).unwrap(),
                    "ex__orch1.orch".to_string(),
                    "Ex Orch1".to_string(),
                );

                check_oft_file(
                    children.get(0).unwrap(),
                    "ex__orch1.orch".to_string(),
                    "Ex Orch1".to_string(),
                );
            }
        } else {
            panic!("examples folder should be a folder")
        }
    } else {
        panic!("Get file tree should return a folder at the top!")
    }
}
