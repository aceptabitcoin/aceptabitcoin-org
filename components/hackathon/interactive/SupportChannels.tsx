// ============================================================
// SUPPORT CHANNELS — Live status badges for support
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

"use client";

import { MessageSquare, Terminal, MessageCircle, Circle } from "lucide-react";

interface SupportChannel {
  name: string;
  url: string;
  icon: React.ReactNode;
  status: "online" | "idle" | "dnd";
}

export default function SupportChannels({
  className,
}: {
  className?: string;
}) {
  const channels: SupportChannel[] = [
    {
      name: "Discord",
      url: "https://discord.gg/aceptabitcoin",
      icon: <MessageSquare className="h-4 w-4" />,
      status: "online",
    },
    {
      name: "GitHub",
      url: "https://github.com/aceptabitcoin",
      icon: <Terminal className="h-4 w-4" />,
      status: "idle",
    },
    {
      name: "Telegram",
      url: "https://t.me/aceptabitcoin",
      icon: <MessageCircle className="h-4 w-4" />,
      status: "online",
    },
  ];

  const statusColors = {
    online: "text-matrix",
    idle: "text-bitcoin",
    dnd: "text-red-400",
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-3">
        {channels.map((channel) => (
          <a
            key={channel.name}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hackathon-badge hackathon-badge--participant inline-flex items-center gap-2"
          >
            {channel.icon}
            <span>{channel.name}</span>
            <Circle className={`h-2 w-2 fill-current ${statusColors[channel.status]}`} />
          </a>
        ))}
      </div>
    </div>
  );
}