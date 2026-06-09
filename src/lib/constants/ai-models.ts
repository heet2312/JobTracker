export const AI_LIMITS = {
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  MAX_JD_LENGTH: 20000,
  MAX_RESUME_LENGTH: 15000,
} as const

export type AIProvider = 'gemini' | 'openai' | 'anthropic'

export const AI_PROVIDERS: {
  value: AIProvider
  label: string
  models: { value: string; label: string; description: string }[]
}[] = [
  {
    value: 'gemini',
    label: 'Google Gemini',
    models: [
      {
        value: 'gemini-2.5-flash-preview-05-20',
        label: 'Gemini 2.5 Flash',
        description: 'Fast, efficient — best for most tasks',
      },
      {
        value: 'gemini-2.5-pro-preview-05-06',
        label: 'Gemini 2.5 Pro',
        description: 'Highest quality analysis',
      },
    ],
  },
  {
    value: 'openai',
    label: 'OpenAI',
    models: [
      {
        value: 'gpt-4o-mini',
        label: 'GPT-4o Mini',
        description: 'Fast, cost-effective',
      },
      {
        value: 'gpt-4o',
        label: 'GPT-4o',
        description: 'Most capable GPT model',
      },
    ],
  },
  {
    value: 'anthropic',
    label: 'Anthropic Claude',
    models: [
      {
        value: 'claude-haiku-4-5-20251001',
        label: 'Claude Haiku 4.5',
        description: 'Fast, lightweight',
      },
      {
        value: 'claude-sonnet-4-6',
        label: 'Claude Sonnet 4.6',
        description: 'Balanced performance',
      },
      {
        value: 'claude-opus-4-8',
        label: 'Claude Opus 4.8',
        description: 'Most capable Claude model',
      },
    ],
  },
]
