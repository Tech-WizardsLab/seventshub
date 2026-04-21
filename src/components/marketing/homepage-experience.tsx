"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const logoNames = [
  "Coca-Cola",
  "Red Bull",
  "Nike",
  "Garmin",
  "Maurten",
  "Adidas",
  "Puma",
  "Oakley",
];

const sponsorRecommendations = [
  {
    name: "Madrid Trail Run",
    fit: "92%",
    reach: "820K",
    attendance: "4.5K",
    roi: "High",
  },
  {
    name: "Barcelona Marathon",
    fit: "89%",
    reach: "1.2M",
    attendance: "9.1K",
    roi: "High",
  },
  {
    name: "Valencia Triathlon",
    fit: "86%",
    reach: "610K",
    attendance: "3.2K",
    roi: "Strong",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Sponsor brief",
    description: "Budget, goals, markets, audience, and campaign priorities.",
  },
  {
    step: "02",
    title: "Opportunity intelligence",
    description:
      "We structure event metrics, fit signals, benchmarks, and commercial logic.",
  },
  {
    step: "03",
    title: "Strategic shortlist",
    description:
      "You receive a curated sponsorship plan with expected outcomes and allocation logic.",
  },
  {
    step: "04",
    title: "Execution support",
    description:
      "We help move from recommendation to negotiation, approval, and deal execution.",
  },
];

