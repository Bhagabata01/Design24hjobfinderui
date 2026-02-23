import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, FileSearch, Globe, TableProperties, Trophy } from "lucide-react";

const STEPS = [
  { id: 0, label: "Parsing Resume", sublabel: "Analyzing skills & experience", icon: FileSearch },
  { id: 1, label: "Searching Jobs", sublabel: "Scanning job boards in real-time", icon: Globe },
  { id: 2, label: "Updating Sheet", sublabel: "Appending results to Google Sheet", icon: TableProperties },
  { id: 3, label: "Complete", sublabel: "All done!", icon: Trophy },
];

const STEP_DURATIONS = [2800, 3800, 2200, 600];

const TERMINAL_LINES: Record<number, string[]> = {
  0: [
    "> Initializing AI resume parser v2.4.1...",
    "> Loading NLP tokenization model...",
    "> Extracting work experience entries...",
    "> Identified 5 years of relevant experience",
    "> Detected 14 core technical skills",
    "> Building skill affinity matrix...",
    "> Resume profile hash: 8f3a2c1b",
    "> [OK] Resume parsing complete",
  ],
  1: [
    "> Authenticating with job board APIs...",
    "> Querying Indeed API [24h filter active]...",
    "> Found 23 new postings on Indeed",
    "> Querying LinkedIn Jobs API...",
    "> Found 31 new postings on LinkedIn",
    "> Running semantic match scoring...",
    "> Filtering by relevance threshold > 0.72",
    "> [OK] 47 high-match jobs identified",
  ],
  2: [
    "> Connecting to Google Sheets API...",
    "> Authenticating OAuth2 token...",
    "> Opening target spreadsheet...",
    "> Writing column headers...",
    "> Appending row 1 of 47... [████░░░░]",
    "> Appending rows 2-23... [████████░]",
    "> Appending rows 24-47... [██████████]",
    "> [OK] All rows written successfully",
  ],
  3: [
    "> Finalizing output...",
    "> ✓ Job search complete",
  ],
};

interface ProgressIndicatorProps {
  onComplete: () => void;
  jobSources: string[];
}

