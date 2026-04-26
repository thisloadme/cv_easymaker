import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CoverLetterSection } from '@/lib/coverLetter/generator'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 50,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contact: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 10,
    marginBottom: 20,
  },
  salutation: {
    fontSize: 11,
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  body: {
    fontSize: 11,
    lineHeight: 1.6,
  },
  paragraph: {
    marginBottom: 10,
  },
  signature: {
    marginTop: 30,
    fontSize: 11,
  },
})

interface CoverLetterPDFProps {
  sections: CoverLetterSection[]
  applicantName: string
  applicantEmail: string
  companyName?: string
  date: string
}

export function CoverLetterPDF({ sections, applicantName, applicantEmail, companyName, date }: CoverLetterPDFProps) {
  const salutation = sections.find(s => s.title === 'Salutation')
  const intro = sections.find(s => s.title === 'Introduction')
  const qualifications = sections.find(s => s.title === 'Qualifications')
  const closing = sections.find(s => s.title === 'Closing')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{applicantName}</Text>
          <Text style={styles.contact}>{applicantEmail}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>

        {/* Salutation */}
        {salutation && (
          <Text style={styles.salutation}>{salutation.content}</Text>
        )}

        {/* Introduction */}
        {intro && (
          <View style={styles.section}>
            <Text style={styles.body}>{intro.content}</Text>
          </View>
        )}

        {/* Qualifications */}
        {qualifications && (
          <View style={styles.section}>
            <Text style={styles.body}>{qualifications.content}</Text>
          </View>
        )}

        {/* Closing */}
        {closing && (
          <View style={styles.section}>
            <Text style={styles.body}>{closing.content}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
