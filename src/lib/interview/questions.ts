import type { Question, RoleCategory } from '@/types'

// Section order for interview
export const SECTION_ORDER = [
  'personal',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
] as const

export type SectionName = typeof SECTION_ORDER[number]

export const SECTION_LABELS: Record<SectionName, string> = {
  personal: 'Personal Info',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
}

// Questions per role category
const engineeringQuestions: Record<SectionName, Question[]> = {
  personal: [
    {
      id: 'p-name',
      category: 'warmup',
      text: 'What is your full name?',
      hint: 'As you want it to appear on your CV',
      transform: 'paragraph',
      required: true,
    },
    {
      id: 'p-email',
      category: 'warmup',
      text: 'What is your email address?',
      hint: 'Professional email preferred',
      transform: 'paragraph',
      required: true,
    },
    {
      id: 'p-phone',
      category: 'warmup',
      text: 'What is your phone number?',
      hint: 'Include country code if applying internationally',
      transform: 'paragraph',
      required: false,
    },
    {
      id: 'p-location',
      category: 'warmup',
      text: 'Where are you located?',
      hint: 'City, Country (e.g., Jakarta, Indonesia)',
      transform: 'paragraph',
      required: true,
    },
    {
      id: 'p-linkedin',
      category: 'warmup',
      text: 'LinkedIn profile URL (optional)',
      hint: 'linkedin.com/in/yourname',
      transform: 'paragraph',
      required: false,
    },
    {
      id: 'p-portfolio',
      category: 'warmup',
      text: 'Portfolio or personal website (optional)',
      hint: 'GitHub, personal site, or relevant project links',
      transform: 'paragraph',
      required: false,
    },
  ],
  summary: [
    {
      id: 's-summary',
      category: 'experience',
      text: 'Describe your professional background in 2-3 sentences.',
      hint: 'Focus on your expertise, years of experience, and what you bring to the role',
      transform: 'paragraph',
      required: true,
      followUp: [
        'What is your most significant technical achievement?',
        'What technologies or domains are you strongest in?',
      ],
    },
  ],
  experience: [
    {
      id: 'e-company',
      category: 'experience',
      text: 'What is the company name?',
      hint: 'Full official name or commonly known name',
      transform: 'paragraph',
      required: true,
    },
    {
      id: 'e-role',
      category: 'experience',
      text: 'What was your role/title?',
      hint: 'Exact title at the company',
      transform: 'paragraph',
      required: true,
    },
    {
      id: 'e-duration',
      category: 'experience',
      text: 'When did you work here? (start and end dates)',
      hint: 'Format: MM/YYYY to MM/YYYY, or "Present" for current',
      transform: 'date',
      required: true,
    },
    {
      id: 'e-achievement-1',
      category: 'achievement',
      text: 'Describe a key achievement or responsibility.',
      hint: 'Focus on measurable impact: reduced X by Y%, improved Z by W%',
      transform: 'bullet',
      required: true,
      followUp: [
        'What was the quantitative outcome?',
        'What tools or technologies did you use?',
      ],
    },
    {
      id: 'e-achievement-2',
      category: 'achievement',
      text: 'Describe another achievement (or type "skip" to move on)',
      hint: 'Try to include at least one metric or number',
      transform: 'bullet',
      required: false,
    },
  ],
  education: [
    {
      id: 'ed-school',
      category: 'warmup',
      text: 'What is the school or university name?',
      hint: 'Full official name',
      transform: 'paragraph',
      required: true,
    },
    {
      id: 'ed-degree',
      category: 'warmup',
      text: 'What degree did you obtain?',
      hint: 'e.g., Bachelor of Science in Computer Science',
      transform: 'paragraph',
      required: true,
    },
    {
      id: 'ed-year',
      category: 'warmup',
      text: 'When did you graduate or expect to graduate?',
      hint: 'Year only (e.g., 2020)',
      transform: 'date',
      required: true,
    },
    {
      id: 'ed-gpa',
      category: 'warmup',
      text: 'GPA (optional)',
      hint: 'If notable, e.g., 3.8/4.0 or magna cum laude',
      transform: 'paragraph',
      required: false,
    },
  ],
  skills: [
    {
      id: 'sk-technologies',
      category: 'skill',
      text: 'List your key technical skills and technologies.',
      hint: 'Languages, frameworks, tools, cloud platforms. Separate with commas.',
      transform: 'list',
      required: true,
    },
    {
      id: 'sk-level',
      category: 'skill',
      text: 'What is your proficiency level for your top skill?',
      hint: 'Options: beginner, intermediate, advanced, expert',
      transform: 'list',
      required: true,
    },
  ],
  projects: [
    {
      id: 'pr-name',
      category: 'project',
      text: 'Project name?',
      hint: 'What was the project called?',
      transform: 'paragraph',
      required: true,
    },
    {
      id: 'pr-desc',
      category: 'project',
      text: 'Describe what the project does and your role.',
      hint: 'Focus on what you built, not just what the project is',
      transform: 'paragraph',
      required: true,
    },
    {
      id: 'pr-tech',
      category: 'project',
      text: 'What technologies were used?',
      hint: 'List the main technologies, frameworks, or tools',
      transform: 'list',
      required: true,
    },
    {
      id: 'pr-impact',
      category: 'project',
      text: 'What was the measurable impact or outcome?',
      hint: 'If hard to quantify, describe the significance or what you learned',
      transform: 'paragraph',
      required: false,
    },
  ],
}

// Use same questions for all roles in MVP
const roleQuestionMap: Record<RoleCategory, Record<SectionName, Question[]>> = {
  engineering: engineeringQuestions,
  design: engineeringQuestions,
  marketing: engineeringQuestions,
  management: engineeringQuestions,
}

export function getQuestions(role: RoleCategory, section: SectionName): Question[] {
  return roleQuestionMap[role]?.[section] || roleQuestionMap.engineering[section]
}

export function getTotalSections(role: RoleCategory): number {
  return SECTION_ORDER.length
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}