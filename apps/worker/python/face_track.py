#!/usr/bin/env python3
"""MoonLight Face Tracking - uses MediaPipe to detect faces and return crop regions"""

import argparse
import json
import sys
import cv2
import mediapipe as mp
import numpy as np


def detect_faces_in_video(video_path: str, sample_rate: float = 1.0) -> list:
    mp_face = mp.solutions.face_detection
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise RuntimeError(f"Cannot open video: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    results = []

    with mp_face.FaceDetection(model_selection=1, min_detection_confidence=0.5) as face_detection:
        frame_idx = 0
        sample_interval = max(1, int(fps * sample_rate))

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            if frame_idx % sample_interval == 0:
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                detections = face_detection.process(rgb)

                if detections.detections:
                    for det in detections.detections:
                        bbox = det.location_data.relative_bounding_box
                        x = bbox.xmin * width
                        y = bbox.ymin * height
                        w = bbox.width * width
                        h = bbox.height * height

                        results.append({
                            "frame": frame_idx,
                            "time": round(frame_idx / fps, 3),
                            "face": {
                                "x": round(x, 1),
                                "y": round(y, 1),
                                "width": round(w, 1),
                                "height": round(h, 1),
                                "center_x": round(x + w / 2, 1),
                                "center_y": round(y + h / 2, 1),
                            },
                            "confidence": round(det.score[0], 4),
                        })

            frame_idx += 1

    cap.release()

    return {
        "video_width": width,
        "video_height": height,
        "fps": fps,
        "total_frames": total_frames,
        "faces": results,
    }


def main():
    parser = argparse.ArgumentParser(description="MoonLight Face Tracking")
    parser.add_argument("video_path", help="Path to video file")
    parser.add_argument("--sample-rate", type=float, default=1.0,
                        help="Sample rate in seconds between detections")
    args = parser.parse_args()

    result = detect_faces_in_video(args.video_path, args.sample_rate)
    print(json.dumps(result))


if __name__ == "__main__":
    main()