export function ProgressIndicator({ onComplete, jobSources }: ProgressIndicatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  const isCompleted = (stepId: number) => completedSteps.includes(stepId);
  const isCurrent = (stepId: number) => stepId === currentStep && !isCompleted(stepId);

  const progressPercent = (completedSteps.length / STEPS.length) * 100;

  // Step advancement
  useEffect(() => {
    if (currentStep >= STEPS.length) return;
    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setLineIndex(0);
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        setTimeout(onComplete, 700);
      }
    }, STEP_DURATIONS[currentStep]);
    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  // Terminal line printer
  useEffect(() => {
    const lines = TERMINAL_LINES[currentStep] ?? [];
    if (lineIndex >= lines.length) return;
    const delay = lineIndex === 0 ? 300 : 280 + Math.random() * 200;
    const timer = setTimeout(() => {
      setTerminalLines((prev) => [...prev, lines[lineIndex]]);
      setLineIndex((i) => i + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [lineIndex, currentStep]);

  // Scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const CARD_STYLE = {
    background: "linear-gradient(145deg, #1a2b3c, #15222f)",
    border: "1px solid rgba(148,163,184,0.08)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="rounded-2xl p-6 md:p-8 relative overflow-hidden" style={CARD_STYLE}>
        {/* Background grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "linear-gradient(rgba(20,184,166,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.05) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        {/* Scanline sweep */}
        <motion.div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            height: "80px",
            background: "linear-gradient(180deg, transparent 0%, rgba(20,184,166,0.04) 50%, transparent 100%)",
            zIndex: 5,
          }}
          animate={{ top: ["-80px", "110%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />

        {/* Corner brackets */}
        {[
          { top: 10, left: 10, borderWidth: "1px 0 0 1px" },
          { top: 10, right: 10, borderWidth: "1px 1px 0 0" },
          { bottom: 10, left: 10, borderWidth: "0 0 1px 1px" },
          { bottom: 10, right: 10, borderWidth: "0 1px 1px 0" },
        ].map((pos, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{
              ...pos,
              width: 16,
              height: 16,
              borderColor: "rgba(20,184,166,0.4)",
              borderStyle: "solid",
            }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <div className="relative z-10">
          <div className="mb-7 text-center">
            <h2 className="text-slate-100 mb-1" style={{ fontWeight: 700, fontSize: "1.25rem" }}>
              Finding Your Dream Jobs
            </h2>
            <p className="text-slate-400 text-sm">
              Searching across{" "}
              <span className="text-teal-400" style={{ fontWeight: 500 }}>
                {jobSources.join(", ")}
              </span>
            </p>
          </div>

          {/* Overall progress bar */}
          <div className="mb-7">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">Overall Progress</span>
              <motion.span
                className="text-teal-400"
                style={{ fontWeight: 600 }}
                key={Math.round(progressPercent)}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {Math.round(progressPercent)}%
              </motion.span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(148,163,184,0.1)" }}>
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{ background: "linear-gradient(90deg, #0d9488, #38bdf8)" }}
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>

          {/* Steps — horizontal */}
          <div className="hidden md:flex items-start gap-0 mb-8">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const done = isCompleted(step.id);
              const active = isCurrent(step.id);

              return (
                <div key={step.id} className="flex-1 flex flex-col items-center relative">
                  {idx < STEPS.length - 1 && (
                    <div
                      className="absolute top-5 left-1/2 w-full h-px z-0"
                      style={{ background: "rgba(148,163,184,0.12)" }}
                    >
                      <motion.div
                        className="h-full"
                        style={{ background: "linear-gradient(90deg, #0d9488, #38bdf8)" }}
                        initial={{ width: "0%" }}
                        animate={{ width: done ? "100%" : "0%" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  )}
                  <div className="relative z-10 mb-2.5">
                    <motion.div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      animate={{
                        backgroundColor: done
                          ? "rgba(13,148,136,1)"
                          : active
                          ? "rgba(13,148,136,0.2)"
                          : "rgba(20,35,50,0.8)",
                      }}
                      style={{ border: `2px solid ${done ? "#0d9488" : active ? "#14b8a6" : "rgba(148,163,184,0.15)"}` }}
                      transition={{ duration: 0.3 }}
                    >
                      {done ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                          <Check size={16} className="text-white" />
                        </motion.div>
                      ) : (
                        <Icon size={15} className={active ? "text-teal-400" : "text-slate-600"} />
                      )}
                    </motion.div>

                    {/* Radar pulse on active */}
                    {active && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ border: "2px solid rgba(20,184,166,0.5)" }}
                          animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ border: "2px solid rgba(20,184,166,0.3)" }}
                          animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                        />
                      </>
                    )}
                  </div>
                  <span
                    className="text-xs text-center px-1"
                    style={{
                      fontWeight: active ? 600 : done ? 500 : 400,
                      color: done ? "#2dd4bf" : active ? "#e2e8f0" : "#475569",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile steps */}
          <div className="md:hidden flex flex-col gap-3 mb-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const done = isCompleted(step.id);
              const active = isCurrent(step.id);
              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: done ? "#0d9488" : active ? "rgba(13,148,136,0.2)" : "rgba(20,35,50,0.8)",
                      border: `2px solid ${done ? "#0d9488" : active ? "#14b8a6" : "rgba(148,163,184,0.15)"}`,
                    }}
                  >
                    {done ? <Check size={14} className="text-white" /> : <Icon size={13} className={active ? "text-teal-400" : "text-slate-600"} />}
                  </div>
                  <span className="text-sm" style={{ fontWeight: active ? 600 : 400, color: done ? "#2dd4bf" : active ? "#e2e8f0" : "#475569" }}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Spinner + Terminal */}
          <div className="flex flex-col md:flex-row gap-5">
            {/* Multi-ring spinner */}
            <div className="flex flex-col items-center justify-center gap-3 flex-shrink-0">
              <div className="relative w-16 h-16">
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: "2px solid transparent", borderTopColor: "rgba(20,184,166,0.3)", borderRightColor: "rgba(20,184,166,0.3)" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                {/* Middle ring */}
                <motion.div
                  className="absolute rounded-full"
                  style={{ inset: "6px", border: "2px solid transparent", borderTopColor: "#14b8a6", borderLeftColor: "#14b8a6" }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                />
                {/* Inner ring */}
                <motion.div
                  className="absolute rounded-full"
                  style={{ inset: "12px", border: "1.5px solid transparent", borderTopColor: "#38bdf8" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                />
                {/* Core */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {(() => {
                        const Icon = STEPS[Math.min(currentStep, STEPS.length - 1)].icon;
                        return <Icon size={16} className="text-teal-400" />;
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </div>
                {/* Glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)" }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              {/* Pulse dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#14b8a6" }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.2, 0.7] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </div>

            {/* Terminal output */}
            <div
              className="flex-1 rounded-xl p-3 font-mono text-xs overflow-hidden"
              style={{
                background: "rgba(10,18,28,0.8)",
                border: "1px solid rgba(20,184,166,0.15)",
                minHeight: "130px",
                maxHeight: "160px",
              }}
            >
              <div className="flex items-center gap-1.5 mb-2 pb-1.5" style={{ borderBottom: "1px solid rgba(20,184,166,0.1)" }}>
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="text-slate-600 text-xs ml-1">terminal — job-finder</span>
              </div>
              <div ref={terminalRef} className="overflow-y-auto" style={{ maxHeight: "110px" }}>
                <AnimatePresence>
                  {terminalLines.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="leading-5"
                      style={{
                        color: line.includes("[OK]") || line.includes("✓")
                          ? "#2dd4bf"
                          : line.startsWith(">")
                          ? "#64748b"
                          : "#94a3b8",
                      }}
                    >
                      {line}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {/* Blinking cursor at end */}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  style={{ color: "#14b8a6" }}
                >
                  █
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
