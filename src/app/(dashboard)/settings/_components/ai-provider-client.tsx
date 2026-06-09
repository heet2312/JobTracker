'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff, Cpu, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { updateAIProviderSettings } from '@/lib/actions/user.actions'
import { AI_PROVIDERS, type AIProvider } from '@/lib/constants/ai-models'
import { useLocalApiKey } from '@/lib/hooks/use-api-key'

interface AIProviderClientProps {
  initialProvider: AIProvider
  initialModel: string
}

export function AIProviderClient({ initialProvider, initialModel }: AIProviderClientProps) {
  const [provider, setProvider] = useState<AIProvider>(initialProvider)
  const [model, setModel] = useState(initialModel)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isDirty, setIsDirty] = useState(false)

  const { isSet, saveKey, getKey } = useLocalApiKey()

  const currentProviderConfig = AI_PROVIDERS.find((p) => p.value === provider)
  const availableModels = currentProviderConfig?.models ?? []

  function handleProviderChange(newProvider: AIProvider) {
    setProvider(newProvider)
    const firstModel = AI_PROVIDERS.find((p) => p.value === newProvider)?.models[0]?.value ?? ''
    setModel(firstModel)
    setIsDirty(true)
  }

  function handleModelChange(newModel: string) {
    setModel(newModel)
    setIsDirty(true)
  }

  function handleSave() {
    startTransition(async () => {
      // Save key to localStorage — never touches our server/DB
      if (apiKeyInput) {
        saveKey(apiKeyInput)
      }

      // Save provider + model to DB (not sensitive)
      const result = await updateAIProviderSettings({ provider, model })
      if (result.success) {
        setApiKeyInput('')
        setIsDirty(false)
        toast.success('AI provider saved')
      } else {
        toast.error(result.error ?? 'Failed to save AI provider')
      }
    })
  }

  function handleClearKey() {
    saveKey('')
    setApiKeyInput('')
    setIsDirty(false)
    toast.success('API key cleared from your browser')
  }

  // Current key for display (from localStorage) or what the user is typing
  const displayKey = apiKeyInput || (isSet ? getKey() : '')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">AI Provider</CardTitle>
        </div>
        <CardDescription>
          Choose which AI model powers your analysis, resumes, cover letters, and more.
          Leave blank to use the default Gemini configuration from environment variables.
        </CardDescription>
        {/* Privacy notice */}
        <div className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 mt-1">
          <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
          <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed">
            Your API key is stored <strong>only in this browser</strong> — it never reaches our
            servers or database. We have no technical ability to read or misuse it.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Provider tabs */}
        <div>
          <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">
            Provider
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {AI_PROVIDERS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => handleProviderChange(p.value)}
                className={`rounded-lg border px-3 py-2.5 text-left transition-colors text-sm font-medium ${
                  provider === p.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Model selector */}
        <div>
          <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">
            Model
          </Label>
          <div className="space-y-2">
            {availableModels.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => handleModelChange(m.value)}
                className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                  model === m.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-border/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{m.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                  </div>
                  {model === m.value && (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* API Key */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              API Key
            </Label>
            {isSet && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-[10px] border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                >
                  <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                  Saved in browser
                </Badge>
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="text-[10px] text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              value={showKey ? displayKey : apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value)
                setIsDirty(true)
              }}
              placeholder={
                isSet
                  ? 'Enter a new key to replace the saved one'
                  : provider === 'gemini'
                  ? 'AIza... (leave blank to use env var)'
                  : provider === 'openai'
                  ? 'sk-...'
                  : 'sk-ant-...'
              }
              className="pr-10 font-mono text-sm"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {provider === 'gemini' && !isSet && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              No key saved — using <code className="font-mono">GEMINI_API_KEY</code> from environment
            </p>
          )}
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-1">
          <Button
            onClick={handleSave}
            disabled={isPending || !isDirty}
            size="sm"
            className="min-w-20"
          >
            {isPending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
