// Basic keyword extraction for MVP
// In production, this would use a curated corpus per role

const TECH_KEYWORDS = [
  // Languages
  'javascript', 'typescript', 'python', 'java', 'go', 'rust', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
  // Frontend
  'react', 'vue', 'angular', 'nextjs', 'svelte', 'html', 'css', 'tailwind', 'sass',
  // Backend
  'node.js', 'nodejs', 'express', 'fastify', 'django', 'flask', 'spring', 'rails', 'laravel',
  // Database
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'prisma',
  // Cloud & DevOps
  'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'jenkins', 'github actions',
  'linux', 'nginx', 'apache',
  // Data & AI
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'sql', 'tableau',
  // Management
  'agile', 'scrum', 'jira', 'asana', 'project management', 'leadership', 'team lead',
  // Design
  'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'user research', 'ui/ux', 'prototyping',
]

export interface KeywordMatch {
  keyword: string
  count: number
  position: number // 0 = summary, 1 = skills, 2 = experience
}

export function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase()
  const found: string[] = []

  for (const kw of TECH_KEYWORDS) {
    if (lower.includes(kw)) {
      found.push(kw)
    }
  }

  return [...new Set(found)] // unique only
}

export function calculateKeywordDensity(
  keywords: string[],
  cvText: string
): Record<string, number> {
  const lower = cvText.toLowerCase()
  const density: Record<string, number> = {}

  for (const kw of keywords) {
    // Use word boundaries to avoid matching inside other words (e.g., 'java' in 'javascript')
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi')
    const matches = lower.match(regex)
    density[kw] = matches ? matches.length : 0
  }

  return density
}

export function getMissingKeywords(cvKeywords: string[], roleCategory: string): string[] {
  // For MVP, check against a basic checklist
  const essential: Record<string, string[]> = {
    engineering: ['javascript', 'react', 'sql', 'git'],
    design: ['figma', 'ui/ux', 'prototyping'],
    marketing: ['analytics', 'content', 'seo'],
    management: ['leadership', 'agile', 'project management'],
  }

  const essentialList = essential[roleCategory] || essential.engineering
  return essentialList.filter((k) => !cvKeywords.includes(k))
}