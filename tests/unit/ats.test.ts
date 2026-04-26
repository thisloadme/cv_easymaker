import { describe, it, expect } from 'vitest'
import { extractKeywords, calculateKeywordDensity, getMissingKeywords } from '@/lib/ats/keywordExtractor'

describe('keywordExtractor', () => {
  describe('extractKeywords', () => {
    it('extracts javascript and react from text', () => {
      const text = 'I have 5 years of experience with JavaScript and React'
      const keywords = extractKeywords(text)
      expect(keywords).toContain('javascript')
      expect(keywords).toContain('react')
    })

    it('returns unique keywords only', () => {
      const text = 'React React React javascript javascript'
      const keywords = extractKeywords(text)
      expect(keywords.filter(k => k === 'react').length).toBe(1)
      expect(keywords.filter(k => k === 'javascript').length).toBe(1)
    })

    it('handles case insensitivity', () => {
      const text = 'Python DJANGO postgreSQL'
      const keywords = extractKeywords(text)
      expect(keywords).toContain('python')
      expect(keywords).toContain('django')
      expect(keywords).toContain('postgresql')
    })

    it('returns empty array for no matches', () => {
      const text = 'I like cooking and hiking'
      const keywords = extractKeywords(text)
      expect(keywords).toEqual([])
    })
  })

  describe('calculateKeywordDensity', () => {
    it('counts keyword occurrences', () => {
      const keywords = ['react', 'javascript']
      const text = 'I work with react and javascript. React is great for javascript development.'
      const density = calculateKeywordDensity(keywords, text)
      expect(density['react']).toBe(2)
      expect(density['javascript']).toBe(2)
    })

    it('returns 0 for missing keywords', () => {
      const keywords = ['python', 'java']
      const text = 'I work with javascript'
      const density = calculateKeywordDensity(keywords, text)
      expect(density['python']).toBe(0)
      expect(density['java']).toBe(0)
    })
  })

  describe('getMissingKeywords', () => {
    it('returns essential keywords not in CV', () => {
      const cvKeywords = ['javascript']
      const missing = getMissingKeywords(cvKeywords, 'engineering')
      expect(missing).toContain('react')
      expect(missing).toContain('sql')
      expect(missing).not.toContain('javascript')
    })

    it('returns empty when all essential keywords present', () => {
      const cvKeywords = ['javascript', 'react', 'sql', 'git']
      const missing = getMissingKeywords(cvKeywords, 'engineering')
      expect(missing).toHaveLength(0)
    })
  })
})