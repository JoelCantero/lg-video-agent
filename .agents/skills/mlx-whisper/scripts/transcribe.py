import argparse
import json
import math
import platform
import shutil
import warnings
from pathlib import Path


def make_captions(result):
    words = []
    previous_start = -1
    for segment in result.get("segments", []):
        for word in segment.get("words", []):
            text = word.get("word")
            start = word.get("start")
            end = word.get("end")
            if not isinstance(text, str) or not text.strip():
                raise ValueError("Word text is missing or empty.")
            if any(
                isinstance(value, bool)
                or not isinstance(value, (int, float))
                or not math.isfinite(value)
                for value in (start, end)
            ):
                raise ValueError("Word timestamps must be finite numbers.")
            if start < 0 or end < start or start < previous_start:
                raise ValueError("Word timestamps are invalid or out of order.")
            if end == start:
                warnings.warn(
                    f"Zero-duration word at {start}s: {text!r}; review alignment.",
                    stacklevel=2,
                )
            words.append({"text": text, "start": start, "end": end})
            previous_start = start
        if segment.get("text", "").strip() and not segment.get("words"):
            raise ValueError("A speech segment has no word timestamps.")
    if not words:
        raise ValueError("No words with timestamps found; review the audio.")
    return {
        "language": result.get("language"),
        "timeUnit": "seconds",
        "text": result.get("text", ""),
        "words": words,
    }


def main():
    parser = argparse.ArgumentParser(description="Local word-level narration captions.")
    parser.add_argument("audio", type=Path)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--language", default="ca")
    parser.add_argument("--model", default="mlx-community/whisper-large-v3-turbo")
    args = parser.parse_args()
    if platform.system() != "Darwin" or platform.machine() != "arm64":
        parser.error("Use native arm64 Python on macOS with Apple Silicon.")
    if not shutil.which("ffmpeg"):
        parser.error("ffmpeg is required on PATH. See README.md.")
    if not args.audio.is_file():
        parser.error(f"Audio file not found: {args.audio}")
    outputs = [args.output_dir / name for name in ("transcription.json", "captions.json")]
    if any(output.exists() for output in outputs):
        parser.error("Output already exists; choose a new --output-dir to preserve it.")
    try:
        import mlx_whisper
    except ImportError:
        parser.error("Install mlx-whisper in the Python environment. See README.md.")
    result = mlx_whisper.transcribe(
        str(args.audio.resolve()),
        path_or_hf_repo=args.model,
        language=None if args.language == "auto" else args.language,
        task="transcribe",
        word_timestamps=True,
        verbose=False,
    )
    captions = make_captions(result)
    serialized = [
        json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n"
        for value in (result, captions)
    ]
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for output, content in zip(outputs, serialized):
        output.write_text(content, encoding="utf-8")
        print(output)


if __name__ == "__main__":
    main()