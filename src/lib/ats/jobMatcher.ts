import type { ParsedCV } from '@/types'
import { extractKeywords, calculateKeywordDensity, getMissingKeywords } from './keywordExtractor'

export interface JobMatchResult {
  matchedKeywords: string[]      // Keywords from CV that appear in JD
  missingKeywords: string[]      // Essential keywords in JD but not in CV
  matchPercentage: number         // 0-100 score
  suggestions: string[]          // What to add/emphasize
}

export function matchJobDescription(
  cv: ParsedCV,
  jobDescription: string
): JobMatchResult {
  // Extract keywords from job description
  const jdKeywords = extractKeywords(jobDescription)

  // Extract keywords from CV
  const cvText = buildCVText(cv)
  const cvKeywords = extractKeywords(cvText)

  // Find matches
  const matched = jdKeywords.filter((kw) => cvKeywords.includes(kw))
  const missing = jdKeywords.filter((kw) => !cvKeywords.includes(kw))

  // Calculate match percentage (matched / total JD keywords * 100)
  const matchPercentage = jdKeywords.length > 0
    ? Math.round((matched.length / jdKeywords.length) * 100)
    : 0

  // Generate suggestions
  const suggestions = generateSuggestions(missing, cv)

  return {
    matchedKeywords: matched,
    missingKeywords: missing,
    matchPercentage,
    suggestions,
  }
}

function buildCVText(cv: ParsedCV): string {
  const parts = [
    cv.personal?.name || '',
    cv.personal?.email || '',
    cv.summary || '',
    cv.experience?.map((e) => `${e.role} ${e.bullets.join(' ')}`).join(' ') || '',
    cv.skills?.map((s) => s.name).join(' ') || '',
    cv.projects?.map((p) => `${p.name} ${p.description} ${p.tech.join(' ')}`).join(' ') || '',
  ]
  return parts.join(' ').toLowerCase()
}

function generateSuggestions(missing: string[], cv: ParsedCV): string[] {
  const suggestions: string[] = []

  if (missing.length > 0) {
    suggestions.push(`Add these missing keywords: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? '...' : ''}`)
  }

  if (cv.experience?.length === 0) {
    suggestions.push('Add work experience — most ATS systems weight this heavily')
  }

  if (cv.summary?.length < 100) {
    suggestions.push('Expand your summary — ATS scoring checks for 50+ word professional summary')
  }

  if (cv.skills?.length < 5) {
    suggestions.push('Add more skills — aim for at least 10-15 technical and relevant skills')
  }

  return suggestions
}