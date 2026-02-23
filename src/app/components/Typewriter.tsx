import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  cursorColor?: string;
}

export function Typewriter({
  text,
  delay = 600,
  speed = 32,
  className,
  style,
  cursorColor = "#14b8a6",
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let intervalId: ReturnType<typeof setInterval>;
    const startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      clearInterval(intervalId);
    };
  }, [text, delay, speed]);

  return (
    <span className={className} style={style}>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
          style={{
            display: "inline-block",
            width: "2px",
            height: "1.1em",
            background: cursorColor,
            marginLeft: "3px",
            verticalAlign: "middle",
            borderRadius: "1px",
            boxShadow: `0 0 8px ${cursorColor}`,
          }}
        />
      )}
    </span>
  );
}
