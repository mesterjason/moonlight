'use client';

import { motion } from 'framer-motion';
import { Sparkles, Upload, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-moonlight-500/5 via-transparent to-cosmic pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-moonlight-500/10 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[96px] animate-pulse delay-1000" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="new" className="text-sm px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Content Repurposing
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Turn Long Content
            </span>
            <br />
            <span className="bg-gradient-to-r from-moonlight-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Into Viral Clips
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-white/50 max-w-2xl"
          >
            Upload your video, podcast, or stream — MoonLight AI finds the best moments,
            adds captions, and exports TikTok, Shorts & Reels ready clips.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
          >
            <Button size="lg" variant="glow" className="flex-1 text-lg">
              <Upload className="h-5 w-5" />
              Upload Video
            </Button>
            <Button size="lg" variant="outline" className="flex-1 text-lg">
              <Link2 className="h-5 w-5" />
              YouTube Link
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-2 text-sm text-white/30"
          >
            <span>Free forever</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>No watermark</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>AI-powered</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-moonlight-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-2">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-moonlight-900 via-purple-900/50 to-cosmic flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm text-white/40">Demo Preview</span>
                  </div>
                  <p className="text-white/20 text-sm">Your AI-generated clips will appear here</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex items-center gap-8 text-white/20 text-sm mt-4"
          >
            <span className="flex items-center gap-2">
              <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-white/10" />
              Used by creators worldwide
            </span>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
