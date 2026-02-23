import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Header } from "./components/Header";
import { JobSearchForm } from "./components/JobSearchForm";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { ResultsSummary } from "./components/ResultsSummary";
import { ParticleField } from "./components/ParticleField";

type View = "landing" | "form" | "progress" | "results";

interface FormData {
  resumeText: string;
  sheetId: string;
  sheetTabName: string;
  jobSources: string[];
}

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [formData, setFormData] = useState<FormData>({
    resumeText: "",
    sheetId: "",
    sheetTabName: "",
    jobSources: [],
  });

  const handleStart = () => setView("form");
  const handleBack = () => setView("landing");
  const handleRun = (data: FormData) => { setFormData(data); setView("progress"); };
  const handleComplete = () => setView("results");
  const handleReset = () => {
    setFormData({ resumeText: "", sheetId: "", sheetTabName: "", jobSources: [] });
    setView("landing");
  };

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        background: "linear-gradient(160deg, #070e1a 0%, #0b1929 40%, #060d18 100%)",
      }}
    >
      {/* Particle network background */}
      <ParticleField />

      {/* Deep glow orbs */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90vw",
          height: "55vh",
          background: "radial-gradient(ellipse, rgba(13,148,136,0.07) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "0",
          right: "-15%",
          width: "50vw",
          height: "50vh",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: "30%",
          left: "-10%",
          width: "40vw",
          height: "40vh",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.04) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148,163,184,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          zIndex: 0,
        }}
      />

      {/* Horizontal scan line */}
      <motion.div
        className="fixed inset-x-0 pointer-events-none"
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(20,184,166,0.25) 30%, rgba(56,189,248,0.3) 50%, rgba(20,184,166,0.25) 70%, transparent 100%)",
          zIndex: 1,
        }}
        animate={{ top: ["-1px", "100vh"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
      />

      {/* Main content */}
      <div className="relative" style={{ zIndex: 2 }}>
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.35 }}
            >
              <Header onStart={handleStart} />
            </motion.div>
          )}

          {view === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.4 }}
              className="min-h-screen flex flex-col items-center justify-start py-10"
            >
              <div className="w-full max-w-2xl px-4 mb-7 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-teal-500/20 flex items-center justify-center" style={{ border: "1px solid rgba(20,184,166,0.3)" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.5">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                  </div>
                  <span className="text-slate-500 text-xs" style={{ fontWeight: 600, letterSpacing: "0.05em" }}>24H JOB FINDER</span>
                </div>
              </div>
              <JobSearchForm onRun={handleRun} onBack={handleBack} />
            </motion.div>
          )}

          {view === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.4 }}
              className="min-h-screen flex flex-col items-center justify-center py-10"
            >
              <ProgressIndicator onComplete={handleComplete} jobSources={formData.jobSources} />
            </motion.div>
          )}

          {view === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="min-h-screen pt-8"
            >
              <div className="flex items-center justify-center mb-5 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-teal-500/20 flex items-center justify-center" style={{ border: "1px solid rgba(20,184,166,0.3)" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.5">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                  </div>
                  <span className="text-slate-500 text-xs" style={{ fontWeight: 600, letterSpacing: "0.05em" }}>24H JOB FINDER · RESULTS</span>
                </div>
              </div>
              <ResultsSummary jobSources={formData.jobSources} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
