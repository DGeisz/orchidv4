use crate::abstract_file_master::portable_reps::visual_rep_skeleton::VisualRepSkeleton;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::OrchidFilePath;

pub trait AFMControl {
    fn get_id(&self) -> &String;
    fn get_file_path(&self) -> &OrchidFilePath;
    fn get_visual_rep_skeleton(&self) -> VisualRepSkeleton;
}
