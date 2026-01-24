'use client'

import { Wallet, WalletType } from '@/types'
import { Wallet as WalletIcon, Banknote, Landmark, CreditCard, PiggyBank, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { deleteWallet } from '@/actions/wallets'
import { cn } from '@/lib/utils'

interface WalletListProps {
    wallets: Wallet[]
}

const typeIcons: Record<WalletType, React.ElementType> = {
    bank: Landmark,
    cash: Banknote,
    savings: PiggyBank,
    credit: CreditCard,
}

export function WalletList({ wallets }: WalletListProps) {
    async function handleDelete(id: string) {
        if (confirm('Biztosan törölni szeretnéd ezt a tárcát?')) {
            const result = await deleteWallet(id)
            if (result.error) {
                alert(result.error)
            }
        }
    }

    if (wallets.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed">
                <p className="text-muted-foreground italic">Még nincsenek pénztárcáid.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wallets.map((wallet) => {
                const Icon = typeIcons[wallet.type] || WalletIcon
                return (
                    <Card key={wallet.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 glass">
                        <CardContent className="p-0">
                            <div className="p-5 flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "p-3 rounded-2xl",
                                        wallet.type === 'bank' ? "bg-blue-500/10 text-blue-600" :
                                            wallet.type === 'cash' ? "bg-green-500/10 text-green-600" :
                                                wallet.type === 'savings' ? "bg-purple-500/10 text-purple-600" :
                                                    "bg-orange-500/10 text-orange-600"
                                    )}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{wallet.name}</h4>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{wallet.type}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(wallet.id)}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="px-5 pb-5 mt-2">
                                <div className="text-2xl font-black">
                                    {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: wallet.currency }).format(wallet.balance)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
