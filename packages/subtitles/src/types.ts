export interface SubtitleTrack {
  segments: SubtitleSegment[];
}

export interface SubtitleSegment {
  index: number;
  start: number;
  end: number;
  text: string;
}
