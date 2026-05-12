'use client';

import { motion } from 'framer-motion';
import { Moon, Sparkles, Rocket, Globe, Users, Lightbulb } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Particles } from '@/components/landing/particles';
import { Footer } from '@/components/landing/footer';

const values = [
  { icon: Lightbulb, title: 'AI-First', description: 'Every feature is designed around artificial intelligence to automate the creative process.' },
  { icon: Rocket, title: 'Creator Economy', description: 'We believe every creator deserves access to professional-grade content repurposing tools.' },
  { icon: Users, title: 'Community', description: 'Building a future where creators spend less time editing and more time creating.' },
  { icon: Globe, title: 'Accessibility', description: 'Premium AI tools should be free and accessible to everyone, everywhere.' },
];

export default function AboutPage() {
  return (
    <>
      <Particles />
      <div className="relative min-h-screen">
        <Container className="pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Moon className="h-4 w-4 text-moonlight-400" />
              <span className="text-sm text-white/60">About MoonLight</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-moonlight-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Content Creation
              </span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed">
              MoonLight was born from a simple observation: creators spend 80% of their time
              repurposing content. We built AI to do it in seconds.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-32">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-8"
              >
                <v.icon className="h-8 w-8 text-moonlight-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Sparkles className="h-8 w-8 text-moonlight-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-white/50 leading-relaxed text-lg">
              We&apos;re building the operating system for the creator economy. 
              MoonLight empowers creators to focus on what matters most — creating 
              amazing content — while AI handles the tedious work of repurposing 
              and distribution.
            </p>
          </motion.div>
        </Container>
        <Footer />
      </div>
    </>
  );
}
