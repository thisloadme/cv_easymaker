'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ATSScoreIndicator } from './ATSScoreIndicator'
import { Plus, Trash2, Edit2, Check, X, Download, Loader2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import type { ExperienceEntry, EducationEntry, ProjectEntry, PersonalInfo } from '@/types'

interface CVPreviewProps {
  onAnalyzeJobMatch?: () => void
  onGenerateCoverLetter?: () => void
}

interface PreviewData {
  targetRole: string
  personal: PersonalInfo
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: { id: string; name: string; level: string; keywords: string[] }[]
  projects: ProjectEntry[]
}

const defaultData: PreviewData = {
  targetRole: 'General',
  personal: { name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
}

export function CVPreview({ onAnalyzeJobMatch, onGenerateCoverLetter }: CVPreviewProps) {
  const router = useRouter()
  const [cvData, setCvData] = useState<PreviewData>(defaultData)
  const [editing, setEditing] = useState(false)
  const [editSection, setEditSection] = useState<string | null>(null)
  const [tempData, setTempData] = useState<any>(null)
  const [exporting, setExporting] = useState(false)

  // Multi-entry forms
  const [showAddExp, setShowAddExp] = useState(false)
  const [showAddEdu, setShowAddEdu] = useState(false)
  const [showAddProj, setShowAddProj] = useState(false)
  const [newExp, setNewExp] = useState({ role: '', company: '', startDate: '', endDate: '', bullets: '' })
  const [newEdu, setNewEdu] = useState({ school: '', degree: '', year: '' })
  const [newProj, setNewProj] = useState({ name: '', description: '', tech: '', impact: '' })

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cv-preview-data')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setCvData({
          targetRole: parsed.targetRole || 'General',
          personal: parsed.personal || defaultData.personal,
          summary: parsed.summary || '',
          experience: parsed.experience || [],
          education: parsed.education || [],
          skills: parsed.skills || [],
          projects: parsed.projects || [],
        })
      } catch (e) {
        console.error('Failed to parse stored CV data')
      }
    }
  }, [])

  const saveToLocalStorage = (data: PreviewData) => {
    localStorage.setItem('cv-preview-data', JSON.stringify(data))
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: cvData.targetRole,
          personal: JSON.stringify(cvData.personal),
          summary: cvData.summary,
          experience: JSON.stringify(cvData.experience),
          education: JSON.stringify(cvData.education),
          skills: JSON.stringify(cvData.skills),
          projects: JSON.stringify(cvData.projects),
        }),
      })

      if (!res.ok) throw new Error('Failed to save CV')
      const cv = await res.json()

      const exportRes = await fetch(`/api/cv/${cv.id}/export`, { method: 'POST' })
      if (!exportRes.ok) throw new Error('Failed to export PDF')

      const blob = await exportRes.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cvData.personal?.name || 'CV'}_${cvData.targetRole}.pdf`.replace(/[^a-zA-Z0-9_.]/g, '_')
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  // Add entry handlers
  const handleAddExperience = () => {
    if (!newExp.role && !newExp.company) return
    const entry: ExperienceEntry = {
      id: nanoid(),
      company: newExp.company || 'Company',
      role: newExp.role || 'Role',
      startDate: newExp.startDate,
      endDate: newExp.endDate,
      isCurrent: newExp.endDate === '',
      bullets: newExp.bullets ? [newExp.bullets] : [],
    }
    const updated = [...cvData.experience, entry]
    const newCvData = { ...cvData, experience: updated }
    setCvData(newCvData)
    saveToLocalStorage(newCvData)
    setNewExp({ role: '', company: '', startDate: '', endDate: '', bullets: '' })
    setShowAddExp(false)
  }

  const handleAddEducation = () => {
    if (!newEdu.school && !newEdu.degree) return
    const entry: EducationEntry = {
      id: nanoid(),
      school: newEdu.school || 'School',
      degree: newEdu.degree || 'Degree',
      field: '',
      startYear: '',
      endYear: newEdu.year,
      gpa: '',
    }
    const updated = [...cvData.education, entry]
    const newCvData = { ...cvData, education: updated }
    setCvData(newCvData)
    saveToLocalStorage(newCvData)
    setNewEdu({ school: '', degree: '', year: '' })
    setShowAddEdu(false)
  }

  const handleAddProject = () => {
    if (!newProj.name && !newProj.description) return
    const entry: ProjectEntry = {
      id: nanoid(),
      name: newProj.name || 'Project',
      description: newProj.description,
      tech: newProj.tech ? newProj.tech.split(',').map(t => t.trim()) : [],
      impact: newProj.impact,
    }
    const updated = [...cvData.projects, entry]
    const newCvData = { ...cvData, projects: updated }
    setCvData(newCvData)
    saveToLocalStorage(newCvData)
    setNewProj({ name: '', description: '', tech: '', impact: '' })
    setShowAddProj(false)
  }

  return (
    <div className="space-y-6">
      <ATSScoreIndicator score={0} />

      <Card variant="bordered" className="bg-white max-w-[816px] mx-auto shadow-xl">
        <div className="p-8 min-h-[1054px]">
          <header className="mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-display font-bold text-ink mb-2">
                  {cvData.personal?.name || 'Your Name'}
                </h1>
                <p className="text-sm text-muted">
                  {[cvData.personal?.email, cvData.personal?.phone, cvData.personal?.location].filter(Boolean).join(' • ') || 'Email • Phone • Location'}
                </p>
                {(cvData.personal?.linkedin || cvData.personal?.portfolio) && (
                  <p className="text-sm text-muted">
                    {[cvData.personal?.linkedin, cvData.personal?.portfolio].filter(Boolean).join(' • ')}
                  </p>
                )}
              </div>
              <button onClick={() => { setEditSection('personal'); setTempData(cvData.personal); setEditing(true) }} className="p-2 hover:bg-accent-muted rounded-sm">
                <Edit2 className="w-4 h-4 text-muted" />
              </button>
            </div>
          </header>

          {cvData.summary && (
            <section className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-display font-bold uppercase tracking-wider text-ink border-b border-ink pb-1 flex-1">Summary</h2>
                <button onClick={() => { setEditSection('summary'); setTempData(cvData.summary); setEditing(true) }} className="p-1 hover:bg-accent-muted rounded-sm ml-2">
                  <Edit2 className="w-3 h-3 text-muted" />
                </button>
              </div>
              <p className="text-sm font-body text-ink leading-relaxed whitespace-pre-wrap">{cvData.summary}</p>
            </section>
          )}

          <section className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-display font-bold uppercase tracking-wider text-ink border-b border-ink pb-1 flex-1">Experience</h2>
              <button onClick={() => setShowAddExp(!showAddExp)} className="p-1 hover:bg-accent-muted rounded-sm ml-2">
                <Plus className="w-4 h-4 text-accent" />
              </button>
            </div>
            {cvData.experience.length === 0 && !showAddExp && <p className="text-sm text-muted italic">No experience added yet.</p>}
            {cvData.experience.map((exp, idx) => (
              <div key={exp.id || idx} className="mb-4 relative group">
                <button onClick={() => {
                  const updated = cvData.experience.filter(e => e.id !== exp.id)
                  const newCvData = { ...cvData, experience: updated }
                  setCvData(newCvData)
                  saveToLocalStorage(newCvData)
                }} className="absolute -right-2 -top-2 p-1 bg-red-100 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-display font-semibold text-ink">{exp.role}</h3>
                  <span className="text-xs text-muted">{exp.startDate || 'Start'} — {exp.isCurrent ? 'Present' : exp.endDate || 'End'}</span>
                </div>
                <p className="text-xs font-body italic text-muted mb-1">{exp.company}</p>
                {exp.bullets.length > 0 && (
                  <ul className="list-none space-y-1 ml-2">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-xs font-body text-ink flex whitespace-pre-wrap">
                        <span className="mr-2">•</span><span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {showAddExp && (
              <div className="mt-3 p-4 bg-accent-muted/20 rounded-sm space-y-3">
                <Input placeholder="Job Title" value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} />
                <Input placeholder="Company Name" value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} />
                <div className="flex gap-2">
                  <Input placeholder="Start Date" value={newExp.startDate} onChange={e => setNewExp({ ...newExp, startDate: e.target.value })} />
                  <Input placeholder="End Date (or 'Present')" value={newExp.endDate} onChange={e => setNewExp({ ...newExp, endDate: e.target.value })} />
                </div>
                <Textarea placeholder="Key achievements..." value={newExp.bullets} onChange={e => setNewExp({ ...newExp, bullets: e.target.value })} className="min-h-[80px]" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddExperience}>Add</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddExp(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </section>

          <section className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-display font-bold uppercase tracking-wider text-ink border-b border-ink pb-1 flex-1">Education</h2>
              <button onClick={() => setShowAddEdu(!showAddEdu)} className="p-1 hover:bg-accent-muted rounded-sm ml-2">
                <Plus className="w-4 h-4 text-accent" />
              </button>
            </div>
            {cvData.education.length === 0 && !showAddEdu && <p className="text-sm text-muted italic">No education added yet.</p>}
            {cvData.education.map((edu, idx) => (
              <div key={edu.id || idx} className="mb-3 relative group">
                <button onClick={() => {
                  const updated = cvData.education.filter(e => e.id !== edu.id)
                  const newCvData = { ...cvData, education: updated }
                  setCvData(newCvData)
                  saveToLocalStorage(newCvData)
                }} className="absolute -right-2 -top-2 p-1 bg-red-100 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-display font-semibold text-ink">{edu.degree}</h3>
                  <span className="text-xs text-muted">{edu.endYear}</span>
                </div>
                <p className="text-xs font-body italic text-muted">{edu.school}</p>
              </div>
            ))}
            {showAddEdu && (
              <div className="mt-3 p-4 bg-accent-muted/20 rounded-sm space-y-3">
                <Input placeholder="Degree" value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} />
                <Input placeholder="School" value={newEdu.school} onChange={e => setNewEdu({ ...newEdu, school: e.target.value })} />
                <Input placeholder="Year" value={newEdu.year} onChange={e => setNewEdu({ ...newEdu, year: e.target.value })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddEducation}>Add</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddEdu(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </section>

          <section className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-display font-bold uppercase tracking-wider text-ink border-b border-ink pb-1 flex-1">Skills</h2>
            </div>
            {cvData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, idx) => (
                  <span key={skill.id || idx} className="px-3 py-1 text-sm font-ui bg-gray-100 text-ink rounded-sm">{skill.name}</span>
                ))}
              </div>
            ) : <p className="text-sm text-muted italic">No skills added yet.</p>}
          </section>

          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-display font-bold uppercase tracking-wider text-ink border-b border-ink pb-1 flex-1">Projects</h2>
              <button onClick={() => setShowAddProj(!showAddProj)} className="p-1 hover:bg-accent-muted rounded-sm ml-2">
                <Plus className="w-4 h-4 text-accent" />
              </button>
            </div>
            {cvData.projects.length === 0 && !showAddProj && <p className="text-sm text-muted italic">No projects added yet.</p>}
            {cvData.projects.map((proj, idx) => (
              <div key={proj.id || idx} className="mb-3 relative group">
                <button onClick={() => {
                  const updated = cvData.projects.filter(p => p.id !== proj.id)
                  const newCvData = { ...cvData, projects: updated }
                  setCvData(newCvData)
                  saveToLocalStorage(newCvData)
                }} className="absolute -right-2 -top-2 p-1 bg-red-100 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
                <h3 className="text-sm font-display font-semibold text-ink">{proj.name}</h3>
                {proj.tech.length > 0 && <p className="text-xs text-muted mb-1">{proj.tech.join(' • ')}</p>}
                <p className="text-xs font-body text-ink whitespace-pre-wrap">{proj.description}</p>
              </div>
            ))}
            {showAddProj && (
              <div className="mt-3 p-4 bg-accent-muted/20 rounded-sm space-y-3">
                <Input placeholder="Project Name" value={newProj.name} onChange={e => setNewProj({ ...newProj, name: e.target.value })} />
                <Textarea placeholder="Description..." value={newProj.description} onChange={e => setNewProj({ ...newProj, description: e.target.value })} className="min-h-[80px]" />
                <Input placeholder="Technologies (comma separated)" value={newProj.tech} onChange={e => setNewProj({ ...newProj, tech: e.target.value })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddProject}>Add</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddProj(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </Card>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="secondary" onClick={() => router.push('/interview/new')}>Edit CV</Button>
        {onAnalyzeJobMatch && <Button variant="ghost" onClick={onAnalyzeJobMatch}>Analyze Job Match</Button>}
        {onGenerateCoverLetter && <Button variant="ghost" onClick={onGenerateCoverLetter}>Generate Cover Letter</Button>}
        <Button onClick={handleExport} disabled={exporting}>
          {exporting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Exporting...</> : <><Download className="w-4 h-4 mr-2" />Export PDF</>}
        </Button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-semibold">Edit {editSection}</h3>
              <button onClick={() => setEditing(false)} className="p-1 hover:bg-accent-muted rounded-sm"><X className="w-5 h-5" /></button>
            </div>
            {editSection === 'personal' && (
              <div className="space-y-3">
                <Input label="Full Name" value={tempData?.name || ''} onChange={e => setTempData({ ...tempData, name: e.target.value })} />
                <Input label="Email" value={tempData?.email || ''} onChange={e => setTempData({ ...tempData, email: e.target.value })} />
                <Input label="Phone" value={tempData?.phone || ''} onChange={e => setTempData({ ...tempData, phone: e.target.value })} />
                <Input label="Location" value={tempData?.location || ''} onChange={e => setTempData({ ...tempData, location: e.target.value })} />
              </div>
            )}
            {editSection === 'summary' && (
              <Textarea value={tempData || ''} onChange={e => setTempData(e.target.value)} className="min-h-[150px]" />
            )}
            <div className="flex gap-2 mt-4">
              <Button onClick={() => {
                if (editSection === 'personal') {
                  const newCvData = { ...cvData, personal: tempData }
                  setCvData(newCvData)
                  saveToLocalStorage(newCvData)
                } else if (editSection === 'summary') {
                  const newCvData = { ...cvData, summary: tempData }
                  setCvData(newCvData)
                  saveToLocalStorage(newCvData)
                }
                setEditing(false)
              }}>
                <Check className="w-4 h-4 mr-1" />Save
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}