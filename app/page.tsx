import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Mountain, Filter, CheckCircle, Ruler, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#1a3a2f] to-[#364d6b] px-4 py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl text-balance">
            Every place. Every trail. One list.
          </h1>
          <p className="max-w-xl text-lg text-white/70 md:text-xl text-pretty">
            Track the cities you want to explore and the trails you want to hike.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild className="bg-white text-[#1a3a2f] hover:bg-white/90">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Places Card */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="text-2xl" aria-hidden="true">📍</span>
                  Places
                </CardTitle>
                <CardDescription>
                  Build your travel bucket list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">Save cities and landmarks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Filter className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">Filter by category</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">Track visits</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Trails Card */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="text-2xl" aria-hidden="true">🥾</span>
                  Trails
                </CardTitle>
                <CardDescription>
                  Conquer your hiking goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Ruler className="mt-0.5 size-5 shrink-0 text-accent" />
                    <span className="text-muted-foreground">Log hikes by distance and elevation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BarChart3 className="mt-0.5 size-5 shrink-0 text-accent" />
                    <span className="text-muted-foreground">Filter by difficulty</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mountain className="mt-0.5 size-5 shrink-0 text-accent" />
                    <span className="text-muted-foreground">Record completions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/60 px-4 py-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm text-muted-foreground">Wander List © 2025</p>
        </div>
      </footer>
    </div>
  );
}
