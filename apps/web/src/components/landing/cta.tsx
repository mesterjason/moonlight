'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export function CTA() {
  return (
    <section className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-moonlight-500/[0.03] to-transparent pointer-events-none" />
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-white/5 bg-gradient-to-br from-moonlight-500/5 via-purple-500/5 to-pink-500/5 p-12 sm:p-20 text-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-moonlight-500/10 rounded-full blur-[128px]" />
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Sparkles className="h-8 w-8 text-moonlight-400 mx-auto mb-6" />
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Start Creating Viral Clips
                </span>
              </h2>
              <p className="text-white/40 text-lg max-w-xl mx-auto mb-8">
                Join thousands of creators repurposing their content with AI. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="glow">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>
              <p className="text-xs text-white/20 mt-4">Free forever. No watermark on free plan.</p>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
