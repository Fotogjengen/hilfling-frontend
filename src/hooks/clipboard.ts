import { useEffect, useRef, useState } from "react";

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = ({
    text,
    copiedDuration,
  }: {
    text: string;
    copiedDuration?: number;
  }) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
          () => setCopied(false),
          copiedDuration ?? 2000,
        );
      })
      .catch((error) => {
        console.error("Kunne ikke kopiere til utklippstavle", error);
      });
  };

  return { copied, copy };
};
