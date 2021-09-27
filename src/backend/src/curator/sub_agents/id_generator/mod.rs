use crate::curator::sub_agents::id_generator::port::IdGenControl;
use std::rc::Rc;
use uuid::Uuid;

pub mod port;

pub struct IdGenerator;

impl IdGenerator {
    pub fn new() -> Rc<Box<dyn IdGenControl>> {
        Rc::new(Box::new(IdGenerator))
    }
}

impl IdGenControl for IdGenerator {
    fn gen_id(&self) -> String {
        Uuid::new_v4().to_hyphenated().to_string()
    }
}
