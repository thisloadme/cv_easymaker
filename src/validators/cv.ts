import { z } from 'zod'

export const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  photoUrl: z.string().url().optional(),
})

export const experienceEntrySchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  isCurrent: z.boolean(),
  bullets: z.array(z.string()),
})

export const educationEntrySchema = z.object({
  id: z.string(),
  school: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().optional(),
  startYear: z.string(),
  endYear: z.string(),
  gpa: z.string().optional(),
})

export const skillEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  keywords: z.array(z.string()),
})

export const projectEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  tech: z.array(z.string()),
  url: z.string().url().optional(),
  impact: z.string(),
})

export const createCVSchema = z.object({
  targetRole: z.string().min(1),
  personal: personalInfoSchema,
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  experience: z.array(experienceEntrySchema),
  education: z.array(educationEntrySchema),
  skills: z.array(skillEntrySchema),
  projects: z.array(projectEntrySchema).optional(),
})