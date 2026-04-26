import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { ParsedCV } from '@/types'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    lineHeight: 1.4,
  },
  header: { marginBottom: 20 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  contact: { fontSize: 9, color: '#666', marginBottom: 2 },
  section: { marginBottom: 15 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottom: '1 solid #333',
    paddingBottom: 4,
    marginBottom: 8,
  },
  summaryText: { fontSize: 10, lineHeight: 1.5 },
  experienceEntry: { marginBottom: 12 },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  expTitle: { fontSize: 11, fontWeight: 'bold' },
  expCompany: { fontSize: 10, fontStyle: 'italic' },
  expDate: { fontSize: 9, color: '#666' },
  expBullets: { marginLeft: 12, marginTop: 4 },
  expBullet: { fontSize: 9, marginBottom: 2, flexDirection: 'row' },
  bulletDot: { width: 10 },
  educationEntry: { marginBottom: 8 },
  eduHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  eduDegree: { fontSize: 10, fontWeight: 'bold' },
  eduSchool: { fontSize: 10, fontStyle: 'italic' },
  eduDate: { fontSize: 9, color: '#666' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  skillBadge: { fontSize: 9, backgroundColor: '#f0f0f0', paddingHorizontal: 6, paddingVertical: 2 },
  projectEntry: { marginBottom: 10 },
  projectName: { fontSize: 10, fontWeight: 'bold' },
  projectTech: { fontSize: 9, color: '#666', marginBottom: 2 },
  projectDesc: { fontSize: 9, lineHeight: 1.4 },
})

interface CVPDFProps {
  cv: ParsedCV
}

export function CVPDFDocument({ cv }: CVPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{cv.personal?.name || 'Your Name'}</Text>
          <Text style={styles.contact}>
            {cv.personal?.email} • {cv.personal?.phone} • {cv.personal?.location}
          </Text>
          {(cv.personal?.linkedin || cv.personal?.portfolio) && (
            <Text style={styles.contact}>
              {cv.personal?.linkedin}
              {cv.personal?.linkedin && cv.personal?.portfolio && ' • '}
              {cv.personal?.portfolio}
            </Text>
          )}
        </View>

        {cv.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summaryText}>{cv.summary}</Text>
          </View>
        )}

        {cv.experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {cv.experience.map((exp, idx) => (
              <View key={idx} style={styles.experienceEntry}>
                <View style={styles.expHeader}>
                  <Text style={styles.expTitle}>{exp.role}</Text>
                  <Text style={styles.expDate}>
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.expCompany}>{exp.company}</Text>
                {exp.bullets?.length > 0 && (
                  <View style={styles.expBullets}>
                    {exp.bullets.map((bullet, bIdx) => (
                      <View key={bIdx} style={styles.expBullet}>
                        <Text style={styles.bulletDot}>• </Text>
                        <Text style={{ flex: 1 }}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {cv.education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {cv.education.map((edu, idx) => (
              <View key={idx} style={styles.educationEntry}>
                <View style={styles.eduHeader}>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  <Text style={styles.eduDate}>{edu.endYear}</Text>
                </View>
                <Text style={styles.eduSchool}>{edu.school}</Text>
                {edu.gpa && <Text style={{ fontSize: 9 }}>GPA: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {cv.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {cv.skills.map((skill, idx) => (
                <Text key={idx} style={styles.skillBadge}>{skill.name}</Text>
              ))}
            </View>
          </View>
        )}

        {cv.projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {cv.projects.map((proj, idx) => (
              <View key={idx} style={styles.projectEntry}>
                <Text style={styles.projectName}>{proj.name}</Text>
                {proj.tech?.length > 0 && (
                  <Text style={styles.projectTech}>{proj.tech.join(' • ')}</Text>
                )}
                <Text style={styles.projectDesc}>{proj.description}</Text>
                {proj.impact && <Text style={{ fontSize: 9, marginTop: 2 }}>Impact: {proj.impact}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}