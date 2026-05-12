'use client';

import { motion } from 'framer-motion';
import {
  Sparkles, MessageSquareText, Video, Zap, ScanFace, Captions,
  Scale, Download, Wand2, Headphones, Gauge, Share2,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';

const features = [
  { icon: MessageSquareText, title: 'Speech-to-Text', description: 'Accurate transcription using faster-whisper AI' },
  { icon: Sparkles, title: 'Viral Detection', description: 'AI scores moments by virality potential' },
  { icon: Zap, title: 'Smart Clipping', description: 'Auto-extract the best 15-60s segments' },
  { icon: Captions, title: 'Auto Captions', description: 'Styled subtitles with emoji support' },
  { icon: ScanFace, title: 'Face Tracking', description: 'Smart face detection for dynamic framing' },
  { icon: Scale, title: '9:16 Reframe', description: 'Auto-crop to vertical for TikTok/Shorts' },
  { icon: Video, title: 'Dynamic Zoom', description: 'Speech-driven zoom effects' },
  { icon: Wand2, title: 'AI Hooks', description: 'Auto-generate attention-grabbing hooks' },
  { icon: Headphones, title: 'Podcast Ready', description: 'Optimized for podcast & stream clips' },
  { icon: Gauge, title: 'Silence Removal', description: 'Auto-skip pauses and dead air' },
  { icon: Download, title: 'Bulk Export', description: 'Download multiple clips at once' },
  { icon: Share2, title: 'Platform Ready', description: 'TikTok, Shorts & Reels optimized' },
];

export function Features() {
  return (
    <section className="relative py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            12 AI-powered features to turn any long video into viral short-form content
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover className="p-6">
                <div className="w-10 h-10 rounded-lg bg-moonlight-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-moonlight-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-white/40">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
