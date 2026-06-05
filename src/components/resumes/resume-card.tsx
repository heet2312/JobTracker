'use client'

import { useState } from 'react'
import { FileText, Star, Trash2, MoreVertical } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { relativeTime } from '@/lib/utils/date'
import { setMasterResume, deleteResume } from '@/lib/actions/resume.actions'
import type { IResume } from '@/types'

interface ResumeCardProps {
  resume: IResume
  onDeleted?: (id: string) => void
  onMasterSet?: (id: string) => void
}

export function ResumeCard({ resume, onDeleted, onMasterSet }: ResumeCardProps) {
  const [loading, setLoading] = useState(false)

  async function handleSetMaster() {
    setLoading(true)
    const result = await setMasterResume(resume._id)
    setLoading(false)
    if (result.success) {
      toast.success('Set as master resume')
      onMasterSet?.(resume._id)
    } else {
      toast.error(result.error ?? 'Failed')
    }
  }

  async function handleDelete() {
    setLoading(true)
    const result = await deleteResume(resume._id)
    setLoading(false)
    if (result.success) {
      toast.success('Resume deleted')
      onDeleted?.(resume._id)
    } else {
      toast.error(result.error ?? 'Failed')
    }
  }

  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm truncate">{resume.name}</p>
              {resume.isMaster && (
                <Badge className="text-[10px] gap-0.5 h-4 px-1">
                  <Star className="h-2.5 w-2.5" />Master
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {resume.wordCount ? `${resume.wordCount} words` : 'No content'}
              {resume.parsedData?.skills?.length
                ? ` · ${resume.parsedData.skills.length} skills`
                : ''}
            </p>
            <p className="text-xs text-muted-foreground">{relativeTime(resume.updatedAt)}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!resume.isMaster && (
                <DropdownMenuItem onClick={handleSetMaster} disabled={loading}>
                  <Star className="mr-2 h-3.5 w-3.5" />Set as Master
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
