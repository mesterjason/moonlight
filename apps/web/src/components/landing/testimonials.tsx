'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Content Creator',
    content: 'MoonLight saved me 10+ hours a week. I upload my podcast and get 10 ready-to-post clips instantly.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Streamer',
    content: 'The AI hook detection is insane. It finds moments I would have totally missed. My Shorts views went up 3x.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Video Editor',
    content: 'I was skeptical about AI editing, but MoonLight actually delivers. The captions alone are worth it.',
  },
  {
    name: 'Alex Kim',
    role: 'Marketing Manager',
    content: 'We repurpose all our webinars into TikTok clips now. Our social team loves how fast it is.',
  },
];

export function Testimonials() {
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
              Loved by Creators
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Join thousands of creators using MoonLight to grow their audience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6">
                <Quote className="h-6 w-6 text-moonlight-400/50 mb-4" />
                <p className="text-white/70 mb-6 leading-relaxed">{t.content}</p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
