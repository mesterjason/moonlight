import { SUBTITLE_STYLES, type SubtitleStyle } from './styles';
import type { SubtitleSegment } from './types';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const ms = Math.floor((s % 1) * 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(Math.floor(s)).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

export function generateSRT(segments: SubtitleSegment[]): string {
  return segments
    .map((seg, i) => {
      const start = formatTime(seg.start);
      const end = formatTime(seg.end);
      return `${i + 1}\n${start} --> ${end}\n${seg.text}\n`;
    })
    .join('\n');
}

export function generateASS(
  segments: SubtitleSegment[],
  styleName: string = 'neon',
): string {
  const style: SubtitleStyle = SUBTITLE_STYLES[styleName] || SUBTITLE_STYLES.neon;

  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${style.fontName},${style.fontSize},${style.primaryColor},${style.secondaryColor},${style.outlineColor},${style.backColor},${style.bold ? -1 : 0},${style.italic ? -1 : 0},${style.underline ? -1 : 0},0,100,100,0,0,${style.borderStyle},${style.outlineWidth},${style.shadowDepth},${style.alignment},10,10,${style.marginV},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const events = segments
    .map((seg) => {
      const start = formatTime(seg.start).replace(',', '.');
      const end = formatTime(seg.end).replace(',', '.');
      return `Dialogue: 0,${start},${end},Default,,0,0,0,,${seg.text}`;
    })
    .join('\n');

  return header + events;
}
