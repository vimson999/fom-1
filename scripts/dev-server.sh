#!/bin/zsh
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
STATE_DIR="$PROJECT_DIR/.local"
PID_FILE="$STATE_DIR/fields-of-mistria-dev.pid"
LOG_FILE="$STATE_DIR/fields-of-mistria-dev.log"

start_server() {
  if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "The local site is already running at http://localhost:3000"
    return
  fi

  mkdir -p "$STATE_DIR"
  rm -f "$PID_FILE"
  cd "$PROJECT_DIR"
  nohup npm run dev > "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"
  echo "Starting the local site. Open http://localhost:3000 in a browser."
  echo "Log: $LOG_FILE"
}

stop_server() {
  if [[ ! -f "$PID_FILE" ]]; then
    echo "No project-managed local site is running."
    return
  fi

  local pid
  pid="$(cat "$PID_FILE")"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid"
    echo "Stopped the project local site."
  fi
  rm -f "$PID_FILE"
}

case "${1:-start}" in
  start) start_server ;;
  stop) stop_server ;;
  restart) stop_server; start_server ;;
  *) echo "Usage: ./scripts/dev-server.sh {start|stop|restart}"; exit 1 ;;
esac
