import { describe, it, expect } from 'vitest'
import { calculateATSScore } from '@/lib/ats/analyzer'
import type { ParsedCV } from '@/types'

describe('ATS analyzer', () => {
  describe('calculateATSScore', () => {
    it('returns score between 0 and 100', () => {
      const cv: ParsedCV = {
        id: 'test',
        userId: null,
        targetRole: 'Software Engineer',
        status: 'draft',
        personal: { name: 'John', email: 'john@test.com', phone: '123', location: 'NYC', linkedin: '', portfolio: '' },
        summary: 'Experienced engineer with 5 years of experience in JavaScript and React.',
        experience: [{
          id: '1',
          company: 'Test Corp',
          role: 'Engineer',
          startDate: '2020',
          endDate: '2024',
          isCurrent: false,
          bullets: ['Increased performance by 35%', 'Reduced load time by 50%'],
        }],
        education: [{
          id: '1',
          school: 'Test University',
          degree: 'BS Computer Science',
          field: '',
          startYear: '2015',
          endYear: '2019',
          gpa: '',
        }],
        skills: [{
          id: '1',
          name: 'JavaScript',
          level: 'advanced',
          keywords: ['javascript'],
        }],
        projects: [],
        atsScore: 0,
        atsKeywords: [],
        atsMissingKeywords: [],
        lastExportedAt: null,
        exportFormat: null,
        shareSlug: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const analysis = calculateATSScore(cv)
      expect(analysis.totalScore).toBeGreaterThanOrEqual(0)
      expect(analysis.totalScore).toBeLessThanOrEqual(100)
    })

    it('returns missing keywords for engineering role', () => {
      const cv: ParsedCV = {
        id: 'test',
        userId: null,
        targetRole: 'Engineer',
        status: 'draft',
        personal: { name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        atsScore: 0,
        atsKeywords: [],
        atsMissingKeywords: [],
        lastExportedAt: null,
        exportFormat: null,
        shareSlug: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const analysis = calculateATSScore(cv)
      expect(analysis.missingKeywords.length).toBeGreaterThan(0)
    })

    it('has recommendations when score is low', () => {
      const cv: ParsedCV = {
        id: 'test',
        userId: null,
        targetRole: 'Engineer',
        status: 'draft',
        personal: { name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        atsScore: 0,
        atsKeywords: [],
        atsMissingKeywords: [],
        lastExportedAt: null,
        exportFormat: null,
        shareSlug: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const analysis = calculateATSScore(cv)
      expect(analysis.recommendations.length).toBeGreaterThan(0)
    })

    it('awards higher score for complete CV with metrics', () => {
      const completeCV: ParsedCV = {
        id: 'complete',
        userId: null,
        targetRole: 'Engineer',
        status: 'draft',
        personal: { name: 'Jane Doe', email: 'jane@example.com', phone: '123456', location: 'SF', linkedin: 'linkedin.com/in/jane', portfolio: '' },
        summary: 'Senior engineer with 7 years of experience building scalable web applications using JavaScript, React, and Node.js.',
        experience: [{
          id: '1',
          company: 'Tech Corp',
          role: 'Senior Engineer',
          startDate: '2020',
          endDate: 'Present',
          isCurrent: true,
          bullets: [
            'Led migration to microservices architecture, reducing deployment time 60%',
            'Built real-time dashboard processing 1M+ events daily',
            'Mentored team of 5 junior developers',
          ],
        }],
        education: [{
          id: '1',
          school: 'MIT',
          degree: 'BS Computer Science',
          field: '',
          startYear: '2010',
          endYear: '2014',
          gpa: '3.8',
        }],
        skills: [
          { id: '1', name: 'JavaScript', level: 'expert', keywords: ['javascript'] },
          { id: '2', name: 'React', level: 'expert', keywords: ['react'] },
          { id: '3', name: 'Node.js', level: 'advanced', keywords: ['nodejs'] },
          { id: '4', name: 'SQL', level: 'advanced', keywords: ['sql'] },
        ],
        projects: [],
        atsScore: 0,
        atsKeywords: [],
        atsMissingKeywords: [],
        lastExportedAt: null,
        exportFormat: null,
        shareSlug: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const analysis = calculateATSScore(completeCV)
      expect(analysis.totalScore).toBeGreaterThan(70)
    })
  })
})