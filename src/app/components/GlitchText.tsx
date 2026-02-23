import { useState, useEffect, useRef } from "react";

const GLITCH_CHARS = "!<>-_\\/[]{}=+*^?#@$%&01";

function scramble(text: string, progress: number): string {
  return text
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      if (progress > i / text.length) return char;
      return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    })
    .join("");
}

interface GlitchTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  /** gradient CSS string for the text color */
  gradient?: string;
}

export function GlitchText({ text, className, style, gradient }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [glitching, setGlitching] = useState(false);
  const [rgbShift, setRgbShift] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const doGlitch = () => {
      setGlitching(true);
      setRgbShift(true);
      let frame = 0;
      const totalFrames = 18;

      const intervalId = setInterval(() => {
        const progress = frame / totalFrames;
        setDisplayText(scramble(text, progress));
        setOffset({
          x: frame < totalFrames - 3 ? (Math.random() - 0.5) * 5 : 0,
          y: frame < totalFrames - 3 ? (Math.random() - 0.5) * 2 : 0,
        });
        frame++;
        if (frame >= totalFrames) {
          clearInterval(intervalId);
          setDisplayText(text);
          setOffset({ x: 0, y: 0 });
          setGlitching(false);
          setTimeout(() => setRgbShift(false), 100);
          timerRef.current = setTimeout(doGlitch, 3500 + Math.random() * 4000);
        }
      }, 40);
    };

    timerRef.current = setTimeout(doGlitch, 900);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text]);

  const textShadow = glitching
    ? "2px 0 rgba(255,0,80,0.7), -2px 0 rgba(0,255,255,0.7)"
    : "none";

  if (gradient) {
    return (
      <span
        className={className}
        style={{
          ...style,
          display: "inline-block",
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: glitching ? "none" : "transform 0.15s ease",
          filter: glitching ? "drop-shadow(2px 0 rgba(255,0,80,0.6)) drop-shadow(-2px 0 rgba(0,255,255,0.6))" : "none",
        }}
      >
        <span
          style={{
            backgroundImage: gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {displayText}
        </span>
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        ...style,
        display: "inline-block",
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: glitching ? "none" : "transform 0.15s ease",
        textShadow,
      }}
    >
      {displayText}
    </span>
  );
}
