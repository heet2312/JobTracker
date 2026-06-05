import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        variables: {
          colorBackground: '#0f0f0f',
          colorInputBackground: '#1a1a1a',
          colorText: '#f0f0f0',
          colorPrimary: '#3b82f6',
          colorNeutral: '#a1a1aa',
          colorTextSecondary: '#a1a1aa',
        },
        elements: {
          socialButtonsBlockButton:
            'bg-[#1a1a1a] border border-[#3f3f46] text-white hover:bg-[#27272a] transition-colors',
          socialButtonsBlockButtonText: 'text-white font-medium',
          socialButtonsBlockButtonArrow: 'text-white',
          dividerLine: 'bg-[#3f3f46]',
          dividerText: 'text-[#a1a1aa]',
        },
      }}
    />
  )
}
