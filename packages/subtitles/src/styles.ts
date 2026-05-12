export interface SubtitleStyle {
  fontName: string;
  fontSize: number;
  primaryColor: string;
  secondaryColor: string;
  outlineColor: string;
  backColor: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  borderStyle: number;
  outlineWidth: number;
  shadowDepth: number;
  alignment: number;
  marginV: number;
}

export const SUBTITLE_STYLES: Record<string, SubtitleStyle> = {
  neon: {
    fontName: 'Arial',
    fontSize: 28,
    primaryColor: '&H00FFFFFF',
    secondaryColor: '&H000000FF',
    outlineColor: '&H00FF00FF',
    backColor: '&H80000000',
    bold: true,
    italic: false,
    underline: false,
    borderStyle: 1,
    outlineWidth: 3,
    shadowDepth: 2,
    alignment: 2,
    marginV: 60,
  },
  classic: {
    fontName: 'Arial',
    fontSize: 24,
    primaryColor: '&H00FFFFFF',
    secondaryColor: '&H000000FF',
    outlineColor: '&H00000000',
    backColor: '&H80000000',
    bold: false,
    italic: false,
    underline: false,
    borderStyle: 1,
    outlineWidth: 2,
    shadowDepth: 1,
    alignment: 2,
    marginV: 40,
  },
  minimal: {
    fontName: 'Arial',
    fontSize: 20,
    primaryColor: '&H00FFFFFF',
    secondaryColor: '&H00000000',
    outlineColor: '&H00000000',
    backColor: '&H00000000',
    bold: false,
    italic: false,
    underline: false,
    borderStyle: 3,
    outlineWidth: 1,
    shadowDepth: 0,
    alignment: 2,
    marginV: 30,
  },
};
