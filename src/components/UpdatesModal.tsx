'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X, Zap, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getChangelog, UpdateEntry } from '@/actions/changelog'

interface UpdatesModalProps {
    externalOpen?: boolean;
    setExternalOpen?: (open: boolean) => void;
}

export function UpdatesModal({ externalOpen, setExternalOpen }: UpdatesModalProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [updates, setUpdates] = useState<UpdateEntry[]>([])
    const [hasNew, setHasNew] = useState(false)

    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen
    const setIsOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen

    useEffect(() => {
        async function fetchUpdates() {
            const data = await getChangelog()
            setUpdates(data)

            // Ellenőrizzük, látta-e már az utolsó frissítést
            const lastSeen = localStorage.getItem('last_seen_update')
            if (data.length > 0 && lastSeen !== data[0].id) {
                setHasNew(true)
            }
        }
        fetchUpdates()
    }, [])

    const handleOpen = () => {
        setIsOpen(true)
        setHasNew(false)
        if (updates.length > 0) {
            localStorage.setItem('last_seen_update', updates[0].id)
        }
    }

    if (updates.length === 0) return null

    return (
        <>
            {/* Csak akkor mutatjuk a gombot, ha nem kívülről vezéreljük */}
            {externalOpen === undefined && (
                <Button
                    onClick={handleOpen}
                    variant="outline"
                    size="sm"
                    className={cn(
                        "fixed bottom-24 right-6 rounded-full h-12 w-12 p-0 shadow-lg glass border-primary/20 transition-all hover:scale-110 active:scale-95 group",
                        hasNew && "animate-bounce"
                    )}
                >
                    <div className="relative">
                        <Sparkles className={cn("w-5 h-5", hasNew ? "text-primary fill-primary/20" : "text-muted-foreground")} />
                        {hasNew && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                        )}
                    </div>
                </Button>
            )}

            {/* Modal overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-background border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden glass-dark animate-in zoom-in-95 duration-300 border-primary/20">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-primary/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl tracking-tight">Változások</h3>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Fejlesztési napló</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-8 space-y-10 custom-scrollbar">
                            {updates.map((update) => (
                                <div key={update.id} className="relative pl-10 group">
                                    {/* Idővonal szál */}
                                    <div className="absolute left-[13px] top-10 bottom-[-40px] w-[2px] bg-primary/10 group-last:hidden" />

                                    {/* Típus ikon */}
                                    <div className={cn(
                                        "absolute left-0 top-1 p-2 rounded-xl z-10 shadow-sm",
                                        update.type === 'feature' ? "bg-blue-500/10 text-blue-500" :
                                            update.type === 'improvement' ? "bg-green-500/10 text-green-500" :
                                                "bg-orange-500/10 text-orange-500"
                                    )}>
                                        {update.type === 'feature' ? <Zap className="w-4 h-4" /> :
                                            update.type === 'improvement' ? <Zap className="w-4 h-4" /> :
                                                <Bug className="w-4 h-4" />}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-tighter bg-primary/10 text-primary px-2 py-0.5 rounded-md">{update.version}</span>
                                            <span className="text-[10px] text-muted-foreground font-medium">{new Date(update.created_at).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <h4 className="font-extrabold text-lg leading-tight group-hover:text-primary transition-colors">{update.title}</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{update.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-muted/30 border-t border-white/5 flex justify-end">
                            <Button onClick={() => setIsOpen(false)} className="rounded-xl px-10 shadow-lg shadow-primary/20 font-bold">
                                Értem
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
