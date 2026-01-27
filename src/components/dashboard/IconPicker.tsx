'use client'

import {
    Home, Car, UtensilsCrossed, ShoppingCart, Gamepad2, Heart,
    Plane, Gift, Book, Coffee, Shirt, Dumbbell, Stethoscope,
    Briefcase, GraduationCap, Smartphone, Tv, Music, Film,
    Wallet, CreditCard, TrendingUp, PiggyBank, Landmark,
    Tag, Star, Zap, Target, Trophy, Crown, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS = [
    { name: 'Tag', icon: Tag },
    { name: 'Home', icon: Home },
    { name: 'Car', icon: Car },
    { name: 'UtensilsCrossed', icon: UtensilsCrossed },
    { name: 'ShoppingCart', icon: ShoppingCart },
    { name: 'Gamepad2', icon: Gamepad2 },
    { name: 'Heart', icon: Heart },
    { name: 'Plane', icon: Plane },
    { name: 'Gift', icon: Gift },
    { name: 'Book', icon: Book },
    { name: 'Coffee', icon: Coffee },
    { name: 'Shirt', icon: Shirt },
    { name: 'Dumbbell', icon: Dumbbell },
    { name: 'Stethoscope', icon: Stethoscope },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'Smartphone', icon: Smartphone },
    { name: 'Tv', icon: Tv },
    { name: 'Music', icon: Music },
    { name: 'Film', icon: Film },
    { name: 'Wallet', icon: Wallet },
    { name: 'CreditCard', icon: CreditCard },
    { name: 'TrendingUp', icon: TrendingUp },
    { name: 'PiggyBank', icon: PiggyBank },
    { name: 'Landmark', icon: Landmark },
    { name: 'Star', icon: Star },
    { name: 'Zap', icon: Zap },
    { name: 'Target', icon: Target },
    { name: 'Trophy', icon: Trophy },
    { name: 'Crown', icon: Crown },
    { name: 'Sparkles', icon: Sparkles },
]

interface IconPickerProps {
    selectedIcon: string
    onSelectIcon: (icon: string) => void
}

export function IconPicker({ selectedIcon, onSelectIcon }: IconPickerProps) {
    return (
        <div className="grid grid-cols-8 gap-2 p-4 border rounded-lg bg-secondary/20 max-h-[200px] overflow-y-auto">
            {ICONS.map(({ name, icon: Icon }) => (
                <button
                    key={name}
                    type="button"
                    onClick={() => onSelectIcon(name)}
                    className={cn(
                        "p-2 rounded-md hover:bg-primary/10 transition-colors border-2",
                        selectedIcon === name
                            ? "bg-primary/20 border-primary"
                            : "border-transparent"
                    )}
                    title={name}
                >
                    <Icon className="w-5 h-5" />
                </button>
            ))}
        </div>
    )
}
