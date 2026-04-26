// Placeholder - full types created by backend-specialist
export type User = { id: string; email: string; name?: string | null; image?: string | null }
export type CV = { id: string; targetRole: string; personal: unknown; summary: string; experience: unknown; education: unknown; skills: unknown; projects: unknown; atsScore: number }

// Role categories for interview targeting
export type RoleCategory = 'engineering' | 'design' | 'marketing' | 'management'

// Question transformation types
export type TransformType = 'paragraph' | 'bullet' | 'list' | 'date'

// Question from interview flow
export interface Question {
  id: string
  category: 'warmup' | 'experience' | 'achievement' | 'skill' | 'project'
  text: string
  hint?: string
  transform: TransformType
  required: boolean
  followUp?: string[]
}

// Personal info section
export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  portfolio: string
}

// Experience entry
export interface ExperienceEntry {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  isCurrent: boolean
  bullets: string[]
}

// Education entry
export interface EducationEntry {
  id: string
  school: string
  degree: string
  field: string
  startYear: string
  endYear: string
  gpa: string
}

// Skill entry
export interface SkillEntry {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  keywords: string[]
}

// Project entry
export interface ProjectEntry {
  id: string
  name: string
  description: string
  tech: string[]
  impact: string
}

// ParsedCV - internal type used by ATS engine and PDF export
export interface ParsedCV {
  id: string
  userId: string | null
  targetRole: string
  status: 'draft' | 'published' | 'archived'
  personal: {
    name: string
    email: string
    phone: string
    location: string
    linkedin?: string
    portfolio?: string
  }
  summary: string
  experience: Array<{
    role: string
    company: string
    startDate: string
    endDate?: string
    isCurrent: boolean
    bullets: string[]
  }>
  education: Array<{
    degree: string
    school: string
    endYear: string
    gpa?: string
  }>
  skills: Array<{
    name: string
  }>
  projects: Array<{
    name: string
    description: string
    tech: string[]
    impact?: string
  }>
  atsScore: number
  atsKeywords: string[]
  atsMissingKeywords: string[]
  lastExportedAt: Date | null
  exportFormat: string | null
  shareSlug: string | null
  createdAt: Date
  updatedAt: Date
}

// ATS Analysis types
export interface ATSAnalysis {
  totalScore: number
  breakdown: {
    format: number
    keywords: number
    contact: number
    completeness: number
    bullets: number
    fileFormat: number
  }
  missingKeywords: string[]
  overusedKeywords: string[]
  recommendations: string[]
}