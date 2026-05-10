// ============================================================
// REPO CLONE CTA — Terminal-style git clone button
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface RepoCloneCTAProps {
  repoUrl: string;
  className?: string;
}

export default function RepoCloneCTA({ repoUrl, className }: RepoCloneCTAProps) {
  const [copied, setCopied] = useState(false);

  const cloneCommand = `git clone ${repoUrl}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cloneCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={className}>
      <div className="hackathon-terminal">
        <div className="hackathon-terminal-header">
          <div className="flex items-center gap-1.5">
            <div className="hackathon-terminal-dot hackathon-terminal-dot--red" />
            <div className="hackathon-terminal-dot hackathon-terminal-dot--yellow" />
            <div className="hackathon-terminal-dot hackathon-terminal-dot--green" />
          </div>
          <span className="font-mono text-[10px] text-gray-500">git-clone</span>
        </div>
        <div className="hackathon-terminal-body font-mono text-sm">
          <span className="text-matrix">$</span> {cloneCommand}
        </div>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 rounded bg-matrix/10 hover:bg-matrix/20 transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4 text-matrix" />
          ) : (
            <Copy className="h-4 w-4 text-matrix" />
          )}
        </button>
      </div>
    </div>
  );
}