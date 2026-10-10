#!/usr/bin/env bash
set -euo pipefail

api_base_url="${API_BASE_URL:-http://127.0.0.1:4010}"
web_base_url="${WEB_BASE_URL:-http://127.0.0.1:5173}"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

assert_status() {
  local expected="$1"
  local url="$2"
  local actual
  actual="$(curl --silent --show-error --output "$tmp_dir/body" --write-out '%{http_code}' "$url")"
  if [[ "$actual" != "$expected" ]]; then
    echo "FAIL: $url returned $actual (expected $expected)" >&2
    exit 1
  fi
  echo "PASS: $url -> $actual"
}

assert_status 200 "$api_base_url/"
assert_status 401 "$api_base_url/device"
assert_status 200 "$web_base_url/"

if ! curl --silent --show-error "$web_base_url/" | grep -q 'TezkorSMS'; then
  echo "FAIL: web entrypoint does not contain TezkorSMS branding" >&2
  exit 1
fi

echo "PASS: TezkorSMS web branding"
echo "Smoke test completed successfully."
