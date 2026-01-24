'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getChangelog, UpdateEntry } from '@/actions/changelog'
import { UpdatesModal } from './UpdatesModal'

export function ChangelogBanner() {
    const [isVisible, setIsVisible] = useState(false)
    const [latestUpdate, setLatestUpdate] = useState<UpdateEntry | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        async function fetchUpdates() {
            const data = await getChangelog()
            if (data.length > 0) {
                setLatestUpdate(data[0])

                // Ellenőrizzük, látta-e már a legutóbbi frissítést vagyo bezárta-e a bannert
                const lastSeen = localStorage.getItem('last_seen_update')
                const isDismissed = sessionStorage.getItem('banner_dismissed')

                if (lastSeen !== data[0].id && !isDismissed) {
                    setIsVisible(true)
                }
            }
        }
        fetchUpdates()
    }, [])

    const handleDismiss = () => {
        setIsVisible(false)
        sessionStorage.setItem('banner_dismissed', 'true')
    }

    const handleViewMore = () => {
        setIsModalOpen(true)
        setIsVisible(false) // Ha megnézi, eltűnik a banner
        if (latestUpdate) {
            localStorage.setItem('last_seen_update', latestUpdate.id)
        }
    }

    if (!isVisible || !latestUpdate) return (
        <UpdatesModal externalOpen={isModalOpen} setExternalOpen={setIsModalOpen} />
    )

    return (
        <div className="px-8 mt-4 animate-in slide-in-from-top duration-500">
            <div className="relative group overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-3 sm:p-4 backdrop-blur-md">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-none" />

                <div className="flex items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Megaphone className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-tight">
                                    Új funkció
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium">
                                    {latestUpdate.version}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-foreground">
                                {latestUpdate.title}: <span className="font-medium text-muted-foreground">{latestUpdate.description.substring(0, 100)}...</span>
                            </h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleViewMore}
                            variant="default"
                            size="sm"
                            className="h-9 px-4 rounded-xl shadow-lg shadow-primary/20 text-xs font-bold"
                        >
                            Megnézem
                            <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                        <Button
                            onClick={handleDismiss}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-black/5"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <UpdatesModal externalOpen={isModalOpen} setExternalOpen={setIsModalOpen} />
        </div>
    )
}
