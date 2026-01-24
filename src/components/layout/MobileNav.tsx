'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, PiggyBank, Target, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { name: 'Főoldal', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Napló', icon: Receipt, href: '/transactions' },
    { name: 'Célok', icon: Target, href: '/savings' },
    { name: 'Keretek', icon: PiggyBank, href: '/budgets' },
    { name: 'Analitika', icon: TrendingUp, href: '/analytics' },
]

export function MobileNav() {
    const pathname = usePathname()

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6">
            <div className="mx-auto max-w-md bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl flex items-center justify-around p-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
                                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg transition-colors",
                                isActive ? "bg-primary/10" : "bg-transparent"
                            )}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
