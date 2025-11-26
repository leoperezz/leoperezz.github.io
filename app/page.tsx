import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground">Leonardo Pérez</h1>

          <div className="mt-8 space-y-6">
            <p className="max-w-2xl font-serif text-base leading-relaxed text-muted-foreground">
              Hi, I'm Leonardo. I'm currently studying mathematics at the Pontificia Universidad Católica del Perú
              (PUCP), with a deep interest in the theoretical foundations of artificial intelligence and robotics.
            </p>

            <p className="max-w-2xl font-serif text-base leading-relaxed text-muted-foreground">
              My research focuses on Embodied AI—systems that learn and reason through physical interaction with the
              world. I believe that understanding intelligence requires a synthesis of pure mathematics, computational
              theory, and empirical robotics.
            </p>

            {/* // Added NONHUMAN link, removed Technical Proficiencies */}
            <p className="max-w-2xl font-serif text-base leading-relaxed text-foreground font-medium">
              I'm currently founding one of the first Embodied AI laboratories in Latin America:{" "}
              <a
                href="https://www.nonhuman.site"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                NONHUMAN
              </a>
              —aiming to advance research in embodied artificial intelligence across the region.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
