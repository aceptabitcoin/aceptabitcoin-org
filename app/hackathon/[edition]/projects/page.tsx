// ============================================================
// HACKATHON PROJECTS PAGE — Project gallery
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { FolderGit } from "lucide-react";
import ProjectGrid from "@/components/hackathon/display/ProjectGrid";
import { getEditionConfig, listActiveEditions } from "@/lib/hackathon/editions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { edition: string } }): Promise<Metadata> {
  const edition = await getEditionConfig(params.edition);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://aceptabitcoin.org"),
    title: `Proyectos | ${edition?.title || "Hackathon Bitcoin México"}`,
    description: "Galería de proyectos presentados en el hackathon",
  };
}

export async function generateStaticParams() {
  const editions = await listActiveEditions();
  return editions.map((edition) => ({
    edition: edition.slug,
  }));
}

export default async function ProjectsPage({ params }: { params: { edition: string } }) {
  const edition = await getEditionConfig(params.edition);
  
  if (!edition) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-bitcoin/10 border border-bitcoin/20">
              <FolderGit className="h-8 w-8 text-bitcoin" />
            </div>
            <div>
              <h1 className="font-serif text-4xl font-bold text-white">
                Proyectos <span className="text-bitcoin text-lg opacity-50">// {edition.title}</span>
              </h1>
              <p className="font-mono text-gray-400 mt-1">
                Explora las soluciones construidas durante el hackathon
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <ProjectGrid edition={edition} />
      </main>
    </div>
  );
}