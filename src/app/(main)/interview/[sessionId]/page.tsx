'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { SECTION_ORDER, SECTION_LABELS, generateSessionId } from '@/lib/interview/questions'
import { ProgressBar } from '@/components/interview/ProgressBar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Plus, Trash2, ChevronLeft, Save } from 'lucide-react'
import { nanoid } from 'nanoid'
import type { RoleCategory, ExperienceEntry, EducationEntry, ProjectEntry, SkillEntry, PersonalInfo } from '@/types'

const ROLE_OPTIONS: { value: RoleCategory; label: string; desc: string }[] = [
  { value: 'engineering', label: 'Engineering', desc: 'Software, DevOps, Data, IT' },
  { value: 'design', label: 'Design', desc: 'UI/UX, Graphic, Product' },
  { value: 'marketing', label: 'Marketing', desc: 'Digital, Content, Brand' },
  { value: 'management', label: 'Management', desc: 'Project, Product, Team Lead' },
]

export default function InterviewPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  const { data: session } = useSession()

  // UI State - all local, no Zustand for form state
  const [step, setStep] = useState<'role' | 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'done'>('role')

  // Personal
  const [personal, setPersonal] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
  })

  // Summary
  const [summary, setSummary] = useState('')

  // Experience
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([])
  const [showExpForm, setShowExpForm] = useState(false)
  const [newExp, setNewExp] = useState({ role: '', company: '', startDate: '', endDate: '', bullets: '' })

  // Education
  const [educations, setEducations] = useState<EducationEntry[]>([])
  const [showEduForm, setShowEduForm] = useState(false)
  const [newEdu, setNewEdu] = useState({ school: '', degree: '', year: '' })

  // Skills
  const [skills, setSkills] = useState<SkillEntry[]>([])
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [newSkill, setNewSkill] = useState<{ name: string; level: SkillEntry['level'] }>({ name: '', level: 'intermediate' as SkillEntry['level'] })

  // Projects
  const [projects, setProjects] = useState<ProjectEntry[]>([])
  const [showProjForm, setShowProjForm] = useState(false)
  const [newProj, setNewProj] = useState({ name: '', description: '', tech: '', impact: '' })

  // Pre-fill from session on mount
  useEffect(() => {
    if (session?.user) {
      setPersonal({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
      })
    }
  }, [session])

  // Handle role selection
  const handleRoleSelect = (role: RoleCategory) => {
    // Save to localStorage for persistence
    localStorage.setItem('cv-interview-role', role)
    setStep('personal')
  }

  // Navigation
  const goNext = () => {
    const steps: typeof step[] = ['role', 'personal', 'summary', 'experience', 'education', 'skills', 'projects', 'done']
    const idx = steps.indexOf(step)
    if (idx < steps.length - 1) {
      setStep(steps[idx + 1])
    }
  }

  const goBack = () => {
    const steps: typeof step[] = ['role', 'personal', 'summary', 'experience', 'education', 'skills', 'projects', 'done']
    const idx = steps.indexOf(step)
    if (idx > 0) {
      setStep(steps[idx - 1])
    }
  }

  // Add entry helpers
  const handleAddExperience = () => {
    if (!newExp.role && !newExp.company) return
    setExperiences([...experiences, {
      id: nanoid(),
      company: newExp.company || 'Company',
      role: newExp.role || 'Role',
      startDate: newExp.startDate,
      endDate: newExp.endDate,
      isCurrent: newExp.endDate === '',
      bullets: newExp.bullets ? [newExp.bullets] : [],
    }])
    setNewExp({ role: '', company: '', startDate: '', endDate: '', bullets: '' })
    setShowExpForm(false)
  }

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id))
  }

  const handleAddEducation = () => {
    if (!newEdu.school && !newEdu.degree) return
    setEducations([...educations, {
      id: nanoid(),
      school: newEdu.school || 'School',
      degree: newEdu.degree || 'Degree',
      field: '',
      startYear: '',
      endYear: newEdu.year,
      gpa: '',
    }])
    setNewEdu({ school: '', degree: '', year: '' })
    setShowEduForm(false)
  }

  const handleRemoveEducation = (id: string) => {
    setEducations(educations.filter(e => e.id !== id))
  }

  const handleAddSkill = () => {
    if (!newSkill.name) return
    setSkills([...skills, {
      id: nanoid(),
      name: newSkill.name,
      level: newSkill.level,
      keywords: [newSkill.name.toLowerCase()],
    }])
    setNewSkill({ name: '', level: 'intermediate' })
    setShowSkillForm(false)
  }

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id))
  }

  const handleAddProject = () => {
    if (!newProj.name && !newProj.description) return
    setProjects([...projects, {
      id: nanoid(),
      name: newProj.name || 'Project',
      description: newProj.description,
      tech: newProj.tech ? newProj.tech.split(',').map(t => t.trim()) : [],
      impact: newProj.impact,
    }])
    setNewProj({ name: '', description: '', tech: '', impact: '' })
    setShowProjForm(false)
  }

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  const handleFinish = () => {
    // Save all data to localStorage for preview
    const cvData = {
      targetRole: localStorage.getItem('cv-interview-role') || 'General',
      personal,
      summary,
      experience: experiences,
      education: educations,
      skills,
      projects,
    }
    localStorage.setItem('cv-preview-data', JSON.stringify(cvData))
    router.push('/preview')
  }

  // Current section index for progress bar
  const sectionForProgress = step === 'done' ? 'projects' : (step === 'role' ? 'personal' : step)
  const currentSectionIndex = SECTION_ORDER.indexOf(sectionForProgress as typeof SECTION_ORDER[number])

  // ==================== ROLE SELECT ====================
  if (step === 'role') {
    return (
      <main className="min-h-screen py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <ProgressBar currentSection={0} className="mb-12" />
          <h1 className="text-4xl font-display font-medium text-ink mb-4">
            What type of role are you targeting?
          </h1>
          <p className="text-muted font-body mb-8">
            This helps us tailor the questions and optimize your CV for the right ATS keywords.
          </p>
          <div className="grid gap-4">
            {ROLE_OPTIONS.map((option) => (
              <Card
                key={option.value}
                variant="bordered"
                className="cursor-pointer hover:border-accent transition-colors"
                onClick={() => handleRoleSelect(option.value)}
              >
                <h3 className="font-display text-xl font-semibold text-ink">{option.label}</h3>
                <p className="text-muted font-body">{option.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    )
  }

  // ==================== PERSONAL ====================
  if (step === 'personal') {
    return (
      <main className="min-h-screen py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <ProgressBar currentSection={currentSectionIndex} className="mb-12" />
          <Card>
            <h2 className="text-xl font-display font-medium text-ink mb-6">Tell us about yourself</h2>
            <div className="space-y-4">
              <Input label="Full Name" value={personal.name} onChange={e => setPersonal({ ...personal, name: e.target.value })} placeholder="As you want it on your CV" />
              <Input label="Email" type="email" value={personal.email} onChange={e => setPersonal({ ...personal, email: e.target.value })} placeholder="Professional email" />
              <Input label="Phone" value={personal.phone} onChange={e => setPersonal({ ...personal, phone: e.target.value })} placeholder="Include country code if international" />
              <Input label="Location" value={personal.location} onChange={e => setPersonal({ ...personal, location: e.target.value })} placeholder="City, Country" />
              <Input label="LinkedIn URL (optional)" value={personal.linkedin} onChange={e => setPersonal({ ...personal, linkedin: e.target.value })} placeholder="linkedin.com/in/yourname" />
              <Input label="Portfolio/Website (optional)" value={personal.portfolio} onChange={e => setPersonal({ ...personal, portfolio: e.target.value })} placeholder="Personal site or GitHub" />
            </div>
            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={goBack}><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
              <Button onClick={goNext} disabled={!personal.name || !personal.email}>Next</Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  // ==================== SUMMARY ====================
  if (step === 'summary') {
    return (
      <main className="min-h-screen py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <ProgressBar currentSection={currentSectionIndex} className="mb-12" />
          <Card>
            <h2 className="text-xl font-display font-medium text-ink mb-2">Professional Summary</h2>
            <p className="text-sm text-muted font-body mb-6">Write a compelling overview of your background, expertise, and what you bring to the role.</p>
            <Textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Example: Senior software engineer with 8+ years of experience building scalable web applications..." className="min-h-[200px] text-base" />
            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={goBack}><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
              <Button onClick={goNext} disabled={summary.length < 50}>Next</Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  // ==================== EXPERIENCE ====================
  if (step === 'experience') {
    return (
      <main className="min-h-screen py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <ProgressBar currentSection={currentSectionIndex} className="mb-12" />
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-display font-medium text-ink">Work Experience</h2>
                <p className="text-sm text-muted font-body">Add your relevant work history</p>
              </div>
              <Button size="sm" onClick={() => setShowExpForm(true)}><Plus className="w-4 h-4 mr-1" />Add</Button>
            </div>

            {experiences.length === 0 && !showExpForm && (
              <p className="text-muted font-body py-8 text-center">No experience added yet. Click "Add" to include your work history.</p>
            )}

            {experiences.map((exp) => (
              <div key={exp.id} className="mb-4 p-4 bg-accent-muted/20 rounded-sm relative group">
                <button onClick={() => handleRemoveExperience(exp.id)} className="absolute top-2 right-2 p-1 bg-red-100 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-display font-semibold text-ink">{exp.role}</h3>
                  <span className="text-sm text-muted">{exp.startDate || 'Start'} — {exp.isCurrent ? 'Present' : exp.endDate || 'End'}</span>
                </div>
                <p className="text-sm font-body italic text-muted mb-2">{exp.company}</p>
                {exp.bullets.length > 0 && (
                  <ul className="space-y-1">
                    {exp.bullets.map((b, i) => <li key={i} className="text-sm font-body text-ink flex"><span className="mr-2">•</span>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}

            {showExpForm && (
              <div className="mt-4 p-4 bg-accent-muted/20 rounded-sm space-y-4">
                <Input placeholder="Job Title" value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} />
                <Input placeholder="Company Name" value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} />
                <div className="flex gap-4">
                  <Input placeholder="Start Date (e.g., Jan 2020)" value={newExp.startDate} onChange={e => setNewExp({ ...newExp, startDate: e.target.value })} />
                  <Input placeholder="End Date (or 'Present')" value={newExp.endDate} onChange={e => setNewExp({ ...newExp, endDate: e.target.value })} />
                </div>
                <Textarea placeholder="Key achievements (use metrics: increased X by Y%, reduced Z, etc.)..." value={newExp.bullets} onChange={e => setNewExp({ ...newExp, bullets: e.target.value })} className="min-h-[100px]" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddExperience}>Add Experience</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowExpForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={goBack}><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
              <Button onClick={goNext}>Next</Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  // ==================== EDUCATION ====================
  if (step === 'education') {
    return (
      <main className="min-h-screen py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <ProgressBar currentSection={currentSectionIndex} className="mb-12" />
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-display font-medium text-ink">Education</h2>
                <p className="text-sm text-muted font-body">Add your educational background</p>
              </div>
              <Button size="sm" onClick={() => setShowEduForm(true)}><Plus className="w-4 h-4 mr-1" />Add</Button>
            </div>

            {educations.length === 0 && !showEduForm && (
              <p className="text-muted font-body py-8 text-center">No education added yet. Click "Add" to include your degrees.</p>
            )}

            {educations.map((edu) => (
              <div key={edu.id} className="mb-4 p-4 bg-accent-muted/20 rounded-sm relative group">
                <button onClick={() => handleRemoveEducation(edu.id)} className="absolute top-2 right-2 p-1 bg-red-100 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-display font-semibold text-ink">{edu.degree}</h3>
                  <span className="text-sm text-muted">{edu.endYear}</span>
                </div>
                <p className="text-sm font-body italic text-muted">{edu.school}</p>
              </div>
            ))}

            {showEduForm && (
              <div className="mt-4 p-4 bg-accent-muted/20 rounded-sm space-y-4">
                <Input placeholder="Degree (e.g., Bachelor of Science)" value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} />
                <Input placeholder="School/University Name" value={newEdu.school} onChange={e => setNewEdu({ ...newEdu, school: e.target.value })} />
                <Input placeholder="Graduation Year" value={newEdu.year} onChange={e => setNewEdu({ ...newEdu, year: e.target.value })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddEducation}>Add Education</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowEduForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={goBack}><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
              <Button onClick={goNext}>Next</Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  // ==================== SKILLS ====================
  if (step === 'skills') {
    return (
      <main className="min-h-screen py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <ProgressBar currentSection={currentSectionIndex} className="mb-12" />
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-display font-medium text-ink">Skills</h2>
                <p className="text-sm text-muted font-body">List your technical and soft skills</p>
              </div>
              <Button size="sm" onClick={() => setShowSkillForm(true)}><Plus className="w-4 h-4 mr-1" />Add</Button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((s) => (
                  <span key={s.id} className="px-3 py-2 bg-gray-100 text-ink rounded-sm text-sm font-ui flex items-center gap-2 group">
                    {s.name} <span className="text-xs text-muted">({s.level})</span>
                    <button onClick={() => handleRemoveSkill(s.id)} className="ml-1 text-red-500 opacity-0 group-hover:opacity-100">×</button>
                  </span>
                ))}
              </div>
            )}

            {showSkillForm && (
              <div className="mt-4 p-4 bg-accent-muted/20 rounded-sm space-y-4">
                <Input placeholder="Skill (e.g., JavaScript, Project Management)" value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} />
                <div>
                  <label className="text-sm font-ui font-medium text-ink mb-2 block">Proficiency Level</label>
                  <div className="flex gap-2">
                    {(['beginner', 'intermediate', 'advanced', 'expert'] as SkillEntry['level'][]).map((level) => (
                      <button key={level} onClick={() => setNewSkill({ ...newSkill, level })} className={`px-3 py-1 rounded-sm text-sm ${newSkill.level === level ? 'bg-accent text-paper' : 'bg-gray-100 text-ink hover:bg-gray-200'}`}>{level}</button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddSkill}>Add Skill</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowSkillForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={goBack}><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
              <Button onClick={goNext} disabled={skills.length === 0}>Next</Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  // ==================== PROJECTS ====================
  if (step === 'projects') {
    return (
      <main className="min-h-screen py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <ProgressBar currentSection={currentSectionIndex} className="mb-12" />
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-display font-medium text-ink">Projects</h2>
                <p className="text-sm text-muted font-body">Add notable projects that showcase your skills</p>
              </div>
              <Button size="sm" onClick={() => setShowProjForm(true)}><Plus className="w-4 h-4 mr-1" />Add</Button>
            </div>

            {projects.length === 0 && !showProjForm && (
              <p className="text-muted font-body py-8 text-center">No projects added yet. Click "Add" to include your notable work.</p>
            )}

            {projects.map((p) => (
              <div key={p.id} className="mb-4 p-4 bg-accent-muted/20 rounded-sm relative group">
                <button onClick={() => handleRemoveProject(p.id)} className="absolute top-2 right-2 p-1 bg-red-100 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
                <h3 className="font-display font-semibold text-ink mb-1">{p.name}</h3>
                {p.tech.length > 0 && <p className="text-sm text-muted mb-2">{p.tech.join(' • ')}</p>}
                <p className="text-sm font-body text-ink whitespace-pre-wrap">{p.description}</p>
                {p.impact && <p className="text-sm text-accent mt-1">Impact: {p.impact}</p>}
              </div>
            ))}

            {showProjForm && (
              <div className="mt-4 p-4 bg-accent-muted/20 rounded-sm space-y-4">
                <Input placeholder="Project Name" value={newProj.name} onChange={e => setNewProj({ ...newProj, name: e.target.value })} />
                <Textarea placeholder="Describe the project, your role, and what you built..." value={newProj.description} onChange={e => setNewProj({ ...newProj, description: e.target.value })} className="min-h-[100px]" />
                <Input placeholder="Technologies used (comma separated)" value={newProj.tech} onChange={e => setNewProj({ ...newProj, tech: e.target.value })} />
                <Input placeholder="Impact/Outcome (optional)" value={newProj.impact} onChange={e => setNewProj({ ...newProj, impact: e.target.value })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddProject}>Add Project</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowProjForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={goBack}><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
              <Button onClick={handleFinish}><Save className="w-4 h-4 mr-1" />Finish & Preview CV</Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  // Fallback
  return (
    <main className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-muted font-body">Loading...</p>
      </div>
    </main>
  )
}