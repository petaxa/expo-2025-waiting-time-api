use anyhow;
use chrono::Local;
use clap::Parser;
use reqwest::Client;
use serde_json::Value;
use std::path::PathBuf;
use tokio::fs::{self, File};
use tokio::io::AsyncWriteExt;

#[derive(Parser)]
#[command(name = "batch-json")]
struct Cli {
    /// Git リポジトリのルート
    target_repo_path: PathBuf,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    let repo = &cli.target_repo_path;
    // ディレクトリとして存在するか？
    if !repo.is_dir() {
        anyhow::bail!("指定したパス {:?} は存在しません", repo);
    }

    let json: Value = Client::new()
        .get("https://script.google.com/macros/s/AKfycbwhVUC7H64Eu2l6Lbw2Z2NUL_SeKg3UuTNA77oIPTae3wNRvtCdxo-zuejLOlUXXU_d/exec?route=all")
        .send()
        .await?
        .json()
        .await?;

    const FILENAME: &str = "waiting-time.json";
    let output_path = repo.join("docs").join(FILENAME);
    if let Some(parent) = output_path.parent() {
        fs::create_dir_all(parent).await?;
    }

    let mut file = File::create(output_path).await?;
    let data = serde_json::to_vec_pretty(&json)?;
    file.write_all(&data).await?;
    drop(file);

    println!(
        "Update {} {}",
        FILENAME,
        Local::now().format("%Y-%m-%d %H:%M:%S %z")
    );

    Ok(())
}
