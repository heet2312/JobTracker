import { Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SkillGapListProps {
  matchedSkills: string[]
  missingSkills: string[]
}

export function SkillGapList({ matchedSkills, missingSkills }: SkillGapListProps) {
  return (
    <div className="space-y-4">
      {matchedSkills.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" /> Matched Skills ({matchedSkills.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="border-green-500/30 text-green-500 bg-green-500/10">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {missingSkills.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
            <X className="h-3 w-3 text-destructive" /> Missing Skills ({missingSkills.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="border-destructive/30 text-destructive bg-destructive/10">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
