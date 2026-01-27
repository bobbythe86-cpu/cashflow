import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart3,
  Shield,
  Zap,
  PieChart,
  Smartphone,
  Globe,
  Lock,
  TrendingUp,
  CreditCard,
  Wallet
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link className="flex items-center gap-2 group" href="#">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              CashFlow
            </span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
              Funkciók
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#future">
              Jövőkép
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                Bejelentkezés
              </Button>
            </Link>
            <Button disabled className="bg-muted text-muted-foreground cursor-not-allowed">
              Regisztráció Szünetel
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-48 px-4 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/10 via-background to-background"></div>

          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center animate-fade-in-up">
              <div className="space-y-4 max-w-4xl mx-auto">
                <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                  🚀 A pénzügyi tudatosság új generációja
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                  Pénzügyi Szabadság <br />
                  <span className="text-gradient">Egyetlen Helyen</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl leading-relaxed animation-delay-200 animate-fade-in-up opacity-0">
                  A CashFlow nem csak egy költségkövető. Ez az Te személyes pénzügyi központod.
                  Lásd át, elemezd és optimalizáld pénzügyeidet profi eszközökkel, egyszerűen.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animation-delay-400 animate-fade-in-up opacity-0">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105" disabled>
                  Kérj Értesítést a Nyitásról
                </Button>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full hover:bg-secondary/50 backdrop-blur-sm">
                    Ismerd meg az Appot
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero App Preview Mockup */}
            <div className="mt-20 relative mx-auto max-w-5xl animate-fade-in-up animation-delay-400 opacity-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-20"></div>
              <div className="relative rounded-xl border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="p-8 grid md:grid-cols-3 gap-8">
                  {/* Dashboard Mockup Layout */}
                  <div className="col-span-2 space-y-6">
                    <div className="h-32 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border animate-pulse"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 rounded-lg bg-muted animate-pulse delay-75"></div>
                      <div className="h-24 rounded-lg bg-muted animate-pulse delay-100"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-full rounded-lg bg-muted/50 animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-secondary/30 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter md:text-5xl mb-4">Már Elérhető Funkciók</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Minden, amire szükséged van a napi pénzügyeid kézben tartásához.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<BarChart3 />}
                title="Intuitív Dashboard"
                description="Átlátható grafikonok és kimutatások a bevételeidről és kiadásaidról valós időben."
              />
              <FeatureCard
                icon={<Shield />}
                title="Banki Biztonság"
                description="Adataidat a legmodernebb titkosítási technológiák és RLS (Row Level Security) védi."
              />
              <FeatureCard
                icon={<Zap />}
                title="Gyors Rögzítés"
                description="Adj hozzá tranzakciókat pillanatok alatt, bárhol és bármikor."
              />
              <FeatureCard
                icon={<PieChart />}
                title="Kategória Elemzés"
                description="Lásd pontosan, mire költesz a legtöbbet és hol tudsz spórolni."
              />
              <FeatureCard
                icon={<Wallet />}
                title="Multi-Currency"
                description="Kezeld pénzügyeidet több pénznemben is (HUF, EUR, USD)."
              />
              <FeatureCard
                icon={<TrendingUp />}
                title="Trendek"
                description="Kövesd nyomon vagyonod alakulását havi és éves bontásban."
              />
            </div>
          </div>
        </section>

        {/* Future Roadmap Section */}
        <section id="future" className="w-full py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter md:text-5xl mb-4 text-gradient">A Jövő Pénzügyi Eszközei</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Folyamatosan fejlesztünk. Íme egy kis ízelítő abból, ami hamarosan érkezik.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FutureCard
                icon={<Smartphone />}
                title="Mobil Applikáció"
                description="Dedikált iOS és Android alkalmazás a még kényelmesebb használatért."
              />
              <FutureCard
                icon={<Globe />}
                title="Banki Integráció"
                description="Automatikus tranzakció szinkronizálás a bankszámláiddal (PSD2)."
              />
              <FutureCard
                icon={<Lock />}
                title="Családi Csomag"
                description="Közös kassza kezelése pároknak és családoknak, megosztott jogosultságokkal."
              />
              <FutureCard
                icon={<CreditCard />}
                title="AI Pénzügyi Tanácsadó"
                description="Személyre szabott spórolási tanácsok a mesterséges intelligencia segítségével."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 bg-primary/5 border-t">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Készen állsz a pénzügyi szabadságra?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-xl mb-8">
              Csatlakozz a várólistához és értesülj elsőként, amikor újra megnyitjuk a regisztrációt.
            </p>
            <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl" disabled>
              Feliratkozás a várólistára
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">CashFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 CashFlow Inc. Minden jog fenntartva.</p>
          <nav className="flex gap-6">
            <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">
              Adatvédelem
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">
              Általános Szerződési Feltételek
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="glass border-0 bg-white/5 shadow-lg card-hover">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

function FutureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border border-dashed border-muted-foreground/30 bg-background/50 card-hover">
      <CardHeader>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-3 text-muted-foreground">
          {icon}
        </div>
        <CardTitle className="text-lg text-foreground/80">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
