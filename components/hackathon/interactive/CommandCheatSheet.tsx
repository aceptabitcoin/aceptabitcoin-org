// ============================================================
// COMMAND CHEAT SHEET — Essential commands modal
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

"use client";

import { useState } from "react";
import { Copy, Check, X, Terminal, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const COMMANDS = [
  { category: "Bitcoin Core", command: "bitcoin-cli getblockchaininfo", desc: "Check blockchain status" },
  { category: "Lightning", command: "lncli getinfo", desc: "Lightning node info" },
  { category: "Wallet", command: "bitcoin-cli listunspent", desc: "List UTXOs" },
  { category: "Transaction", command: "bitcoin-cli sendtoaddress <addr> <amt>", desc: "Send BTC" },
  { category: "Development", command: "npm install lightning", desc: "Install LN library" },
];

export default function CommandCheatSheet({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const handleDownload = () => {
    const content = COMMANDS.map((c) => `# ${c.category}\n${c.command}\n# ${c.desc}\n`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bitcoin-hackathon-cheatsheet.txt";
    a.click();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-matrix/10 border border-matrix/20 text-matrix font-mono text-sm hover:bg-matrix/20 transition-colors"
      >
        <Terminal className="h-4 w-4" />
        Ver Comandos
      </button>

      {isOpen && (
        <div className="hackathon-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div
            className="hackathon-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="hackathon-modal-close"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-white mb-6">
              Bitcoin Hackathon Commands
            </h2>

            <div className="space-y-4 mb-6">
              {COMMANDS.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-white/5"
                >
                  <div>
                    <div className="font-mono text-xs text-gray-500 mb-1">
                      {item.category}
                    </div>
                    <code className="font-mono text-sm text-matrix">{item.command}</code>
                    <div className="font-mono text-[10px] text-gray-500 mt-1">
                      {item.desc}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(item.command)}
                    className="p-2 rounded hover:bg-white/5 transition-colors"
                  >
                    {copiedCommand === item.command ? (
                      <Check className="h-4 w-4 text-matrix" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <Button
              onClick={handleDownload}
              className="w-full justify-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Descargar Cheat Sheet
            </Button>
          </div>
        </div>
      )}
    </>
  );
}