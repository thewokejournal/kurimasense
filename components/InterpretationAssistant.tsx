'use client'

/**
 * Interpretation Assistant Component
 * Phase 6.2 — Assisted Interpretation (Human-in-the-Loop)
 * 
 * User-invoked interpretation assistant that helps understand inference structure.
 * Hidden by default, revealed via explicit user action.
 * Assistant has ZERO authority - only restates, defines, or explains stored fields.
 */

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { HelpCircle, X, Send } from 'lucide-react'
import { getInterpretation, type InterpretationResponse } from '@/app/lib/api'

interface InterpretationAssistantProps {
  analysisRunId: string | null
  isOpen: boolean
  onClose: () => void
}

export default function InterpretationAssistant({
  analysisRunId,
  isOpen,
  onClose,
}: InterpretationAssistantProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !analysisRunId || isLoading) {
      return
    }

    const userQuery = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userQuery }])
    setIsLoading(true)

    try {
      const result: InterpretationResponse = await getInterpretation(analysisRunId, userQuery)
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }])
    } catch (error) {
      console.error('Failed to get interpretation:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I encountered an error. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] bg-card border border-border-subtle rounded-lg shadow-lg z-50 flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 opacity-60" />
          <h3 className="font-semibold text-sm text-primary">Interpretation Helper</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-surface-soft rounded transition-colors"
          aria-label="Close assistant"
        >
          <X className="w-4 h-4 opacity-60" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-sm text-muted">
            <p className="mb-2">I can help you understand what the stored inference fields mean.</p>
            <p className="text-xs opacity-70">I can explain fields like status, trend, confidence, and categories.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-surface-soft text-primary'
                  : 'bg-surface-soft border border-border-subtle text-primary'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-soft border border-border-subtle rounded-lg p-3 text-sm text-muted">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border-subtle">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about inference fields..."
            className="flex-1 px-3 py-2 text-sm bg-surface border border-border-subtle rounded focus:outline-none focus:ring-1 focus:ring-border-subtle"
            disabled={isLoading || !analysisRunId}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || !analysisRunId}
            className="px-4 py-2 bg-surface-soft border border-border-subtle rounded hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted mt-2 opacity-70">
          I can explain stored fields, but I don't determine causes or recommend actions.
        </p>
      </div>
    </div>
  )
}

