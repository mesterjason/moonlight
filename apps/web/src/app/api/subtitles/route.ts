import { NextRequest, NextResponse } from 'next/server';
import { generateSRT, generateASS } from '@moonlight/subtitles';

interface SubSegment {
  index: number;
  start: number;
  end: number;
  text: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { segments, format = 'srt', style = 'neon' } = body;

    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      return NextResponse.json({ error: 'No segments provided' }, { status: 400 });
    }

    const typedSegments: SubSegment[] = segments.map((s: SubSegment) => ({
      index: s.index,
      start: s.start,
      end: s.end,
      text: s.text,
    }));

    let content: string;
    let mimeType: string;

    if (format === 'ass') {
      content = generateASS(typedSegments, style);
      mimeType = 'text/plain';
    } else {
      content = generateSRT(typedSegments);
      mimeType = 'text/plain';
    }

    return NextResponse.json({ content, format, mimeType });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Subtitle generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
