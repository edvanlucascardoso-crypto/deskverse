#!/usr/bin/env bash
# Installs this skill into Claude Code by symlinking it into your skills folder.
# Re-running reinstalls cleanly. Set CLAUDE_SKILLS_DIR to install elsewhere.
set -euo pipefail

SKILL_NAME="$(basename "$(cd "$(dirname "$0")" && pwd)")"
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"

mkdir -p "$SKILLS_DIR"
rm -rf "$SKILLS_DIR/$SKILL_NAME"
ln -s "$REPO_DIR" "$SKILLS_DIR/$SKILL_NAME"

echo "✓ installed: $SKILLS_DIR/$SKILL_NAME -> $REPO_DIR"
echo "  it will stay updated with 'git pull'. re-run ./install.sh any time to repair."
