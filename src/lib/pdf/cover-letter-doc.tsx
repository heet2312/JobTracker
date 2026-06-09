import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 64,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
    lineHeight: 1.7,
  },
  date: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 20,
  },
  subject: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#dddddd',
    marginBottom: 20,
  },
  paragraph: {
    marginBottom: 12,
    fontSize: 11,
    lineHeight: 1.7,
  },
  tone: {
    fontSize: 8.5,
    color: '#999999',
    position: 'absolute',
    bottom: 36,
    right: 64,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})

interface CoverLetterPDFProps {
  subject: string
  content: string
  tone?: string
  generatedAt?: Date | string
}

export function CoverLetterPDF({ subject, content, tone, generatedAt }: CoverLetterPDFProps) {
  const dateStr = generatedAt
    ? format(new Date(generatedAt), 'MMMM d, yyyy')
    : format(new Date(), 'MMMM d, yyyy')

  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.subject}>Re: {subject}</Text>
        <View style={styles.divider} />
        {paragraphs.map((para, i) => (
          <Text key={i} style={styles.paragraph}>{para}</Text>
        ))}
        {tone && (
          <Text style={styles.tone}>{tone} tone</Text>
        )}
      </Page>
    </Document>
  )
}
