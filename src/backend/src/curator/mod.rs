use crate::abstract_file_master::generator::port::AFMGeneratorControl;
use crate::abstract_file_master::port::AFMControl;
use crate::abstract_file_master::portable_reps::visual_rep_skeleton::VisualRepSkeleton;
use crate::curator::port::CuratorControl;
use crate::curator::sub_agents::file_system_adapter::port::FSAControl;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OFPError, OrchidFilePath,
};
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::{
    OFTError, OrchidFileTree,
};
use crate::kernel::port::KernelControl;
use crate::parser::port::ParserControl;
use std::collections::HashMap;

pub mod port;
pub mod sub_agents;

#[cfg(test)]
mod tests;

pub struct Curator {
    /// HashMap of all open Abstract File Masters
    abstract_file_masters: HashMap<String, Box<dyn AFMControl>>,
    /// AFM Generator
    afm_generator: Box<dyn AFMGeneratorControl>,
    file_system_adapter: Box<dyn FSAControl>,
    parser: Box<dyn ParserControl>,
    kernel: Box<dyn KernelControl>,
}

impl Curator {
    pub fn new(
        afm_generator: Box<dyn AFMGeneratorControl>,
        file_system_adapter: Box<dyn FSAControl>,
        parser: Box<dyn ParserControl>,
        kernel: Box<dyn KernelControl>,
    ) -> Box<dyn CuratorControl> {
        Box::new(Curator {
            afm_generator,
            abstract_file_masters: HashMap::new(),
            file_system_adapter,
            parser,
            kernel,
        })
    }

    /// This is the all-powerful method that
    /// provides a top level description of how
    /// all the subsequent systems interact
    ///
    /// We start out by assuming the the curator selected an
    /// afm and that the afm just made a change to its hst.
    /// Now we use the parser and the kernel to parse and
    /// check any changes that occurred within the hst
    pub fn process_file_change(&mut self, afm: &mut Box<dyn AFMControl>) {
        /* First get the hst */
        let hst = afm.get_hybrid_syntax_tree();

        /* Now we're going to parse the hst, which also
        attempts to parse any string socket inputs into
        hst structures */
        let prt = self.parser.parse_hybrid_syntax_tree(hst);

        /* Now that we have the parsed rep tree,
        we simply have to type check it, so we invoke the
        kernel, and grab the diagnostics from the kernel*/
        let diagnostics = self.kernel.check_parsed_rep_tree(prt);

        /* Finally we let the afm process the diagnostics from the kernel
        to make any check edits to the hst*/
        afm.process_kernel_diagnostics(diagnostics);
    }
}

impl CuratorControl for Curator {
    fn get_root_file_tree(&self) -> Result<OrchidFileTree, OFTError> {
        self.file_system_adapter.get_root_file_tree()
    }

    /*TODO: Fix the implementation of this method.
       Right now we don't hydrate the return from fsa
       into an afm, instead we just create a new afm
    */
    fn open_file(&mut self, path: OrchidFilePath) -> Result<VisualRepSkeleton, OFPError> {
        /* First see if this path is already open in the kernel */
        for (_, afm) in &self.abstract_file_masters {
            if &path == afm.get_file_path() {
                /* If they are equal, just shoot off an
                visual rep for the file*/
                return Ok(afm.get_visual_rep_skeleton());
            }
        }

        /* First use the FSA to open the file at that path */
        let file = self.file_system_adapter.open_file(&path)?;

        /* TODO: Change this.  Right now we just initialize a new
          Abstract file master with this path
        */
        let new_afm = self.afm_generator.get_new_afm_at_path(path)?;

        /* Get the vrs before we lose ownership */
        let visual_rep_skeleton = new_afm.get_visual_rep_skeleton();

        /* Add the afm to map of afms */
        self.abstract_file_masters
            .insert(new_afm.get_id().clone(), new_afm);

        /* Return vrs */
        Ok(visual_rep_skeleton)
    }
}
