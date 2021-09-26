use std::env;

fn main() {
    if let Ok(file) = env::current_dir() {
        println!("Current wd {}", file.display());

        if let Some(l_file) = file.iter().last() {
            println!("Last file: {:?}", l_file.to_str());
        }
    }
}
