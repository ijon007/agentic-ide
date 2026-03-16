#[tauri::command]
fn resolve_windows_shell(cols: u16, rows: u16) -> Result<(String, Vec<String>), String> {
    let _c = cols.max(2).min(65535);
    let _r = rows.max(1).min(65535);
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
