use anyhow::{Context, Result};
use chrono::Local;
use clap::Parser;
use reqwest::Client;
use serde_json::Value;
use std::path::Path;
use std::path::PathBuf;
use std::process::Command;
use tokio::fs::{self, File};
use tokio::io::AsyncWriteExt;

#[derive(Parser)]
struct Cli {
    /// Git リポジトリのルート
    target_repo_path: PathBuf,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    let git_repo = &cli.target_repo_path;
    // ディレクトリとして存在するか？
    if !git_repo.is_dir() {
        anyhow::bail!("指定したパス {:?} は存在しません", git_repo);
    }

    // .git があるか？
    if !git_repo.join(".git").is_dir() {
        anyhow::bail!(
            "{:?} は Git リポジトリではありません（.git がありません）",
            git_repo
        );
    }

    let json: Value = Client::new()
        .get("https://script.google.com/macros/s/AKfycbwhVUC7H64Eu2l6Lbw2Z2NUL_SeKg3UuTNA77oIPTae3wNRvtCdxo-zuejLOlUXXU_d/exec?route=all")
        .send()
        .await?
        .json()
        .await?;

    let output_path = git_repo.join("docs").join("output.json");
    if let Some(parent) = output_path.parent() {
        fs::create_dir_all(parent).await?;
    }

    let mut file = File::create(output_path).await?;
    let data = serde_json::to_vec_pretty(&json)?;
    file.write_all(&data).await?;

    run_git(&git_repo, &["add", "docs/waiting-time.json"]).await?;

    let status = run_git(&git_repo, &["status", "--porcelain"]).await?;
    if status.is_empty() {
        println!("コミットもプッシュもスキップします");
        return Ok(());
    }

    let msg = format!(
        "Update waiting-time.json {}",
        Local::now().format("%Y-%m-%d %H:%M:%S %z")
    );
    run_git(&git_repo, &["commit", "-m", &msg]).await?;

    let branch = run_git(&git_repo, &["rev-parse", "--abbrev-ref", "HEAD"]).await?;

    run_git(&git_repo, &["push", "origin", &branch]).await?;

    Ok(())
}

async fn run_git(repo: &Path, args: &[&str]) -> Result<String> {
    let output = Command::new("git")
        .args(args)
        .current_dir(repo) // 実行ディレクトリを指定
        .output()
        .with_context(|| format!("git {:?} の実行に失敗", args))?;

    if !output.status.success() {
        anyhow::bail!(
            "git {:?} がエラー終了: {}",
            args,
            String::from_utf8_lossy(&output.stderr)
        );
    }

    Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
}
