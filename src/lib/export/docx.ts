import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle,
} from 'docx'
import type { ParsedCV } from '@/types'

export async function generateDOCX(cv: ParsedCV): Promise<Buffer> {
  const parts: Paragraph[] = []

  // Header - Name
  parts.push(
    new Paragraph({
      text: cv.personal?.name || 'Your Name',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    })
  )

  // Contact info
  const contactParts: string[] = []
  if (cv.personal?.email) contactParts.push(cv.personal.email)
  if (cv.personal?.phone) contactParts.push(cv.personal.phone)
  if (cv.personal?.location) contactParts.push(cv.personal.location)
  if (cv.personal?.linkedin) contactParts.push(cv.personal.linkedin)
  if (cv.personal?.portfolio) contactParts.push(cv.personal.portfolio)

  if (contactParts.length > 0) {
    parts.push(
      new Paragraph({
        children: contactParts.map((c) => new TextRun({ text: c, size: 20 })),
        spacing: { after: 200 },
      })
    )
  }

  // Summary section
  if (cv.summary) {
    parts.push(
      new Paragraph({
        text: 'Summary',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: '333333' },
        },
      })
    )
    parts.push(
      new Paragraph({
        text: cv.summary,
        spacing: { after: 300 },
      })
    )
  }

  // Experience section
  if (cv.experience?.length > 0) {
    parts.push(
      new Paragraph({
        text: 'Experience',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: '333333' },
        },
      })
    )

    for (const exp of cv.experience) {
      // Role and company header
      parts.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.role, bold: true, size: 22 }),
            new TextRun({ text: `  |  ${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}`, size: 20, color: '666666' }),
          ],
          spacing: { before: 200, after: 100 },
        })
      )
      if (exp.company) {
        parts.push(
          new Paragraph({
            children: [new TextRun({ text: exp.company, italics: true, size: 20 })],
            spacing: { after: 100 },
          })
        )
      }
      // Bullets
      for (const bullet of exp.bullets || []) {
        parts.push(
          new Paragraph({
            children: [
              new TextRun({ text: '\u2022 ', size: 20 }),
              new TextRun({ text: bullet, size: 20 }),
            ],
            indent: { left: 400 },
            spacing: { after: 50 },
          })
        )
      }
    }
  }

  // Education section
  if (cv.education?.length > 0) {
    parts.push(
      new Paragraph({
        text: 'Education',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: '333333' },
        },
      })
    )

    for (const edu of cv.education) {
      parts.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true, size: 22 }),
            new TextRun({ text: `  |  ${edu.endYear}`, size: 20, color: '666666' }),
          ],
          spacing: { before: 200, after: 100 },
        })
      )
      parts.push(
        new Paragraph({
          children: [new TextRun({ text: edu.school, italics: true, size: 20 })],
          spacing: { after: 50 },
        })
      )
    }
  }

  // Skills section
  if (cv.skills?.length > 0) {
    parts.push(
      new Paragraph({
        text: 'Skills',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: '333333' },
        },
      })
    )
    const skillText = cv.skills.map((s) => s.name).join(', ')
    parts.push(
      new Paragraph({
        text: skillText,
        spacing: { after: 200 },
      })
    )
  }

  // Projects section
  if (cv.projects?.length > 0) {
    parts.push(
      new Paragraph({
        text: 'Projects',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: '333333' },
        },
      })
    )

    for (const proj of cv.projects) {
      parts.push(
        new Paragraph({
          children: [new TextRun({ text: proj.name, bold: true })],
          spacing: { before: 200, after: 100 },
        })
      )
      if (proj.tech?.length > 0) {
        parts.push(
          new Paragraph({
            children: [new TextRun({ text: proj.tech.join(' \u2022 '), size: 20, color: '666666' })],
            spacing: { after: 100 },
          })
        )
      }
      if (proj.description) {
        parts.push(
          new Paragraph({
            text: proj.description,
            spacing: { after: 100 },
          })
        )
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: parts,
      },
    ],
  })

  return Buffer.from(await Packer.toBuffer(doc))
}
