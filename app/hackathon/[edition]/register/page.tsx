import { redirect } from "next/navigation";
import { getEditionConfig, listActiveEditions } from "@/lib/hackathon/editions";

export async function generateMetadata({ params }: { params: { edition: string } }) {
  return {
    title: "Registro | Hackathon Bitcoin México",
    description: "Redirigiendo al formulario de registro...",
  };
}

export async function generateStaticParams() {
  const editions = await listActiveEditions();
  return editions.map((edition) => ({
    edition: edition.slug,
  }));
}

export default async function RegisterPage({ params }: { params: { edition: string } }) {
  const edition = await getEditionConfig(params.edition);
  
  // Si la edición tiene un URL de registro específico en su config, usarlo.
  // De lo contrario, usar la variable de entorno global.
  const registrationUrl = 
    edition?.registrationUrl || 
    process.env.NEXT_PUBLIC_HACKATHON_REGISTRATION_FORM_URL || 
    "https://aceptabitcoin.org/hackathon";

  redirect(registrationUrl);
}