import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import handumiOverview from "@/public/images/handumi-overview.webp"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
            <div className="flex-1 space-y-6">
              <p className="font-serif text-base leading-relaxed text-foreground">
                Hi, I'm Leonardo Perez, co-founder of{" "}
                <a
                  href="https://www.murobotics.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
                >
                  Mu Robotics
                </a>
                , backed by Founders Inc.
              </p>

              <p className="font-serif text-base leading-relaxed text-foreground">
                My research focuses on{" "}
                <strong className="font-semibold">
                  how reinforcement learning can drive generalization in robotics through agentic policies and world models
                </strong>
                . I'm particularly interested in how robots can leverage experience to continuously improve
                their skills, achieve reliable performance, and generalize across diverse tasks and environments.
              </p>

              <p className="font-serif text-base leading-relaxed text-foreground">
                I also co-founded{" "}
                <a
                  href="https://www.nonhuman.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
                >
                  NONHUMAN
                </a>
                , the first physical AI lab in Peru. We built it from scratch, raising investment and securing
                backing from PUCP's Faculty of Sciences and Engineering. Through this community, we've helped
                talented researchers and engineers develop their skills and advance their careers.
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
              <p className="font-serif text-base leading-relaxed text-foreground">
                I'm always open to meeting people passionate about AI, robotics, and mathematics. Whether you're
                interested in collaboration, research discussions, or just want to connect—feel free to reach out via{" "}
                <a
                  href="mailto:leonardo@murobotics.ai"
                  className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
                >
                  leonardo@murobotics.ai
                </a>{" "}
                or{" "}
                <a
                  href="https://x.com/leoperzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
                >
                  X (Twitter)
                </a>
                .
              </p>
              <p className="font-serif text-base leading-relaxed text-muted-foreground">
                <em>“Specialization is for insects.”</em>
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
                I'm now co-founder of{" "}
                <a
                  href="https://www.murobotics.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
                >
                  Mu Robotics
                </a>
                , backed by Founders Inc.
              </li>
              <li>
                Our paper,{" "}
                <a
                  href="https://murobotics.ai/research/handumi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
                >
                  HandUMI: A Modular Hand-Worn Parallel-Jaw Interface for Robot-Free Bimanual Data Capture
                </a>
                , was accepted at the UMI Arena Workshop at CoRL 2026.
              </li>
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

          <section aria-labelledby="education-heading" className="mt-12">
            <h2 id="education-heading" className="font-sans text-lg text-foreground mb-4">Education</h2>
            <dl className="space-y-5 font-serif text-sm leading-relaxed">
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                <div>
                  <dt className="font-semibold text-foreground">Mathematics — B.Sc. studies</dt>
                  <dd className="text-muted-foreground">Pontificia Universidad Católica del Perú (PUCP)</dd>
                </div>
                <dd className="shrink-0 text-muted-foreground">2023–2026</dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                <div>
                  <dt className="font-semibold text-foreground">Computer Science — B.Sc. studies</dt>
                  <dd className="text-muted-foreground">Pontificia Universidad Católica del Perú (PUCP)</dd>
                </div>
                <dd className="shrink-0 text-muted-foreground">2020–2023</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="research-projects-heading" className="mt-12">
            <h2 id="research-projects-heading" className="font-sans text-lg text-foreground mb-6">
              Research & Projects
            </h2>
            <article className="grid gap-6 border-t border-border pt-6 sm:grid-cols-[240px_minmax(0,1fr)] sm:gap-8">
              <a
                href="https://murobotics.ai/research/handumi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read the HandUMI paper"
                className="self-start overflow-hidden rounded-sm border border-border bg-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <Image
                  src={handumiOverview}
                  alt="HandUMI overview showing the hand-worn capture devices and bimanual robot configurations"
                  sizes="(min-width: 640px) 240px, calc(100vw - 48px)"
                  className="h-auto w-full"
                />
              </a>
              <div className="min-w-0 space-y-3">
                <h3 className="font-sans text-base font-semibold leading-snug text-foreground">
                  <a
                    href="https://murobotics.ai/research/handumi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline underline-offset-4"
                  >
                    HandUMI: A Modular Hand-Worn Parallel-Jaw Interface for Robot-Free Bimanual Data Capture
                  </a>
                </h3>
                <p className="font-serif text-sm leading-relaxed text-muted-foreground">
                  Brik Meza, <strong className="font-semibold text-foreground">Leonardo Perez</strong>, Alvaro Mendoza,
                  Aniela Ubillus, Mitshell Ramos, Raul Bastidas, Mauricio Olivera, Bryan Bastidas
                </p>
                <p className="font-serif text-sm italic leading-relaxed text-foreground">
                  Accepted at the UMI Arena Workshop, CoRL 2026
                </p>
                <p className="font-serif text-sm leading-relaxed text-muted-foreground">
                  A modular, hand-worn interface for collecting bimanual demonstrations without a robot,
                  with swappable fingertips and reusable data across robot platforms.
                </p>
                <ul aria-label="HandUMI resources" className="flex flex-wrap gap-x-5 gap-y-2 font-sans text-sm">
                  {[
                    { label: "Paper", href: "https://murobotics.ai/research/handumi" },
                    { label: "Hardware", href: "https://github.com/murobotics-ai/handumi-hw" },
                    { label: "Software", href: "https://github.com/murobotics-ai/handumi-sw" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 transition-colors hover:text-foreground/70"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  )
}
