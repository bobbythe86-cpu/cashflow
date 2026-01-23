'use client'

import { useState } from 'react'
import { MessageSquare, Send, X, Lightbulb, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/Textarea'
import { cn } from '@/lib/utils'
import { createSuggestion } from '@/actions/suggestions'

export function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [content, setContent] = useState('')
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!content.trim()) return

        setStatus('submitting')
        const result = await createSuggestion(content)

        if (result.success) {
            setStatus('success')
            setContent('')
            setTimeout(() => {
                setStatus('idle')
                setIsOpen(false)
            }, 3000)
        } else {
            setStatus('error')
            setTimeout(() => setStatus('idle'), 3000)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <div className={cn(
                "mb-4 w-80 overflow-hidden rounded-2xl border bg-card shadow-2xl transition-all duration-300 ease-in-out glass",
                isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95 pointer-events-none"
            )}>
                <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-300" />
                        <span className="font-semibold">Ötletek & Javaslatok</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="p-4">
                    {status === 'success' ? (
                        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                            <p className="font-medium">Köszönjük! Üzenetét megkaptuk.</p>
                            <p className="text-xs text-muted-foreground">Minden visszajelzést elolvasunk.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Van egy jó ötlete az alkalmazáshoz? Írja meg nekünk!
                            </p>
                            <Textarea
                                placeholder="Írja le javaslatát..."
                                value={content}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                                className="min-h-[120px] resize-none glass"
                                required
                            />
                            <Button
                                type="submit"
                                className="w-full gap-2"
                                disabled={status === 'submitting' || !content.trim()}
                            >
                                {status === 'submitting' ? 'Küldés...' : (
                                    <>
                                        Küldés <Send className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95",
                    isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </Button>
        </div>
    )
}
