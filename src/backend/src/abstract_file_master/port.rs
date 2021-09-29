use crate::abstract_file_master::portable_reps::visual_rep_skeleton::VisualRepSkeleton;

pub trait AFMControl {
    fn get_id(&self) -> &String;
    fn get_visual_rep_skeleton(&self) -> VisualRepSkeleton;
}
