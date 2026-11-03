"""Print a JSON list of source or built website files for authenticated upload tools."""

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def export_deployment():
    output = ROOT / "dist"
    files = list(output.rglob("*"))
    files = [p for p in files if p.is_file()]
    files.append(ROOT / "vercel.json")
    return [
        {
            "file": p.relative_to(output).as_posix() if p.is_relative_to(output) else p.name,
            "data": p.read_text(encoding="utf-8"),
            "encoding": "utf-8",
        }
        for p in files
    ]


def export_source():
    allowed_extensions = {".json", ".js", ".ts", ".tsx", ".css", ".html", ".svg", ".md", ".mjs", ".txt", ".py"}
    excluded_parts = {"node_modules", "dist", ".git", ".vercel", ".cache", ".vite", "coverage"}
    result = []
    for p in ROOT.rglob("*"):
        if not p.is_file() or any(part in excluded_parts for part in p.relative_to(ROOT).parts):
            continue
        if p.suffix in allowed_extensions or p.name in {".gitignore", ".gitkeep"}:
            if p.name == "tsconfig.tsbuildinfo":
                continue
            result.append({"file": (Path(ROOT.name) / p.relative_to(ROOT)).as_posix(), "content": p.read_text(encoding="utf-8")})
    return result


if __name__ == "__main__":
    output = export_source() if len(sys.argv) > 1 and sys.argv[1] == "source" else export_deployment()
    payload = json.dumps(output, ensure_ascii=True, separators=(",", ":"))
    if len(sys.argv) > 2 and sys.argv[2] == "length":
        print(len(payload))
    elif len(sys.argv) > 4 and sys.argv[2] in {"chunk", "chunk-safe"}:
        start = int(sys.argv[3])
        size = int(sys.argv[4])
        chunk = payload[start:start + size]
        print(chunk + ("__CHUNK_END__" if sys.argv[2] == "chunk-safe" else ""))
    else:
        print(payload)
