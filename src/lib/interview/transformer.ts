import type { PersonalInfo, ExperienceEntry, EducationEntry, SkillEntry, ProjectEntry } from '@/types'

// Parse raw answer to structured CV data
export function transformToPersonalInfo(answers: Record<string, string>): PersonalInfo {
  return {
    name: answers['p-name'] || '',
    email: answers['p-email'] || '',
    phone: answers['p-phone'] || '',
    location: answers['p-location'] || '',
    linkedin: answers['p-linkedin'] || '',
    portfolio: answers['p-portfolio'] || '',
  }
}

export function transformToExperience(answers: Record<string, string>): ExperienceEntry {
  return {
    id: '', // ID will be assigned by store
    company: answers['e-company'] || '',
    role: answers['e-role'] || '',
    startDate: '',
    endDate: '',
    isCurrent: answers['e-duration']?.toLowerCase().includes('present'),
    bullets: [
      answers['e-achievement-1'],
      answers['e-achievement-2'],
    ].filter(Boolean),
  }
}

export function transformToEducation(answers: Record<string, string>): EducationEntry {
  return {
    id: '', // ID will be assigned by store
    school: answers['ed-school'] || '',
    degree: answers['ed-degree'] || '',
    field: '',
    startYear: '',
    endYear: answers['ed-year'] || '',
    gpa: answers['ed-gpa'] || '',
  }
}

export function transformToSkill(answers: Record<string, string>): SkillEntry[] {
  const techs = (answers['sk-technologies'] || '').split(',').map((s: string) => s.trim()).filter(Boolean)
  return techs.map((name: string) => ({
    id: '', // ID will be assigned by store
    name,
    level: 'intermediate',
    keywords: [name],
  }))
}

export function transformToProject(answers: Record<string, string>): ProjectEntry {
  return {
    id: '', // ID will be assigned by store
    name: answers['pr-name'] || '',
    description: answers['pr-desc'] || '',
    tech: (answers['pr-tech'] || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    impact: answers['pr-impact'] || '',
  }
}