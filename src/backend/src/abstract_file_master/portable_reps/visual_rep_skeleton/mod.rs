use serde::{Deserialize, Serialize};

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct VisualRepSkeleton {
    file_id: String,
    file_name: String,
    formatted_name: String,
}

impl VisualRepSkeleton {
    pub fn new(file_id: String, file_name: String, formatted_name: String) -> VisualRepSkeleton {
        VisualRepSkeleton {
            file_name,
            file_id,
            formatted_name,
        }
    }
}
