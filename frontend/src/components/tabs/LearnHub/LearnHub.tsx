import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react'
import { lessons } from '@/data/lessons'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function LearnHub() {
  const [activeTrack, setActiveTrack] = useState<'foundational' | 'practitioner' | 'builder'>('foundational')
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({})

  const tracks = [
    { id: 'foundational', name: 'Foundational', description: 'Understand LLM fundamentals — tokens, context, fine-tuning basics' },
    { id: 'practitioner', name: 'Practitioner', description: 'Build practical skills — prompting, RAG, evaluation' },
    { id: 'builder', name: 'Builder', description: 'Engineer production systems — optimization, safety, deployment' }
  ]

  const trackLessons = lessons.filter(l => l.track === activeTrack).sort((a, b) => a.order - b.order)

  const handleQuizSubmit = (lessonId: string, questionIndex: number, optionIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [`${lessonId}-${questionIndex}`]: optionIndex }))
  }

  const toggleLesson = (id: string) => {
    setExpandedLesson(prev => prev === id ? null : id)
  }

  const markLessonComplete = (id: string) => {
    setCompletedLessons(prev => ({ ...prev, [id]: true }))
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-100 section-header">Learn Hub</h1>
        <p className="mt-1 text-sm sm:text-base text-surface-500">Structured tracks from beginner basics to advanced engineering</p>
      </motion.div>

      <div className="flex flex-wrap gap-1.5 sm:gap-3 mb-6">
        {tracks.map(track => (
          <button
            key={track.id}
            onClick={() => setActiveTrack(track.id as 'foundational' | 'practitioner' | 'builder')}
            className={`filter-chip sm:px-4 sm:py-2 ${activeTrack === track.id ? 'filter-chip-active' : ''}`}
          >
            {track.name}
          </button>
        ))}
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-surface-100">
            {tracks.find(t => t.id === activeTrack)?.name} Track
          </h2>
          <div className="text-sm text-surface-500">
            {trackLessons.filter(l => completedLessons[l.id]).length} / {trackLessons.length}
          </div>
        </div>
        <p className="text-surface-500 mb-4 text-sm">
          {tracks.find(t => t.id === activeTrack)?.description}
        </p>

        <div className="space-y-3">
          {trackLessons.map((lesson, index) => (
            <div key={lesson.id} className="glass rounded-lg overflow-hidden">
              <button
                onClick={() => toggleLesson(lesson.id)}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-medium ${
                    completedLessons[lesson.id]
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-surface-800 text-surface-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-surface-100 truncate">{lesson.title}</h3>
                    <p className="text-xs sm:text-sm text-surface-500 truncate">{lesson.content.substring(0, 80)}...</p>
                  </div>
                </div>
                {expandedLesson === lesson.id ? <ChevronDown size={18} className="text-surface-500 shrink-0" /> : <ChevronRight size={18} className="text-surface-500 shrink-0" />}
              </button>

              {expandedLesson === lesson.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-surface-800 p-3 sm:p-4"
                >
                  <div className="max-w-none">
                    <p className="text-surface-400 text-sm">{lesson.content}</p>

                    <div className="mt-4">
                      <h4 className="font-bold text-surface-100 text-sm">Key Points</h4>
                      <ul className="mt-2 space-y-1">
                        {lesson.keyPoints.map((point, i) => (
                          <li key={i} className="text-sm text-surface-400 flex gap-2"><span className="text-cyan-glow mt-0.5">&#8226;</span>{point}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-bold text-surface-100 mb-2 text-sm">Quick Quiz</h4>
                      {lesson.quizQuestions.map((question, qIndex) => (
                        <div key={qIndex} className="mb-4">
                          <p className="font-medium text-surface-100 text-sm">{question.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {question.options.map((option, oIndex) => (
                              <button
                                key={oIndex}
                                onClick={() => handleQuizSubmit(lesson.id, qIndex, oIndex)}
                                className={`p-2 rounded-lg text-left text-sm transition-colors ${
                                  quizAnswers[`${lesson.id}-${qIndex}`] === oIndex
                                    ? 'bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow'
                                    : 'glass hover:bg-white/[0.03]'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-surface-800">
                      <Button onClick={() => markLessonComplete(lesson.id)} variant="primary" size="sm">
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
