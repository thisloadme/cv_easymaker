// Transform raw answers to SMART bullets
// S = Specific, M = Measurable, A = Achievable, R = Relevant, T = Time-bound

interface BulletInput {
  text: string
  context?: string // company, role, industry
}

interface SmartBullet {
  original: string
  transformed: string
  metrics: string[] // extracted numbers/percentages
}

export function buildSmartBullet(input: BulletInput): SmartBullet {
  const { text, context } = input

  // Extract metrics/numbers from text
  const metrics = extractMetrics(text)

  // If already has metrics, clean up formatting
  if (metrics.length > 0) {
    return {
      original: text,
      transformed: cleanBullet(text),
      metrics,
    }
  }

  // Add context-based metric if missing
  let transformed = text
  if (context && !hasMetric(text)) {
    transformed = addContextualMetric(text, context)
  }

  return {
    original: text,
    transformed,
    metrics: extractMetrics(transformed),
  }
}

function extractMetrics(text: string): string[] {
  // Match percentages, numbers with units, time durations, and standalone numbers
  const patterns = [
    /(\d+(?:\.\d+)?)\s*%/g,           // percentages: 35%
    /(\d+(?:\.\d+)?)\s*(?:x|X)/g,    // multipliers: 3x
    /(\d+(?:\.\d+)?)\s*(?:k|K|million|billion)/gi, // scale: 10k, 2M
    /(\d+(?:\.\d+)?)\s*(?:hours?|days?|weeks?|months?|years?)/gi, // duration
    /\b(\d+(?:\.\d+)?)\b/g,          // standalone numbers: 10, 5, 100 (for team size, count, etc.)
  ]

  const metrics: string[] = []
  const seen = new Set<string>()
  for (const pattern of patterns) {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      const metric = match[0]
      if (!seen.has(metric)) {
        seen.add(metric)
        metrics.push(metric)
      }
    }
  }

  return metrics
}

function hasMetric(text: string): boolean {
  return extractMetrics(text).length > 0
}

function cleanBullet(text: string): string {
  // Remove passive voice, clean up formatting
  return text
    .replace(/I\s+have\s+been\s+/gi, '')
    .replace(/I\s+was\s+/gi, '')
    .replace(/I\s+am\s+/gi, '')
    .replace(/managed\s+/gi, 'manage ')
    .replace(/developed\s+/gi, 'develop ')
    .replace(/created\s+/gi, 'create ')
    .replace(/implemented\s+/gi, 'implement ')
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim()
}

function addContextualMetric(text: string, context: string): string {
  // This is a simplified version - real impl would use context
  const action = text.split(' ')[0]
  const rest = text.split(' ').slice(1).join(' ')

  // Common patterns
  if (text.toLowerCase().includes('improve')) {
    return `${text}, improve efficiency 20-30%`
  }
  if (text.toLowerCase().includes('manage') || text.toLowerCase().includes('lead')) {
    return `${text}, leading team of 5-10`
  }
  if (text.toLowerCase().includes('develop') || text.toLowerCase().includes('build')) {
    return `${text}, delivered 2-3 major releases`
  }

  return text
}

export function transformBulletList(bullets: string[], context?: string): SmartBullet[] {
  return bullets.map((b) => buildSmartBullet({ text: b, context }))
}