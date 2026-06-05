'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import type { JobFilters } from '@/types'

interface JobFiltersProps {
  filters: JobFilters
  onChange: (filters: JobFilters) => void
}

export function JobFiltersBar({ filters, onChange }: JobFiltersProps) {
  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-48">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs..."
          className="pl-9"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          data-search
        />
      </div>
      <Select
        value={filters.locationType ?? 'all'}
        onValueChange={(v) => onChange({ ...filters, locationType: v === 'all' ? undefined : v as 'remote' | 'hybrid' | 'onsite' })}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All locations</SelectItem>
          <SelectItem value="remote">Remote</SelectItem>
          <SelectItem value="hybrid">Hybrid</SelectItem>
          <SelectItem value="onsite">On-site</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.employmentType ?? 'all'}
        onValueChange={(v) => onChange({ ...filters, employmentType: v === 'all' ? undefined : v as 'full-time' | 'part-time' | 'contract' | 'internship' })}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="full-time">Full-time</SelectItem>
          <SelectItem value="part-time">Part-time</SelectItem>
          <SelectItem value="contract">Contract</SelectItem>
          <SelectItem value="internship">Internship</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({})}
          className="gap-1"
        >
          <X className="h-3.5 w-3.5" /> Clear
        </Button>
      )}
    </div>
  )
}
