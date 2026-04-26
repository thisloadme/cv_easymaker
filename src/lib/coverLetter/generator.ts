import type { ParsedCV } from '@/types'

interface CoverLetterInput {
  cv: ParsedCV
  jobTitle?: string
  companyName?: string
  hiringManagerName?: string
  jobDescription?: string
}

export interface CoverLetterSection {
  title: string
  content: string
}

export function generateCoverLetter(input: CoverLetterInput): CoverLetterSection[] {
  const { cv, jobTitle, companyName, hiringManagerName, jobDescription } = input

  const sections: CoverLetterSection[] = []

  // Salutation
  let salutation = 'Dear Hiring Manager'
  if (hiringManagerName) {
    salutation = `Dear ${hiringManagerName}`
  }
  sections.push({
    title: 'Salutation',
    content: salutation,
  })

  // Opening paragraph - hook
  const opening = buildOpening(cv, jobTitle, companyName)
  sections.push({
    title: 'Introduction',
    content: opening,
  })

  // Body - key qualifications
  const body = buildBody(cv, jobDescription)
  sections.push({
    title: 'Qualifications',
    content: body,
  })

  // Closing
  const closing = buildClosing(cv, companyName)
  sections.push({
    title: 'Closing',
    content: closing,
  })

  return sections
}

function buildOpening(cv: ParsedCV, jobTitle?: string, companyName?: string): string {
  const name = cv.personal?.name || 'Applicant'
  const targetRole = jobTitle || cv.targetRole || 'position'
  const company = companyName || 'your company'

  // Extract relevant experience for the hook
  const latestExp = cv.experience?.[0]
  const years = calculateYears(latestExp)

  let hook = ''
  if (latestExp?.role && years > 0) {
    hook = `I am writing to express my strong interest in the ${targetRole} role at ${company}. With ${years} years of experience as a ${latestExp.role}${latestExp.company ? ` at ${latestExp.company}` : ''}, I have developed a comprehensive skill set that aligns well with the requirements of this position.`
  } else if (cv.summary) {
    hook = `I am writing to express my interest in the ${targetRole} role at ${company}. ${cv.summary.substring(0, 150)}...`
  } else {
    hook = `I am writing to express my strong interest in the ${targetRole} role at ${company}. With my background in ${cv.targetRole}, I am confident I would be a valuable addition to your team.`
  }

  return hook
}

function calculateYears(exp?: ParsedCV['experience'][0]): number {
  if (!exp?.startDate) return 0

  const start = new Date(exp.startDate)
  const end = exp.isCurrent ? new Date() : new Date(exp.endDate || Date.now())
  const diff = end.getTime() - start.getTime()
  return Math.round(diff / (365.25 * 24 * 60 * 60 * 1000))
}

function buildBody(cv: ParsedCV, jobDescription?: string): string {
  const parts: string[] = []

  // Key achievements from experience
  if (cv.experience && cv.experience.length > 0) {
    const topExps = cv.experience.slice(0, 2)
    for (const exp of topExps) {
      if (exp.bullets && exp.bullets.length > 0) {
        const topBullet = exp.bullets[0]
        if (topBullet) {
          parts.push(`• ${capitalizeFirst(topBullet)}`)
        }
      }
    }
  }

  // Relevant skills
  if (cv.skills && cv.skills.length > 0) {
    const topSkills = cv.skills.slice(0, 5).map(s => s.name).join(', ')
    parts.push(`• Strong proficiency in ${topSkills}`)
  }

  // If job description provided, add keyword alignment
  if (jobDescription) {
    const cvText = cv.experience?.map(e => e.bullets?.join(' ')).join(' ') || ''
    const skillNames = cv.skills?.map(s => s.name).join(' ') || ''
    const combined = (cvText + ' ' + skillNames).toLowerCase()

    // Simple keyword matching - just mention alignment
    if (combined.includes('project') || combined.includes('management')) {
      parts.push(`• Demonstrated experience in project management and cross-functional collaboration`)
    }
    if (combined.includes('team') || combined.includes('lead')) {
      parts.push(`• Proven leadership abilities with experience managing teams of varying sizes`)
    }
  }

  if (parts.length === 0) {
    return 'My qualifications and experience make me well-suited for this role. I am excited about the opportunity to contribute to your team.'
  }

  return parts.join('\n')
}

function buildClosing(cv: ParsedCV, companyName?: string): string {
  const name = cv.personal?.name || 'Applicant'
  const email = cv.personal?.email || ''

  return `I am genuinely enthusiastic about the opportunity to join ${companyName || 'your organization'} and contribute to its continued success. I would welcome the chance to discuss how my background, skills, and enthusiasm align with your team's goals.

Thank you for considering my application. I look forward to hearing from you.

Sincerely,
${name}
${email}`
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
