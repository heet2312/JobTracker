export const AI_MODELS = {
  FLASH: process.env.GEMINI_FLASH_MODEL ?? 'gemini-2.5-flash-preview-05-20',
  PRO: process.env.GEMINI_PRO_MODEL ?? 'gemini-2.5-pro-preview-05-06',
} as const

export const AI_LIMITS = {
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  MAX_JD_LENGTH: 20000,
  MAX_RESUME_LENGTH: 15000,
} as const
