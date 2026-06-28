import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
            <div className="flex-1 space-y-6">
              <p className="font-serif text-base leading-relaxed text-foreground">
                Hi, I'm Leo Perez. I'm currently studying mathematics at the Pontificia Universidad Católica del Perú
                (PUCP), with a deep interest in the theoretical foundations of artificial intelligence and robotics.
              </p>

              <p className="font-serif text-base leading-relaxed text-foreground">
              I am interested in understanding how a single model can acquire skills as different as doing laundry and playing table tennis. While these tasks require vastly different capabilities, humans perform both seamlessly using the same brain.
              </p>

              <p className="font-serif text-base leading-relaxed text-foreground">
                I'm currently founding one of the first Embodied AI laboratories in Latin America:{" "}
                <a
                  href="https://www.nonhuman.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
                >
                  NONHUMAN
                </a>
                —aiming to advance research in embodied artificial intelligence across the region.
              </p>

              <p className="font-serif text-base leading-relaxed text-foreground">
                I also enjoy writing technical blogs—{" "}
                <a
                  href="/blogs"
                  className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
                >
                  check them out here
                </a>
                .
              </p>
            </div>

            <div className="shrink-0 mx-auto sm:ml-auto sm:mr-0">
              <Image
                src="/Personal.jpeg"
                alt="Leonardo Pérez"
                width={480}
                height={624}
                priority
                className="w-56 sm:w-72 h-auto object-cover object-top"
              />
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-sans text-lg text-foreground mb-4">Recent News</h2>
            <ul className="list-disc space-y-2 pl-5 font-serif text-base leading-relaxed text-foreground">
              <li>
                <a
                  href="https://www.nonhuman.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
                >
                  NONHUMAN
                </a>{" "}
                won 1st place in Track 1: Logistics Picking at WBCD 2026 (Vienna), part of ICRA 2026.
              </li>
            </ul>
          </div>

          <div className="mt-12">
            <h2 className="font-sans text-lg text-foreground mb-4">Get in Touch</h2>
            <p className="font-serif text-base leading-relaxed text-foreground">
              I'm always open to meeting people passionate about AI, robotics, and mathematics. Whether you're
              interested in collaboration, research discussions, or just want to connect—feel free to reach out via{" "}
              <a
                href="mailto:leonardo.perezn@pucp.edu.pe"
                className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
              >
                email
              </a>{" "}
              or{" "}
              <a
                href="https://x.com/keverwww"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
              >
                X (Twitter)
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
