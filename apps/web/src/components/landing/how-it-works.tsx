'use client';

import { motion } from 'framer-motion';
import { Upload, Brain, Film, Download } from 'lucide-react';
import { Container } from '@/components/ui/container';

const steps = [
  {
    icon: Upload,
    title: 'Upload Content',
    description: 'Upload any video, podcast, or stream recording. Or paste a YouTube link.',
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our AI transcribes, detects viral moments, and scores every segment.',
    color: 'from-moonlight-500/20 to-moonlight-600/20',
    iconColor: 'text-moonlight-400',
  },
  {
    icon: Film,
    title: 'Generate Clips',
    description: 'Auto-captions, face tracking, dynamic zooms, and 9:16 reframing applied.',
    color: 'from-purple-500/20 to-purple-600/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Download,
    title: 'Export & Share',
    description: 'Preview, tweak, and download TikTok, Shorts & Reels-ready clips.',
    color: 'from-emerald-500/20 to-emerald-600/20',
    iconColor: 'text-emerald-400',
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-moonlight-500/[0.02] to-transparent pointer-events-none" />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Four simple steps from upload to viral
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-[12.5%] right-[12.5%] h-[1px] bg-gradient-to-r from-moonlight-500/40 via-moonlight-500/20 to-transparent -translate-y-1/2" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} border border-white/5 flex items-center justify-center mb-6 relative`}>
                <step.icon className={`h-7 w-7 ${step.iconColor}`} />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-moonlight-500 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-white/40 max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