export function HomepageExperience() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-[-10rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-blue-200/30 blur-3xl"
          animate={{ x: [0, 24, 0], y: [0, 14, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-10rem] top-24 h-[26rem] w-[26rem] rounded-full bg-cyan-200/30 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 20, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-8rem] left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl"
          animate={{ y: [0, -16, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* SECTION 1 */}
      <section className="relative overflow-hidden border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pb-24 md:pt-24">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm backdrop-blur"
            >
              Sponsorship Strategy Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
              className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl"
            >
              <span className="relative inline-block">
                AI, metrics, and structure
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/25 to-transparent"
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    repeatDelay: 1.4,
                    ease: "easeInOut",
                  }}
                />
              </span>
              <span className="block bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
                for smarter sponsorship decisions.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
              className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl"
            >
              We help brands allocate sponsorship budgets with more confidence,
              compare the right sports properties, and execute stronger deals
              through a premium data-led platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/register"
                className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition duration-200 hover:-translate-y-0.5 hover:opacity-95"
              >
                Create account
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-700 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-100"
              >
                Login
              </Link>
            </motion.div>
          </div>

          <div className="relative mt-16 md:mt-20">
            <div className="absolute inset-x-0 top-8 mx-auto h-[28rem] max-w-5xl rounded-[3rem] bg-gradient-to-br from-blue-100/60 via-cyan-50/50 to-white blur-3xl" />

            <div className="relative mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.95fr_1.1fr_0.95fr]">
              {/* LEFT CARD */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                whileHover={{ y: -8, rotateX: 3, rotateY: -5 }}
                className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_50px_-20px_rgba(15,23,42,0.35)] backdrop-blur"
                style={{ transformStyle: "preserve-3d" }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Investment structure
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-semibold text-slate-950">€100K</p>
                    <p className="mt-1 text-sm text-slate-600">
                      budget orchestration
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Active plan
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    ["Endurance events", "55%"],
                    ["Premium activations", "30%"],
                    ["High-ROI tests", "15%"],
                  ].map(([label, value], index) => (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                        <span>{label}</span>
                        <span>{value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-slate-900 to-blue-600"
                          initial={{ width: 0 }}
                          animate={{ width: value }}
                          transition={{
                            duration: 0.9,
                            delay: 0.45 + index * 0.08,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CENTER CARD */}
              <motion.div
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.26, ease: "easeOut" }}
                whileHover={{ y: -8, rotateX: 3 }}
                className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_30px_90px_-28px_rgba(15,23,42,0.3)] backdrop-blur"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_28%)]" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Strategy engine
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-slate-950">
                        Sponsorship Intelligence Layer
                      </p>
                    </div>
                    <div className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Live analysis
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[
                      ["AI Match", "91%", "brand-event fit"],
                      ["Projected Reach", "6.8M", "portfolio view"],
                      ["Expected ROI", "High", "validated logic"],
                    ].map(([label, value, note], index) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.45,
                          delay: 0.38 + index * 0.08,
                        }}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {label}
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-slate-950">
                          {value}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{note}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-slate-950 via-blue-700 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: "88%" }}
                      transition={{
                        duration: 1.3,
                        delay: 0.45,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* RIGHT CARD */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.22, ease: "easeOut" }}
                whileHover={{ y: -8, rotateX: 3, rotateY: 5 }}
                className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5 text-white shadow-[0_18px_50px_-20px_rgba(15,23,42,0.45)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Strategic support
                </p>

                <p className="mt-4 text-3xl font-semibold">Hand-in-hand guidance</p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  We don’t just surface opportunities. We help brands interpret
                  them, compare them, and move toward stronger sponsorship decisions.
                </p>

                <div className="mt-5 space-y-2">
                  {[
                    "Opportunity ranking",
                    "Fit analysis",
                    "Budget logic",
                    "Execution support",
                  ].map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.45 + index * 0.07,
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section
        id="for-organizers"
        className="relative mx-auto max-w-7xl px-6 py-24 scroll-mt-28"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-[2.4rem] border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-50/50 opacity-0 transition duration-300 group-hover:opacity-100" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  For organizers
                </span>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                  Make your event look like a premium sponsorship asset.
                </h2>

                <p className="mt-4 text-base leading-8 text-slate-600">
                  We help structure your event into a cleaner commercial story:
                  audience, event intelligence, sponsor inventory, and positioning
                  that is easier for brands to understand and value.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Profile", "Credibility layer"],
                  ["Metrics", "Commercial signals"],
                  ["Inventory", "Activation options"],
                ].map(([label, value], index) => (
                  <motion.div
                    key={label}
                    whileHover={{ y: -4, rotateX: 3 }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {value}
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        className="h-full rounded-full bg-blue-600"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${74 + index * 8}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.15 + index * 0.08, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            id="for-sponsors"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-[2.4rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-lg scroll-mt-28"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.14),transparent_30%)]" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                  For sponsors
                </span>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                  A platform built to support premium sponsorship strategy.
                </h2>

                <p className="mt-4 text-base leading-8 text-slate-300">
                  We combine your budget, campaign priorities, and target market
                  with structured event intelligence to produce stronger decisions,
                  clearer shortlists, and better execution conversations.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Brief", "Goals + market"],
                  ["Plan", "Strategic shortlist"],
                  ["Support", "AI + ROI view"],
                ].map(([label, value], index) => (
                  <motion.div
                    key={label}
                    whileHover={{ y: -4, rotateX: 3 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {value}
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-cyan-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${72 + index * 10}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.95, delay: 0.15 + index * 0.08, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section
        id="how-it-works"
        className="relative overflow-hidden border-y border-slate-200 bg-slate-50 scroll-mt-28"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                What to expect
              </span>

              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                From sponsor brief to strategic shortlist.
              </h2>

              <div className="relative rounded-[2.4rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="absolute left-[1.45rem] top-10 bottom-10 w-px bg-gradient-to-b from-blue-200 via-cyan-200 to-slate-200" />

                <div className="space-y-6">
                  {processSteps.map((item, index) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      className="relative flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <motion.div
                        className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white shadow-sm"
                        animate={{
                          backgroundColor: [
                            "#0f172a",
                            "#2563eb",
                            "#06b6d4",
                            "#0f172a",
                          ],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: index * 0.6,
                          ease: "easeInOut",
                        }}
                      >
                        {item.step}
                      </motion.div>

                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-blue-100/50 via-cyan-50/40 to-slate-100/30 blur-3xl" />

              <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_25px_80px_-25px_rgba(15,23,42,0.3)] backdrop-blur">
                <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
                  <motion.div
                    whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
                    className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          Sponsor profile
                        </p>
                        <p className="mt-2 text-xl font-semibold">
                          Global Nutrition Brand
                        </p>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-cyan-200">
                        Example dashboard
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 text-sm text-slate-300">
                      <div className="flex justify-between">
                        <span>Category</span>
                        <span className="font-medium text-white">Nutrition</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Region</span>
                        <span className="font-medium text-white">Spain</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Focus</span>
                        <span className="font-medium text-white">Endurance</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Budget</span>
                        <span className="font-medium text-cyan-300">€100K</span>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {[
                        ["Objective", "Brand awareness"],
                        ["Priority", "Product trial"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-xl border border-white/10 bg-white/5 p-4"
                        >
                          <p className="text-xs text-slate-400">{label}</p>
                          <p className="mt-2 text-sm font-semibold text-white">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          Recommended opportunities
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Ranked by fit, geography, audience, and ROI logic
                        </p>
                      </div>
                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Live shortlist
                      </div>
                    </div>

                    {sponsorRecommendations.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 22 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: 0.15 + index * 0.08 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {item.name}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                              Opportunity profile
                            </p>
                          </div>
                          <div className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {item.fit} fit
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-500">
                          <div className="rounded-xl border border-slate-200 bg-white p-3">
                            <p>Reach</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                              {item.reach}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-white p-3">
                            <p>Attendance</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                              {item.attendance}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-white p-3">
                            <p>ROI</p>
                            <p className="mt-1 text-sm font-semibold text-emerald-600">
                              {item.roi}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                          <motion.div
                            className="h-full rounded-full bg-blue-600"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${92 - index * 7}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1,
                              delay: 0.2 + index * 0.08,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl overflow-hidden px-6">
          <div className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Brands and categories this platform is built for
          </div>

          <motion.div
            className="flex w-max gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            {[...logoNames, ...logoNames].map((name, index) => (
              <div
                key={`${name}-${index}`}
                className="flex h-14 min-w-[170px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {name}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] border border-slate-900 bg-slate-950 px-8 py-14 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.5)] sm:px-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_30%)]" />

          <div className="relative max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Get started
            </span>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Start building your sponsorship strategy.
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-300">
              Create your account and begin using a premium platform designed to
              support sponsorship planning, opportunity comparison, and stronger
              investment decisions.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5"
              >
                Create account
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}