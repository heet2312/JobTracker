'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Linkedin, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { parseLinkedInProfileAction, type ParsedLinkedInProfile } from '@/lib/actions/user.actions'
import { updateUserProfile } from '@/lib/actions/user.actions'
import { useLocalApiKey } from '@/lib/hooks/use-api-key'

export function LinkedInImportClient() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<ParsedLinkedInProfile | null>(null)
  const [isParsing, startParsing] = useTransition()
  const [isSaving, startSaving] = useTransition()
  const { getKey } = useLocalApiKey()

  async function handleParse() {
    if (!text.trim()) return
    startParsing(async () => {
      const result = await parseLinkedInProfileAction(text, getKey() || undefined)
      if (result.success && result.data) {
        setPreview(result.data)
      } else {
        toast.error(result.error ?? 'Failed to parse profile')
      }
    })
  }

  async function handleSave() {
    if (!preview) return
    startSaving(async () => {
      const result = await updateUserProfile({
        headline: preview.headline || undefined,
        summary: preview.summary || undefined,
        skills: preview.skills.length > 0 ? preview.skills : undefined,
        experienceLevel: preview.experienceLevel ?? undefined,
        targetRoles: preview.targetRoles.length > 0 ? preview.targetRoles : undefined,
        industries: preview.industries.length > 0 ? preview.industries : undefined,
        linkedinUrl: preview.linkedinUrl || undefined,
      })
      if (result.success) {
        toast.success('Profile updated from LinkedIn')
        setOpen(false)
        setText('')
        setPreview(null)
      } else {
        toast.error(result.error ?? 'Failed to save profile')
      }
    })
  }

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-[#0a66c2]" />
            <CardTitle className="text-base">Import from LinkedIn</CardTitle>
          </div>
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <CardDescription>
          Paste your LinkedIn profile text to auto-fill your skills, headline, and target roles.
        </CardDescription>
      </CardHeader>

      {open && (
        <CardContent className="space-y-4">
          {!preview ? (
            <>
              <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">How to copy your LinkedIn profile:</p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Open your LinkedIn profile in a browser</li>
                  <li>Press <kbd className="bg-muted px-1 rounded text-[10px]">Ctrl+A</kbd> then <kbd className="bg-muted px-1 rounded text-[10px]">Ctrl+C</kbd></li>
                  <li>Paste below and click Parse</li>
                </ol>
              </div>
              <Textarea
                placeholder="Paste your LinkedIn profile text here…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                className="resize-none font-mono text-xs"
                disabled={isParsing}
              />
              <Button
                onClick={handleParse}
                disabled={isParsing || !text.trim()}
                className="w-full gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {isParsing ? 'Parsing with AI…' : 'Parse Profile'}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border border-border bg-muted/20 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Extracted profile data
                </p>

                {preview.headline && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Headline</p>
                    <p className="text-sm font-medium">{preview.headline}</p>
                  </div>
                )}

                {preview.summary && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Summary</p>
                    <p className="text-sm text-foreground/80 line-clamp-3">{preview.summary}</p>
                  </div>
                )}

                {preview.experienceLevel && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Experience level</p>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {preview.experienceLevel}
                    </Badge>
                  </div>
                )}

                {preview.targetRoles.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Target roles</p>
                    <div className="flex flex-wrap gap-1">
                      {preview.targetRoles.map((r) => (
                        <Badge key={r} variant="outline" className="text-xs">{r}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {preview.skills.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Skills <span className="font-normal">({preview.skills.length})</span>
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {preview.skills.slice(0, 20).map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                      {preview.skills.length > 20 && (
                        <Badge variant="secondary" className="text-xs text-muted-foreground">
                          +{preview.skills.length - 20} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {preview.industries.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Industries</p>
                    <div className="flex flex-wrap gap-1">
                      {preview.industries.map((i) => (
                        <Badge key={i} variant="outline" className="text-xs">{i}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPreview(null)}
                  disabled={isSaving}
                  className="flex-1"
                >
                  ← Re-paste
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 gap-2"
                >
                  <Check className="h-4 w-4" />
                  {isSaving ? 'Saving…' : 'Save to profile'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
