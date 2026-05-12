'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'What is MoonLight?',
    a: 'MoonLight is an AI-powered content repurposing engine. Upload long-form videos, podcasts, or streams, and it automatically generates viral-ready short-form clips for TikTok, YouTube Shorts, and Instagram Reels.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes! The Free plan gives you 10 clips per month with no credit card required. Upgrade to Pro for unlimited access and premium features like no watermark and HD export.',
  },
  {
    q: 'What file formats are supported?',
    a: 'We support MP4, MOV, AVI, and most common video formats. You can also paste a YouTube link and we\'ll download it for you.',
  },
  {
    q: 'How long does processing take?',
    a: 'Processing time depends on video length. A 30-minute video typically takes 5-10 minutes to analyze and generate clips. You\'ll get a notification when your clips are ready.',
  },
  {
    q: 'Can I customize the captions?',
    a: 'Yes! Choose from neon, classic, or minimal caption styles. Pro users get additional customization options including fonts, colors, and emoji support.',
  },
  {
    q: 'What makes MoonLight different?',
    a: 'MoonLight combines AI transcription, viral moment detection, face tracking, and auto-captions in one seamless workflow. No other free tool offers this complete pipeline.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
              Frequently Asked Questions
            </span>
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-white/80 text-sm">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-white/30 transition-transform duration-200 shrink-0 ml-4',
                    openIndex === i && 'rotate-180',
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-white/50 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
