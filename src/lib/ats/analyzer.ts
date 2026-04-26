import type { ATSAnalysis, ParsedCV } from '@/types'
import { extractKeywords, calculateKeywordDensity, getMissingKeywords } from './keywordExtractor'
import { transformBulletList } from './smartBulletBuilder'

export function calculateATSScore(cv: ParsedCV): ATSAnalysis {
  let totalScore = 0
  const breakdown = {
    format: 0,
    keywords: 0,
    contact: 0,
    completeness: 0,
    bullets: 0,
    fileFormat: 0,
  }

  // 1. Format compliance (20%)
  breakdown.format = calculateFormatScore(cv)

  // 2. Keyword density (25%)
  const cvText = buildCVText(cv)
  const keywords = extractKeywords(cvText)
  breakdown.keywords = calculateKeywordScore(cv, keywords)

  // 3. Contact info (10%)
  breakdown.contact = calculateContactScore(cv.personal)

  // 4. Section completeness (15%)
  breakdown.completeness = calculateCompletenessScore(cv)

  // 5. Bullet quality (20%)
  breakdown.bullets = calculateBulletScore(cv.experience)

  // 6. File format (10%) - this is set at export time
  breakdown.fileFormat = 100 // default, set to actual at export

  totalScore = Math.round(
    breakdown.format * 0.20 +
    breakdown.keywords * 0.25 +
    breakdown.contact * 0.10 +
    breakdown.completeness * 0.15 +
    breakdown.bullets * 0.20 +
    breakdown.fileFormat * 0.10
  )

  const missingKeywords = getMissingKeywords(keywords, cv.targetRole.toLowerCase())
  const overused = Object.entries(calculateKeywordDensity(keywords, cvText))
    .filter(([_, count]) => count > 5)
    .map(([kw]) => kw)

  const recommendations = generateRecommendations(breakdown, missingKeywords, overused)

  return {
    totalScore,
    breakdown,
    missingKeywords,
    overusedKeywords: overused,
    recommendations,
  }
}

function buildCVText(cv: ParsedCV): string {
  const parts = [
    cv.personal.name,
    cv.personal.email,
    cv.summary,
    cv.experience.map((e) => `${e.role} ${e.bullets.join(' ')}`).join(' '),
    cv.skills.map((s) => s.name).join(' '),
    cv.projects.map((p) => `${p.name} ${p.description}`).join(' '),
  ]
  return parts.join(' ').toLowerCase()
}

function calculateFormatScore(cv: ParsedCV): number {
  // ATS-friendly format: single column, no tables/graphics, standard fonts
  let score = 100

  // Penalize if multiple columns detected (simplified check)
  // In real impl, would check the actual document structure

  return score
}

function calculateKeywordScore(cv: ParsedCV, keywords: string[]): number {
  if (keywords.length === 0) return 0

  const cvText = buildCVText(cv)
  const density = calculateKeywordDensity(keywords, cvText)

  // Ideal: each keyword appears 3-5 times
  let score = 0
  for (const [kw, count] of Object.entries(density)) {
    if (count >= 3 && count <= 5) {
      score += 25
    } else if (count > 0) {
      score += 15
    } else {
      score += 0
    }
  }

  return Math.min(100, score)
}

function calculateContactScore(personal: ParsedCV['personal']): number {
  let score = 0
  if (personal.name && personal.name.length > 0) score += 25
  if (personal.email && personal.email.includes('@')) score += 25
  if (personal.phone && personal.phone.length > 0) score += 25
  if (personal.location && personal.location.length > 0) score += 25
  return score
}

function calculateCompletenessScore(cv: ParsedCV): number {
  let score = 0
  const sections = [
    cv.personal.name ? 1 : 0,
    cv.summary.length >= 50 ? 1 : 0,
    cv.experience.length > 0 ? 1 : 0,
    cv.education.length > 0 ? 1 : 0,
    cv.skills.length > 0 ? 1 : 0,
  ]

  score = (sections.reduce((a, b) => a + b, 0) / sections.length) * 100
  return Math.round(score)
}

function calculateBulletScore(experience: ParsedCV['experience']): number {
  if (experience.length === 0) return 0

  let totalScore = 0
  for (const exp of experience) {
    const bullets = transformBulletList(exp.bullets)
    for (const bullet of bullets) {
      if (bullet.metrics.length > 0) {
        totalScore += 25
      } else {
        totalScore += 10
      }
    }
  }

  return Math.min(100, totalScore / experience.length)
}

function generateRecommendations(
  breakdown: ATSAnalysis['breakdown'],
  missing: string[],
  overused: string[]
): string[] {
  const recs: string[] = []

  if (breakdown.format < 80) {
    recs.push('Use single-column layout without tables or graphics for better ATS parsing')
  }
  if (breakdown.keywords < 60) {
    recs.push('Add more industry-specific keywords - check job descriptions for target terms')
  }
  if (breakdown.completeness < 80) {
    recs.push('Fill in all CV sections - incomplete profiles score lower')
  }
  if (breakdown.bullets < 60) {
    recs.push('Add measurable metrics to your achievement bullets (%, numbers, scales)')
  }
  if (missing.length > 0) {
    recs.push(`Missing keywords: ${missing.slice(0, 5).join(', ')}`)
  }
  if (overused.length > 0) {
    recs.push(`Overused keywords (may hurt): ${overused.join(', ')}`)
  }

  return recs
}