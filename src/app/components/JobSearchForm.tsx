import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Sheet, Tag, Search, X, AlertCircle, ChevronLeft } from "lucide-react";

interface FormData {
  resumeText: string;
  sheetId: string;
  sheetTabName: string;
  jobSources: string[];
}

interface JobSearchFormProps {
  onRun: (data: FormData) => void;
  onBack: () => void;
}

const SOURCE_SUGGESTIONS = ["Indeed", "LinkedIn", "Glassdoor", "Wellfound", "Remote.co", "Dice", "ZipRecruiter", "Monster"];

export function JobSearchForm({ onRun, onBack }: JobSearchFormProps) {
  const [resumeText, setResumeText] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [sheetTabName, setSheetTabName] = useState("");
  const [jobSources, setJobSources] = useState<string[]>(["Indeed", "LinkedIn"]);
  const [sourceInput, setSourceInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string | null>(null);

  const addSource = (source: string) => {
    const trimmed = source.trim();
    if (trimmed && !jobSources.includes(trimmed)) {
      setJobSources([...jobSources, trimmed]);
    }
    setSourceInput("");
  };

  const removeSource = (source: string) => {
    setJobSources(jobSources.filter((s) => s !== source));
  };

  const handleSourceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSource(sourceInput);
    } else if (e.key === "Backspace" && sourceInput === "" && jobSources.length > 0) {
      setJobSources(jobSources.slice(0, -1));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!resumeText.trim()) newErrors.resumeText = "Please paste your resume or profile text.";
    if (!sheetId.trim()) newErrors.sheetId = "Google Sheet ID is required.";
    if (!sheetTabName.trim()) newErrors.sheetTabName = "Sheet tab name is required.";
    if (jobSources.length === 0) newErrors.jobSources = "Please add at least one job source.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onRun({ resumeText, sheetId, sheetTabName, jobSources });
    }
  };

  const inputBase = "w-full rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 outline-none transition-all duration-200";
  const inputStyle = (name: string) =>
    `${inputBase} ${
      focused === name
        ? "border border-teal-500/70 bg-slate-800/80 shadow-[0_0_0_3px_rgba(20,184,166,0.15)]"
        : errors[name]
        ? "border border-red-500/60 bg-slate-800/60"
        : "border border-slate-700/60 bg-slate-800/60"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-slate-400 hover:text-teal-400 mb-6 transition-colors cursor-pointer text-sm"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1a2b3c, #15222f)",
          border: "1px solid rgba(148,163,184,0.08)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02)",
        }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: "linear-gradient(rgba(20,184,166,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Scanline sweep */}
        <motion.div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            height: "70px",
            background: "linear-gradient(180deg, transparent 0%, rgba(20,184,166,0.04) 50%, transparent 100%)",
            zIndex: 5,
          }}
          animate={{ top: ["-70px", "110%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
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
              width: 14,
              height: 14,
              borderColor: "rgba(20,184,166,0.35)",
              borderStyle: "solid",
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        <div className="relative z-10">
          <div className="mb-6">
            <h2 className="text-slate-100 mb-1" style={{ fontWeight: 700, fontSize: "1.3rem" }}>Configure Your Job Search</h2>
            <p className="text-slate-400 text-sm">Fill in the details below to start finding matching jobs.</p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Resume Text */}
            <div>
              <label className="flex items-center gap-2 text-slate-300 text-sm mb-2" style={{ fontWeight: 500 }}>
                <FileText size={14} className="text-teal-400" />
                Resume / Profile Text
              </label>
              <textarea
                rows={6}
                className={inputStyle("resumeText")}
                style={{ resize: "vertical", minHeight: "130px" }}
                placeholder="Paste your resume or profile text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                onFocus={() => setFocused("resumeText")}
                onBlur={() => setFocused(null)}
              />
              <AnimatePresence>
                {errors.resumeText && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5"
                  >
                    <AlertCircle size={12} /> {errors.resumeText}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Sheet ID */}
            <div>
              <label className="flex items-center gap-2 text-slate-300 text-sm mb-2" style={{ fontWeight: 500 }}>
                <Sheet size={14} className="text-teal-400" />
                Google Sheet ID
              </label>
              <input
                type="text"
                className={inputStyle("sheetId")}
                placeholder="Enter your Google Sheet ID"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                onFocus={() => setFocused("sheetId")}
                onBlur={() => setFocused(null)}
              />
              <AnimatePresence>
                {errors.sheetId && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5"
                  >
                    <AlertCircle size={12} /> {errors.sheetId}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Tab Name */}
            <div>
              <label className="flex items-center gap-2 text-slate-300 text-sm mb-2" style={{ fontWeight: 500 }}>
                <Tag size={14} className="text-teal-400" />
                Sheet Tab Name
              </label>
              <input
                type="text"
                className={inputStyle("sheetTabName")}
                placeholder="Enter the sheet tab name"
                value={sheetTabName}
                onChange={(e) => setSheetTabName(e.target.value)}
                onFocus={() => setFocused("sheetTabName")}
                onBlur={() => setFocused(null)}
              />
              <AnimatePresence>
                {errors.sheetTabName && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5"
                  >
                    <AlertCircle size={12} /> {errors.sheetTabName}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Job Sources */}
            <div>
              <label className="flex items-center gap-2 text-slate-300 text-sm mb-2" style={{ fontWeight: 500 }}>
                <Search size={14} className="text-teal-400" />
                Job Sources
              </label>
              <div
                className={`flex flex-wrap gap-2 rounded-xl px-3 py-2.5 min-h-[48px] transition-all duration-200 cursor-text ${
                  focused === "jobSources"
                    ? "border border-teal-500/70 bg-slate-800/80 shadow-[0_0_0_3px_rgba(20,184,166,0.15)]"
                    : errors.jobSources
                    ? "border border-red-500/60 bg-slate-800/60"
                    : "border border-slate-700/60 bg-slate-800/60"
                }`}
                onClick={() => document.getElementById("source-input")?.focus()}
              >
                <AnimatePresence>
                  {jobSources.map((source) => (
                    <motion.span
                      key={source}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-teal-300 text-xs"
                      style={{ background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", fontWeight: 500 }}
                    >
                      {source}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeSource(source); }}
                        className="hover:text-teal-100 transition-colors cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
                <input
                  id="source-input"
                  type="text"
                  className="flex-1 min-w-[120px] bg-transparent outline-none text-slate-200 placeholder-slate-500 text-sm"
                  placeholder={jobSources.length === 0 ? "Indeed, LinkedIn, Glassdoor..." : "Add source..."}
                  value={sourceInput}
                  onChange={(e) => setSourceInput(e.target.value)}
                  onKeyDown={handleSourceKeyDown}
                  onFocus={() => setFocused("jobSources")}
                  onBlur={() => { setFocused(null); if (sourceInput.trim()) addSource(sourceInput); }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SOURCE_SUGGESTIONS.filter((s) => !jobSources.includes(s)).map((s) => (
                  <button
                    key={s}
                    onClick={() => addSource(s)}
                    className="px-2 py-0.5 rounded-md text-slate-400 text-xs hover:text-teal-300 hover:border-teal-500/40 transition-colors cursor-pointer"
                    style={{ border: "1px solid rgba(148,163,184,0.15)" }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {errors.jobSources && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5"
                  >
                    <AlertCircle size={12} /> {errors.jobSources}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Run button */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(20,184,166,0.55), 0 0 60px rgba(20,184,166,0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full mt-2 py-4 rounded-xl text-white cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0d9488, #0891b2)",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 4px 20px rgba(13,148,136,0.35)",
              }}
            >
              {/* Button shimmer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
              />
              <Search size={18} />
              Run Job Search
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}