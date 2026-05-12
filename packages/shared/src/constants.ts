export const CONSTANTS = {
  APP_NAME: 'MoonLight',
  APP_VERSION: '0.1.0',

  VIDEO: {
    MAX_UPLOAD_SIZE_MB: 500,
    TARGET_WIDTH: 1080,
    TARGET_HEIGHT: 1920,
    TARGET_FPS: 30,
    MIN_CLIP_DURATION: 15,
    MAX_CLIP_DURATION: 60,
    DEFAULT_CLIP_DURATION: 30,
  },

  WHISPER: {
    MODEL: 'base',
    LANGUAGE: 'en',
    BEAM_SIZE: 5,
  },

  VIRAL: {
    MIN_SCORE: 0.3,
    TOP_CLIPS: 10,
    HOOK_KEYWORDS: [
      'wait', 'wow', 'omg', 'mind blown', 'crazy', 'insane',
      'you won\'t believe', 'this is how', 'the secret', 'nobody tells you',
      'game changer', 'life hack', 'tutorial', 'review', 'reaction',
      'exclusive', 'breaking', 'controversial', 'shocking', 'unbelievable',
      'best', 'worst', 'ultimate', 'complete guide', 'step by step',
    ],
  },

  WHITELISTED_ORIGINS: ['http://localhost:3000'],
} as const;
