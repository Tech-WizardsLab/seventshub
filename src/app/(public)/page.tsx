import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
            <div className="absolute right-[-80px] top-20 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" />
            <div className="absolute bottom-[-120px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-slate-200/60 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-20">
            <div className="mx-auto max-w-5xl space-y-4 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Connecting sports event organizers with premium sponsors.
              </h1>

              <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-600">
                SEventsHub helps organizers present sponsor-ready opportunities
                with structured data, and helps brands identify the events with
                the strongest fit, reach, and commercial potential.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Organizers
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  One profile
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Upload event, audience, inventory, and company credibility in one place.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Sponsors
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  Better fit
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Discover relevant opportunities without wasting time on noise.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Data
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  Decision-ready
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Reach, attendance, benchmarks, sponsor proof, and audience signals.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Future
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  AI ranking
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Top-fit event recommendations and smarter sponsorship discovery.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="for-organizers" className="mx-auto max-w-7xl px-6 py-20 scroll-mt-28">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                For organizers
              </span>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Register your event, upload the right data, and stop chasing sponsors manually.
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Build a stronger commercial profile with company credibility,
                audience reach, event metrics, and clear sponsorship inventory.
                Your event becomes easier to understand, easier to evaluate, and
                easier to sponsor.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Step 1</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    Company profile
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Step 2</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    Event metrics
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Step 3</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    Sponsor slots
                  </p>
                </div>
              </div>
            </div>

            <div
              id="for-sponsors"
              className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md scroll-mt-28"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                For sponsors
              </span>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Focus only on the events that actually fit your brand.
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-300">
                Instead of reviewing random opportunities, brands will be able to
                signal interest, define what matters, and see the strongest-fit
                events ranked by category, geography, reach, benchmarks, and
                future ROI logic.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-200 hover:bg-white/10">
                  <p className="text-xs text-slate-300">Input</p>
                  <p className="mt-2 text-xl font-semibold">Brand interest</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-200 hover:bg-white/10">
                  <p className="text-xs text-slate-300">Output</p>
                  <p className="mt-2 text-xl font-semibold">Top 10 events</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-200 hover:bg-white/10">
                  <p className="text-xs text-slate-300">Decision</p>
                  <p className="mt-2 text-xl font-semibold">Benchmarks + fit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-y border-slate-200 bg-slate-50 scroll-mt-28"
        >
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="space-y-4">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  How it works
                </span>

                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Structured flow. Better outcomes.
                </h2>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          Organizer uploads company + event
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Track record, reach, audience, sponsor slots.
                        </p>
                      </div>
                    </div>

                    <div className="ml-5 h-8 w-px bg-gradient-to-b from-slate-300 to-slate-100" />

                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          Platform structures the opportunity
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Metrics, benchmarks, credibility, and sponsor fit signals.
                        </p>
                      </div>
                    </div>

                    <div className="ml-5 h-8 w-px bg-gradient-to-b from-blue-300 to-slate-100" />

                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          Sponsor reviews best-fit events
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Top opportunities ranked by brand interest and relevance.
                        </p>
                      </div>
                    </div>

                    <div className="ml-5 h-8 w-px bg-gradient-to-b from-slate-300 to-slate-100" />

                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                        4
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          Inquiry starts the commercial process
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Both sides move into a more informed sponsorship conversation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-100 via-cyan-50 to-slate-100 blur-2xl" />

                <div className="relative space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
                  <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Event dashboard
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Trail Running Event · Madrid
                          </p>
                        </div>

                        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Sponsor-ready
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="text-xs text-slate-500">Attendance</p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">
                            4,500
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="text-xs text-slate-500">Social reach</p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">
                            820K
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="text-xs text-slate-500">Past sponsors</p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">
                            12
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                            <span>Audience fit</span>
                            <span>84%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full w-[84%] rounded-full bg-slate-900 transition-all duration-700" />
                          </div>
                        </div>

                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                            <span>Brand relevance</span>
                            <span>91%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full w-[91%] rounded-full bg-blue-600 transition-all duration-700" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md">
                        <p className="text-sm font-semibold text-slate-900">
                          Organizer profile
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Endurance Sports Group
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Events organized</p>
                            <p className="mt-1 text-base font-semibold text-slate-900">
                              18
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Sponsors served</p>
                            <p className="mt-1 text-base font-semibold text-slate-900">
                              34
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">12m attendance</p>
                            <p className="mt-1 text-base font-semibold text-slate-900">
                              42K
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Social footprint</p>
                            <p className="mt-1 text-base font-semibold text-slate-900">
                              310K
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white transition duration-300 hover:-translate-y-1 hover:shadow-md">
                        <p className="text-sm font-semibold">Sponsor action</p>
                        <p className="mt-2 text-sm text-slate-300">
                          Nutrition brand shortlisted this event and sent an inquiry for:
                        </p>

                        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Slot
                          </p>
                          <p className="mt-2 text-base font-semibold">
                            Finish Line Partner
                          </p>
                          <p className="mt-2 text-sm text-slate-300">
                            Status: Under review
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          What sponsors will see
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Event performance, organizer credibility, fit signals, and available sponsor slots.
                        </p>
                      </div>

                      <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                        Live decision preview
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-12 shadow-sm sm:px-12">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Get started
              </span>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Join the platform.
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Create your account as an organizer or sponsor and start using
                sponsorship data that helps decisions happen faster.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Create account
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}