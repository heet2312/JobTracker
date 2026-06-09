import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 56,
    fontSize: 10,
    color: '#1a1a1a',
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
  },
  sectionTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#555555',
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
    paddingBottom: 3,
    marginTop: 14,
    marginBottom: 5,
  },
  line: {
    fontSize: 10,
    marginBottom: 2,
    lineHeight: 1.5,
  },
  bullet: {
    fontSize: 10,
    marginBottom: 2,
    paddingLeft: 10,
    lineHeight: 1.4,
  },
  nameHeader: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },
  contactLine: {
    fontSize: 9,
    color: '#555555',
    marginBottom: 12,
  },
})

function isAllCapsHeader(line: string): boolean {
  const trimmed = line.trim()
  return (
    trimmed.length >= 3 &&
    trimmed.length <= 40 &&
    trimmed === trimmed.toUpperCase() &&
    /[A-Z]/.test(trimmed) &&
    !/^\d/.test(trimmed)
  )
}

function isBullet(line: string): boolean {
  const t = line.trim()
  return t.startsWith('•') || t.startsWith('-') || t.startsWith('*')
}

interface ResumePDFProps {
  content: string
  atsScore?: number
}

export function ResumePDF({ content, atsScore }: ResumePDFProps) {
  const rawLines = content.split('\n')
  // Detect first non-empty lines as name/contact until the first section header
  let nameIdx = -1
  let contactIdx = -1
  let bodyStart = 0

  for (let i = 0; i < Math.min(rawLines.length, 8); i++) {
    const t = rawLines[i].trim()
    if (!t) continue
    if (nameIdx === -1) { nameIdx = i; continue }
    if (contactIdx === -1 && !isAllCapsHeader(t)) { contactIdx = i; continue }
    if (isAllCapsHeader(t)) { bodyStart = i; break }
    bodyStart = i
  }

  const nameLine = nameIdx >= 0 ? rawLines[nameIdx].trim() : ''
  const contactLine = contactIdx >= 0 ? rawLines[contactIdx].trim() : ''
  const bodyLines = rawLines.slice(bodyStart)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {nameLine ? (
          <>
            <Text style={styles.nameHeader}>{nameLine}</Text>
            {contactLine && <Text style={styles.contactLine}>{contactLine}</Text>}
          </>
        ) : null}

        {/* ATS score watermark */}
        {atsScore !== undefined && (
          <View style={{ position: 'absolute', top: 48, right: 56 }}>
            <Text style={{ fontSize: 8, color: '#aaaaaa' }}>ATS Score: {atsScore}%</Text>
          </View>
        )}

        {/* Body */}
        {bodyLines.map((line, i) => {
          const trimmed = line.trim()
          if (!trimmed) return <View key={i} style={{ marginBottom: 4 }} />
          if (isAllCapsHeader(trimmed)) {
            return <Text key={i} style={styles.sectionTitle}>{trimmed}</Text>
          }
          if (isBullet(trimmed)) {
            return <Text key={i} style={styles.bullet}>{trimmed}</Text>
          }
          return <Text key={i} style={styles.line}>{trimmed}</Text>
        })}
      </Page>
    </Document>
  )
}
