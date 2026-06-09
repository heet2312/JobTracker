'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff, Cpu, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { updateAIProviderSettings } from '@/lib/actions/user.actions'
import { AI_PROVIDERS, type AIProvider } from '@/lib/constants/ai-models'

interface AIProviderClientProps {
  initialProvider: AIProvider
  initialModel: string
  initialKeyIsSet: boolean
}

export function AIProviderClient({
  initialProvider,
  initialModel,
  initialKeyIsSet,
}: AIProviderClientProps) {
  const [provider, setProvider] = useState<AIProvider>(initialProvider)
  const [model, setModel] = useState(initialModel)
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [keyIsSet, setKeyIsSet] = useState(initialKeyIsSet)
  const [isPending, startTransition] = useTransition()
  const [isDirty, setIsDirty] = useState(false)

  const currentProviderConfig = AI_PROVIDERS.find((p) => p.value === provider)
  const availableModels = currentProviderConfig?.models ?? []

  function handleProviderChange(newProvider: AIProvider) {
    setProvider(newProvider)
    // Auto-select first model for this provider
    const firstModel = AI_PROVIDERS.find((p) => p.value === newProvider)?.models[0]?.value ?? ''
    setModel(firstModel)
    setIsDirty(true)
  }

  function handleModelChange(newModel: string) {
    setModel(newModel)
    setIsDirty(true)
  }

  function handleKeyChange(value: string) {
    setApiKey(value)
    setIsDirty(true)
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateAIProviderSettings({
        provider,
        apiKey,
        model,
      })
      if (result.success && result.data) {
        setKeyIsSet(result.data.keyIsSet)
        setApiKey('')
        setIsDirty(false)
        toast.success('AI provider saved')
      } else {
        toast.error(result.error ?? 'Failed to save AI provider')
      }
    })
  }

  function handleClearKey() {
    setApiKey('')
    setKeyIsSet(false)
    setIsDirty(true)
    // Trigger save with empty key
    startTransition(async () => {
      const result = await updateAIProviderSettings({ provider, apiKey: '', model })
      if (result.success) {
        toast.success('API key cleared')
        setIsDirty(false)
      } else {
        toast.error(result.error ?? 'Failed to clear key')
        setKeyIsSet(true)
      }
    })
  }

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
            {keyIsSet && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-[10px] border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                >
                  <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                  Key saved
                </Badge>
                <button
                  type="button"
                  onClick={handleClearKey}
                  disabled={isPending}
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
              value={apiKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder={
                keyIsSet
                  ? 'Enter a new key to replace the saved one'
                  : provider === 'gemini'
                  ? 'sk-... or AIza... (leave blank to use env var)'
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
          {provider === 'gemini' && !keyIsSet && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              No key saved — using <code className="font-mono">GEMINI_API_KEY</code> from environment variables
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
