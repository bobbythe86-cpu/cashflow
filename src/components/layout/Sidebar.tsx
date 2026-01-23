'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, PiggyBank, Settings, LogOut, TrendingUp, Repeat, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { logout } from '@/actions/auth'

const menuItems = [
    { name: 'Irányítópult', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Tranzakciók', icon: Receipt, href: '/transactions' },
    { name: 'Rendszeresek', icon: Repeat, href: '/recurring' },
    { name: 'Költségvetés', icon: PiggyBank, href: '/budgets' },
    { name: 'Analitika', icon: TrendingUp, href: '/analytics' },
    { name: 'Beállítások', icon: Settings, href: '/settings' },
]

export function Sidebar({ role }: { role?: string }) {
    const pathname = usePathname()

    const allItems = role === 'admin'
        ? [...menuItems, { name: 'Admin', icon: ShieldCheck, href: '/admin' }]
        : menuItems

    return (
        <div className="hidden lg:flex flex-col w-64 bg-card border-r h-screen sticky top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    CashFlow
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {allItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                            pathname === item.href
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    onClick={async () => await logout()}
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                    <LogOut className="w-5 h-5" />
                    Kijelentkezés
                </Button>
            </div>
        </div>
    )
}
