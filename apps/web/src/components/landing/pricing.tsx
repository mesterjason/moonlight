'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: 'Free',
    credits: 10,
    price: '$0',
    watermark: true,
    features: [
      '10 clips per month',
      'Up to 30min videos',
      'Basic captions',
      '720p export',
      'Watermarked',
    ],
    missing: ['HD export', 'Custom branding', 'Priority processing', 'API access'],
  },
  {
    name: 'Pro',
    credits: 100,
    price: '$12',
    watermark: false,
    popular: true,
    features: [
      '100 clips per month',
      'Up to 2hr videos',
      'AI captions + emoji',
      '1080p export',
      'No watermark',
      'Face tracking',
      'Priority queue',
    ],
    missing: [],
  },
  {
    name: 'Studio',
    credits: 500,
    price: '$29',
    watermark: false,
    features: [
      '500 clips per month',
      'Up to 6hr videos',
      'All AI features',
      '4K export',
      'Custom branding',
      'API access',
      'Team collaboration',
    ],
    missing: [],
  },
];

export function Pricing() {
  return (
    <section className="relative py-32" id="pricing">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="premium" className="mb-4 text-sm px-4 py-1.5">
            Simple Pricing
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Start Free, Scale When Ready
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            All plans include AI-powered clip generation. Upgrade anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge variant="premium" className="px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card
                className={`p-8 h-full flex flex-col ${plan.popular ? 'border-moonlight-500/30' : ''}`}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.price !== '$0' && <span className="text-white/40">/mo</span>}
                  </div>
                  <p className="text-sm text-white/40 mt-1">{plan.credits} clips / month</p>
                </div>

                <Button
                  variant={plan.popular ? 'glow' : 'outline'}
                  className="w-full mb-6"
                >
                  {plan.price === '$0' ? 'Get Started Free' : 'Subscribe'}
                </Button>

                <div className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-white/70">{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} className="flex items-center gap-3 text-sm">
                      <X className="h-4 w-4 text-white/20 shrink-0" />
                      <span className="text-white/30">{f}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
