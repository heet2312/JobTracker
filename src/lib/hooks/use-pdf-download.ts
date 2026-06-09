'use client'

import { useState } from 'react'

export function usePDFDownload() {
  const [loading, setLoading] = useState(false)

  async function downloadResumePDF(content: string, filename: string, atsScore?: number) {
    setLoading(true)
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { ResumePDF } = await import('@/lib/pdf/resume-doc')
      const { createElement } = await import('react')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(createElement(ResumePDF, { content, atsScore }) as any).toBlob()
      triggerDownload(blob, `${filename}.pdf`)
    } finally {
      setLoading(false)
    }
  }

  async function downloadCoverLetterPDF(
    subject: string,
    content: string,
    filename: string,
    tone?: string,
    generatedAt?: Date | string
  ) {
    setLoading(true)
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { CoverLetterPDF } = await import('@/lib/pdf/cover-letter-doc')
      const { createElement } = await import('react')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(createElement(CoverLetterPDF, { subject, content, tone, generatedAt }) as any).toBlob()
      triggerDownload(blob, `${filename}.pdf`)
    } finally {
      setLoading(false)
    }
  }

  return { downloadResumePDF, downloadCoverLetterPDF, loading }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
