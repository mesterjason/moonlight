#!/usr/bin/env python3
"""MoonLight Transcription Bridge - calls faster-whisper and outputs JSON"""

import argparse
import json
import sys
import time
from faster_whisper import WhisperModel


def transcribe(audio_path: str, model_size: str = "base", language: str = "en") -> dict:
    model = WhisperModel(model_size, device="cpu", compute_type="int8")

    segments, info = model.transcribe(
        audio_path,
        language=language,
        beam_size=5,
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=500),
    )

    result = {
        "language": info.language,
        "duration": info.duration,
        "segments": [],
    }

    for seg in segments:
        result["segments"].append({
            "index": seg.id,
            "start": round(seg.start, 3),
            "end": round(seg.end, 3),
            "text": seg.text.strip(),
            "confidence": round(seg.avg_logprob, 4)
            if hasattr(seg, "avg_logprob")
            else 0.0,
        })

    return result


def main():
    parser = argparse.ArgumentParser(description="MoonLight Transcription")
    parser.add_argument("audio_path", help="Path to audio file")
    parser.add_argument(
        "--model",
        default="base",
        choices=["tiny", "base", "small", "medium"],
        help="Whisper model size",
    )
    parser.add_argument("--language", default="en", help="Language code")
    parser.add_argument("--timing", action="store_true", help="Print timing info")

    args = parser.parse_args()

    start = time.time()
    result = transcribe(args.audio_path, args.model, args.language)
    elapsed = time.time() - start

    if args.timing:
        print(f"Transcription took {elapsed:.2f}s for {result['duration']:.2f}s of audio",
              file=sys.stderr)
        print(f"Real-time factor: {elapsed / max(result['duration'], 0.1):.2f}x",
              file=sys.stderr)

    print(json.dumps(result))


if __name__ == "__main__":
    main()
