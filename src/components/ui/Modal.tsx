'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="bg-paper w-full max-w-lg rounded-sm shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border">
          {title && <h2 className="text-xl font-display font-semibold text-ink">{title}</h2>}
          <button onClick={onClose} className="p-2 hover:bg-accent-muted rounded-sm transition-colors">
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}