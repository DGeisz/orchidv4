pub fn tex_text(tex: &str) -> String {
    format!("{{\\text{}}}", tex)
}

pub fn add_tex_color(tex: &str, color: &str) -> String {
    format!("\\colorbox{{{}}}{{\\displaystyle {}}}", color, tex)
}

pub const LATEX_SPACE: &str = "\\;";

/* Palette */
pub const MEDIUM_FOREST_GREEN: &str = "#53b030";
pub const MEDIUM_PINK: &str = "#fb607f";
pub const DEEP_BLUE: &str = "#32afdd";
