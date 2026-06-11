'use client'

import { useRouter } from 'next/navigation'
import { Briefcase, FileText, Kanban, LayoutDashboard, Plus } from 'lucide-react'
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from '@/components/ui/command'
import { DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useCommandPalette } from '@/lib/hooks/use-command-palette'
import { ROUTES } from '@/lib/constants/routes'

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette()
  const router = useRouter()

  function run(fn: () => void) {
    fn()
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <VisuallyHidden>
        <DialogTitle>Command Palette</DialogTitle>
      </VisuallyHidden>
      <CommandInput placeholder="Search jobs, navigate, or run actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => run(() => router.push(ROUTES.IMPORT))}>
            <Plus className="mr-2 h-4 w-4" />
            Import New Job
            <span className="ml-auto text-xs text-muted-foreground">⌘N</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => run(() => router.push(ROUTES.DASHBOARD))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
            <span className="ml-auto text-xs text-muted-foreground">⌘D</span>
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push(ROUTES.BOARD))}>
            <Kanban className="mr-2 h-4 w-4" />
            Board
            <span className="ml-auto text-xs text-muted-foreground">⌘B</span>
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push(ROUTES.JOBS))}>
            <Briefcase className="mr-2 h-4 w-4" />
            Jobs
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push(ROUTES.RESUMES))}>
            <FileText className="mr-2 h-4 w-4" />
            Resumes
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
