"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Terminal, Store, MapPin, Cpu, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

// ============================================================================
// CONFIGURACIÓN DE GOOGLE FORMS (ACTUALIZADA)
// ============================================================================
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdDF1PBjQ6gRZWhAByPvrVNDI0p-inmoA8fLn1opynz26kYdQ/formResponse";

// IDs extraídos de la URL proporcionada
const FIELD_IDS = {
  name: "entry.814057944",       
  email: "entry.1860323184",      
  businessName: "entry.1006340635", 
  category: "entry.225296628",   
  volume: "entry.311501453",     
  techLevel: "entry.1076724167",  
  currentInfra: "entry.544920794" 
};

export default function CreaTuTiendaPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    category: "",
    volume: "",
    techLevel: "",
    currentInfra: ""
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const googleFormData = new FormData();
    
    Object.entries(FIELD_IDS).forEach(([key, entryId]) => {
      const value = formData[key as keyof typeof formData];
      if (value) { // Solo enviamos si hay valor, aunque Google acepta vacíos también
        googleFormData.append(entryId, value); 
      }
    });

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        body: googleFormData
      });

      setStatus("success");
      
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          businessName: "",
          category: "",
          volume: "",
          techLevel: "",
          currentInfra: ""
        });
        setStatus("idle");
      }, 5000); // Dejamos el mensaje de éxito un poco más visible

    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
      setErrorMessage("Fallo en la conexión con el nodo central. Intenta nuevamente.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 relative flex flex-col items-center justify-center">
      
      {/* Efectos de fondo Matrix */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-matrix/5 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30 pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10 w-full">
        
        {/* Contenedor Principal */}
        <div className="border border-white/10 bg-black/90 backdrop-blur-xl p-8 md:p-12 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.9)] relative overflow-hidden">
          
          {/* Línea decorativa superior */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-matrix to-transparent opacity-50" />

          {/* Encabezado del Formulario */}
          <div className="mb-10 border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-5 h-5 text-matrix" />
              <span className="font-mono text-xs text-matrix tracking-widest">&gt;&gt; MERCHANT_ONBOARDING_PROTOCOL_v2.0</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Conecta tu Negocio</h1>
            <p className="font-mono text-sm text-gray-400">
              Diagnóstico técnico y comercial. Nuestra IA recomendará la stack adecuada para tu soberanía financiera.
            </p>
          </div>

          {/* Estado de Éxito */}
          {status === "success" && (
            <div className="mb-8 p-4 border border-matrix/50 bg-matrix/10 rounded-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
              <CheckCircle2 className="w-6 h-6 text-matrix shrink-0" />
              <div>
                <h3 className="font-mono text-sm font-bold text-matrix uppercase">Transmisión Exitosa</h3>
                <p className="font-mono text-xs text-gray-300 mt-1">
                  Datos recibidos en el nodo central. Un agente humano te contactará vía email en las próximas 24-48 horas.
                </p>
              </div>
            </div>
          )}

          {/* Estado de Error */}
          {status === "error" && (
            <div className="mb-8 p-4 border border-red-500/50 bg-red-500/10 rounded-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <h3 className="font-mono text-sm font-bold text-red-500 uppercase">Error de Transmisión</h3>
                <p className="font-mono text-xs text-gray-300 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 opacity-100 transition-opacity duration-300" style={{ opacity: status === 'success' ? 0.5 : 1 }}>
            
            {/* SECCIÓN 1: DATOS COMERCIALES */}
            <div className="space-y-6 p-6 border border-white/5 bg-white/[0.02] rounded-sm">
              <h3 className="font-mono text-xs text-bitcoin uppercase tracking-wider flex items-center gap-2">
                <Store className="w-3 h-3" /> Identificación Comercial
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-gray-500 uppercase">Contacto Principal</label>
                  <input 
                    type="text" 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full bg-black border border-white/20 text-white p-3 font-mono text-sm focus:border-matrix focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] rounded-sm transition-all disabled:opacity-50"
                    placeholder="Tu Nombre"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-gray-500 uppercase">Canal Seguro (Email)</label>
                  <input 
                    type="email" 
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full bg-black border border-white/20 text-white p-3 font-mono text-sm focus:border-matrix focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] rounded-sm transition-all disabled:opacity-50"
                    placeholder="nombre@negocio.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block font-mono text-[10px] text-gray-500 uppercase">Nombre del Negocio / Proyecto</label>
                  <input 
                    type="text" 
                    required
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full bg-black border border-white/20 text-white p-3 font-mono text-sm focus:border-bitcoin focus:outline-none focus:shadow-[0_0_10px_rgba(247,147,26,0.2)] rounded-sm transition-all disabled:opacity-50"
                    placeholder="Ej: Tacos El Satoshi / Cyber Café Merida"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-gray-500 uppercase">Rubro / Categoría</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full bg-black border border-white/20 text-white p-3 font-mono text-sm focus:border-matrix focus:outline-none rounded-sm disabled:opacity-50"
                  >
                    <option value="">-- SELECCIONAR --</option>
                    <option value="Gastronomía & Bebidas">Gastronomía & Bebidas</option>
                    <option value="Retail & Tiendas">Retail & Tiendas</option>
                    <option value="Servicios Profesionales">Servicios Profesionales</option>
                    <option value="Tecnología & SaaS">Tecnología & SaaS</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                 <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-gray-500 uppercase">Volumen Mensual Estimado</label>
                  <select 
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full bg-black border border-white/20 text-white p-3 font-mono text-sm focus:border-bitcoin focus:outline-none rounded-sm disabled:opacity-50"
                  >
                    <option value="">-- SELECCIONAR --</option>
                    <option value="Micro (< $10k MXN)">Micro (&lt; $10k MXN)</option>
                    <option value="Medio ($10k - $100k MXN)">Medio ($10k - $100k MXN)</option>
                    <option value="Alto (> $100k MXN)">Alto (&gt; $100k MXN)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: DIAGNÓSTICO TÉCNICO */}
            <div className="space-y-6">
              <label className="block font-mono text-sm text-matrix uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4" /> 01. Nivel de Experiencia Técnica
              </label>
              
              <div className="grid gap-3">
                <label className={`flex items-center gap-4 p-4 border ${formData.techLevel === 'Novato / Soy solo el dueño' ? 'border-bitcoin bg-bitcoin/5' : 'border-white/10 bg-white/5'} hover:border-bitcoin/50 cursor-pointer transition-all rounded-sm group ${status === 'loading' || status === 'success' ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input 
                    type="radio" 
                    name="techLevel" 
                    value="Novato / Soy solo el dueño"
                    checked={formData.techLevel === 'Novato / Soy solo el dueño'}
                    onChange={handleChange}
                    disabled={status === 'loading' || status === 'success'}
                    className="accent-bitcoin w-4 h-4" 
                  />
                  <div className="flex-1">
                    <span className="block text-white font-bold group-hover:text-bitcoin transition-colors">Novato / Soy solo el dueño</span>
                    <span className="block font-mono text-xs text-gray-500">Necesito una solución llave en mano (POS, Soporte).</span>
                  </div>
                </label>
                
                <label className={`flex items-center gap-4 p-4 border ${formData.techLevel === 'Intermedio / Tengo POS' ? 'border-matrix bg-matrix/5' : 'border-white/10 bg-white/5'} hover:border-matrix/50 cursor-pointer transition-all rounded-sm group ${status === 'loading' || status === 'success' ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input 
                    type="radio" 
                    name="techLevel" 
                    value="Intermedio / Tengo POS"
                    checked={formData.techLevel === 'Intermedio / Tengo POS'}
                    onChange={handleChange}
                    disabled={status === 'loading' || status === 'success'}
                    className="accent-matrix w-4 h-4" 
                  />
                  <div className="flex-1">
                    <span className="block text-white font-bold group-hover:text-matrix transition-colors">Intermedio / Tengo POS</span>
                    <span className="block font-mono text-xs text-gray-500">Ya uso BTCPay pero necesito integración web.</span>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 border ${formData.techLevel === 'Avanzado / Run Node' ? 'border-bitcoin bg-bitcoin/5' : 'border-white/10 bg-white/5'} hover:border-bitcoin/50 cursor-pointer transition-all rounded-sm group ${status === 'loading' || status === 'success' ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input 
                    type="radio" 
                    name="techLevel" 
                    value="Avanzado / Run Node"
                    checked={formData.techLevel === 'Avanzado / Run Node'}
                    onChange={handleChange}
                    disabled={status === 'loading' || status === 'success'}
                    className="accent-bitcoin w-4 h-4" 
                  />
                  <div className="flex-1">
                    <span className="block text-white font-bold group-hover:text-bitcoin transition-colors">Avanzado / Run Node</span>
                    <span className="block font-mono text-xs text-gray-500">Ejecuto mi propio nodo y quiero arquitectura personalizada.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Pregunta Final */}
            <div className="space-y-4">
              <label className="block font-mono text-sm text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" /> 02. Infraestructura Actual
              </label>
              <select 
                name="currentInfra"
                value={formData.currentInfra}
                onChange={handleChange}
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-black border border-white/20 text-white p-3 font-mono text-sm focus:border-matrix focus:outline-none focus:ring-1 focus:ring-matrix rounded-sm disabled:opacity-50"
              >
                <option value="">-- SELECCIONAR SISTEMA --</option>
                <option value="Tienda Física (Solo Presencial)">Tienda Física (Solo Presencial)</option>
                <option value="E-commerce (Sitio Web existente)">E-commerce (Sitio Web existente)</option>
                <option value="Solo Redes Sociales">Solo Redes Sociales</option>
                <option value="Starting from scratch">Starting from scratch</option>
              </select>
            </div>

            {/* Botón de Envío */}
            <Button 
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={`w-full font-bold font-mono py-6 mt-4 text-lg uppercase tracking-widest border border-transparent transition-all rounded-sm
                ${status === 'loading' ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : ''}
                ${status === 'success' ? 'bg-matrix text-black' : ''}
                ${status === 'idle' || status === 'error' ? 'bg-bitcoin hover:bg-bitcoin/90 text-black shadow-[0_0_20px_rgba(247,147,26,0.4)] hover:shadow-[0_0_30px_rgba(247,147,26,0.6)]' : ''}
              `}
            >
              {status === 'loading' ? '>> TRANSMITIENDO DATOS...' : 
               status === 'success' ? '>> PROTOCOLO COMPLETADO' : 
               'INICIAR PROTOCOLO DE INSTALACIÓN'}
            </Button>

            {/* Nota de Privacidad */}
            <p className="text-center font-mono text-[10px] text-gray-600 mt-4">
              [SYS.LOG] Los datos se procesan localmente y se transmiten de forma encriptada a nuestro nodo seguro. No compartimos tu información con terceros.
            </p>

          </form>
        </div>
        
        {/* Link de regreso al Home */}
        <div className="mt-8 text-center">
          <Link href="/" className="font-mono text-xs text-gray-500 hover:text-matrix transition-colors flex items-center justify-center gap-2">
            ← Volver al Oracle System
          </Link>
        </div>
      </div>
    </div>
  );
}