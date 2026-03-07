#[cfg(target_os = "windows")]
const GIT_BASH_ARGS: &[&str] = &["-l", "-i"];

#[cfg(target_os = "windows")]
const GIT_BASH_CANDIDATES: &[&str] = &[
    r"C:\PROGRA~1\Git\bin\bash.exe",
    r"C:\PROGRA~2\Git\bin\bash.exe",
    r"C:\Program Files\Git\bin\bash.exe",
    r"C:\Program Files (x86)\Git\bin\bash.exe",
];

#[tauri::command]
fn resolve_windows_shell(cols: u16, rows: u16) -> Result<(String, Vec<String>), String> {
    use portable_pty::{native_pty_system, CommandBuilder, PtySize};
    let c = cols.max(2).min(65535);
    let r = rows.max(1).min(65535);
    let pty_system = native_pty_system();
    for file in GIT_BASH_CANDIDATES {
        let pair = pty_system
            .openpty(PtySize {
                rows: r,
                cols: c,
                pixel_width: 0,
                pixel_height: 0,
            })
            .map_err(|e| e.to_string())?;
        let mut cmd = CommandBuilder::new(*file);
        cmd.args(GIT_BASH_ARGS.iter().copied());
        if let Ok(mut child) = pair.slave.spawn_command(cmd) {
            let _ = child.kill();
            return Ok((
                file.to_string(),
                GIT_BASH_ARGS.iter().map(|s| s.to_string()).collect(),
            ));
        }
    }
    Ok(("powershell.exe".to_string(), vec![]))
}

#[cfg(not(target_os = "windows"))]
#[tauri::command]
fn resolve_windows_shell(_cols: u16, _rows: u16) -> Result<(String, Vec<String>), String> {
    Err("resolve_windows_shell is only available on Windows".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_pty::init())
    .invoke_handler(tauri::generate_handler![resolve_windows_shell])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
