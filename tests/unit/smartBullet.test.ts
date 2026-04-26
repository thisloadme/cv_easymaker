import { describe, it, expect } from 'vitest'
import { buildSmartBullet, transformBulletList } from '@/lib/ats/smartBulletBuilder'

describe('smartBulletBuilder', () => {
  describe('buildSmartBullet', () => {
    it('extracts metrics from bullet with percentages', () => {
      const result = buildSmartBullet({ text: 'Increased sales by 35%' })
      expect(result.metrics).toContain('35%')
      expect(result.transformed).toContain('35%')
    })

    it('extracts multipliers', () => {
      const result = buildSmartBullet({ text: 'Improved performance 3x' })
      expect(result.metrics).toContain('3x')
    })

    it('extracts scale numbers', () => {
      const result = buildSmartBullet({ text: 'Managed team of 10 engineers' })
      expect(result.metrics).toContain('10')
    })

    it('returns original text when no metrics', () => {
      const result = buildSmartBullet({ text: 'Worked on the project' })
      expect(result.original).toBe('Worked on the project')
    })

    it('marks bullet as having metrics when found', () => {
      const result = buildSmartBullet({ text: 'Reduced load time by 65%' })
      expect(result.metrics.length).toBeGreaterThan(0)
    })
  })

  describe('transformBulletList', () => {
    it('transforms multiple bullets', () => {
      const bullets = [
        'Increased revenue 25%',
        'Reduced costs by 15%',
        'Managed team',
      ]
      const results = transformBulletList(bullets)
      expect(results).toHaveLength(3)
      expect(results[0].metrics).toContain('25%')
      expect(results[1].metrics).toContain('15%')
      expect(results[2].metrics).toHaveLength(0) // no metric
    })
  })
})