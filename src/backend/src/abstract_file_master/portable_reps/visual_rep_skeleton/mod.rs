use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::OrchidFilePath;
use serde::{Deserialize, Serialize};

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct VisualRepSkeleton {
    file_id: String,
    file_name: String,
    formatted_name: String,
    file_path: OrchidFilePath,
}

impl VisualRepSkeleton {
    pub fn new(
        file_id: String,
        file_name: String,
        formatted_name: String,
        file_path: OrchidFilePath,
    ) -> VisualRepSkeleton {
        VisualRepSkeleton {
            file_name,
            file_id,
            formatted_name,
            file_path,
        }
    }
}
