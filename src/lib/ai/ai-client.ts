export interface AIGenerationClient {
  generateContent(prompt: string): Promise<{ response: { text(): string } }>
}

export type AIProvider = 'gemini' | 'openai' | 'anthropic'

const GEMINI_MODEL_ALIASES: Record<string, string> = {
  'gemini-2.5-flash-preview-05-20': 'gemini-2.5-flash',
  'gemini-2.5-pro-preview-05-06': 'gemini-2.5-pro',
  'gemini-2.5-flash-preview-04-17': 'gemini-2.5-flash',
}

export async function createAIClient(
  provider: AIProvider,
  apiKey: string,
  model: string
): Promise<AIGenerationClient> {
  if (provider === 'gemini') {
    model = GEMINI_MODEL_ALIASES[model] ?? model
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(apiKey)
    return genAI.getGenerativeModel({
      model,
      generationConfig: { responseMimeType: 'application/json' },
    }) as unknown as AIGenerationClient
  }

  if (provider === 'openai') {
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey })
    return {
      generateContent: async (prompt: string) => {
        const completion = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful AI assistant. Respond with valid JSON only. No markdown fences, no extra text.',
            },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
        })
        const content = completion.choices[0]?.message?.content ?? '{}'
        return { response: { text: () => content } }
      },
    }
  }

  if (provider === 'anthropic') {
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const anthropic = new Anthropic({ apiKey })
    return {
      generateContent: async (prompt: string) => {
        const message = await anthropic.messages.create({
          model,
          max_tokens: 8096,
          system:
            'You are a helpful AI assistant. Respond with valid JSON only. No markdown fences, no extra text.',
          messages: [{ role: 'user', content: prompt }],
        })
        const content =
          message.content[0]?.type === 'text' ? message.content[0].text : '{}'
        return { response: { text: () => content } }
      },
    }
  }

  throw new Error(`Unsupported AI provider: ${provider}`)
}
