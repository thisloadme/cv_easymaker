import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RoleCategory, PersonalInfo, ExperienceEntry, EducationEntry, SkillEntry, ProjectEntry } from '@/types'

interface InterviewState {
  // Session
  sessionId: string | null
  role: RoleCategory | null
  targetRole: string
  currentSection: number
  isComplete: boolean

  // CV Data
  personal: PersonalInfo | null
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: SkillEntry[]
  projects: ProjectEntry[]

  // ATS
  atsScore: number

  // Actions
  setSession: (id: string, role: RoleCategory, targetRole: string) => void
  setPersonal: (data: PersonalInfo) => void
  setSummary: (text: string) => void
  addExperience: (entry: ExperienceEntry) => void
  updateExperience: (id: string, entry: Partial<ExperienceEntry>) => void
  removeExperience: (id: string) => void
  addEducation: (entry: EducationEntry) => void
  updateEducation: (id: string, entry: Partial<EducationEntry>) => void
  removeEducation: (id: string) => void
  addSkill: (entry: SkillEntry) => void
  updateSkill: (id: string, entry: Partial<SkillEntry>) => void
  removeSkill: (id: string) => void
  addProject: (entry: ProjectEntry) => void
  updateProject: (id: string, entry: Partial<ProjectEntry>) => void
  removeProject: (id: string) => void
  nextSection: () => void
  prevSection: () => void
  completeInterview: () => void
  reset: () => void
}

const initialState = {
  sessionId: null,
  role: null,
  targetRole: '',
  currentSection: 0,
  isComplete: false,
  personal: null,
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  atsScore: 0,
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      ...initialState,

      setSession: (id, role, targetRole) => set({ sessionId: id, role, targetRole }),

      setPersonal: (data) => set({ personal: data }),
      setSummary: (text) => set({ summary: text }),

      addExperience: (entry) => set((state) => ({ experience: [...state.experience, entry] })),
      updateExperience: (id, entry) => set((state) => ({
        experience: state.experience.map((e) => e.id === id ? { ...e, ...entry } : e),
      })),
      removeExperience: (id) => set((state) => ({
        experience: state.experience.filter((e) => e.id !== id),
      })),

      addEducation: (entry) => set((state) => ({ education: [...state.education, entry] })),
      updateEducation: (id, entry) => set((state) => ({
        education: state.education.map((e) => e.id === id ? { ...e, ...entry } : e),
      })),
      removeEducation: (id) => set((state) => ({
        education: state.education.filter((e) => e.id !== id),
      })),

      addSkill: (entry) => set((state) => ({ skills: [...state.skills, entry] })),
      updateSkill: (id, entry) => set((state) => ({
        skills: state.skills.map((s) => s.id === id ? { ...s, ...entry } : s),
      })),
      removeSkill: (id) => set((state) => ({
        skills: state.skills.filter((s) => s.id !== id),
      })),

      addProject: (entry) => set((state) => ({ projects: [...state.projects, entry] })),
      updateProject: (id, entry) => set((state) => ({
        projects: state.projects.map((p) => p.id === id ? { ...p, ...entry } : p),
      })),
      removeProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      })),

      nextSection: () => set((state) => ({ currentSection: state.currentSection + 1 })),
      prevSection: () => set((state) => ({ currentSection: Math.max(0, state.currentSection - 1) })),
      completeInterview: () => set({ isComplete: true }),
      reset: () => set(initialState),
    }),
    {
      name: 'cv-generator-interview',
      partialize: (state) => ({
        sessionId: state.sessionId,
        role: state.role,
        targetRole: state.targetRole,
        currentSection: state.currentSection,
        isComplete: state.isComplete,
        personal: state.personal,
        summary: state.summary,
        experience: state.experience,
        education: state.education,
        skills: state.skills,
        projects: state.projects,
      }),
    }
  )
)