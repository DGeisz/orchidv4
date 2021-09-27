use crate::curator::sub_agents::file_system_adapter::ORCHID_FILE_EXTENSION;

pub fn clean_file_name(file_name: &String) -> String {
    let no_suffix = file_name.trim().trim_end_matches(ORCHID_FILE_EXTENSION);
    let mut clean_name = String::new();

    let mut underscore_count = 0;

    for (i, char) in no_suffix.chars().enumerate() {
        if i == 0 {
            clean_name.push(char.to_ascii_uppercase())
        } else {
            if char == '_' {
                underscore_count += 1;
            } else {
                if underscore_count == 0 {
                    clean_name.push(char);
                } else if underscore_count == 1 {
                    clean_name.push(' ');
                    clean_name.push(char);
                } else {
                    clean_name.push(' ');
                    clean_name.push(char.to_ascii_uppercase());
                }

                underscore_count = 0;
            }
        }
    }

    clean_name
}
