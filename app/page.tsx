'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from './context/AppContext';
import { motion } from 'framer-motion';
import { Heart, PartyPopper, Baby, ChevronRight } from 'lucide-react';

export default function OnboardingPage() {
    const router = useRouter();
    const { eventDetails, setEventDetails } = useApp();

    const handleUpdate = (field: string, value: any) => {
        setEventDetails((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="flex min-h-[calc(100vh-112px)] w-full max-w-7xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden border border-black/5">

            {/* SECCIÓN IZQUIERDA: IMAGEN EDITORIAL */}
            <section className="relative w-1/2 hidden lg:block overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200"
                    alt="Evento curado"
                    className="absolute inset-0 w-full h-full object-cover grayscale-[20%] brightness-90"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                <div className="absolute bottom-16 left-16 text-on-primary">
                    <h2 className="font-serif italic text-6xl leading-tight mb-4">Creando lo <br/>excepcional.</h2>
                    <p className="font-sans text-xs tracking-[0.4em] uppercase opacity-80">Fase I: Contexto Arquitectónico</p>
                </div>
            </section>

            {/* SECCIÓN DERECHA: FORMULARIO */}
            <section className="flex-1 p-12 md:p-20 flex flex-col justify-center overflow-y-auto">
                <div className="max-w-md w-full mx-auto">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-outline mb-4 block">Comencemos el diseño</span>
                    <h1 className="font-serif text-4xl text-on-surface mb-12 leading-tight italic">Cuéntanos sobre tu próxima obra maestra.</h1>

                    <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); router.push('/catalogo'); }}>

                        {/* 1. TIPO DE EVENTO */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-outline block">1. Selecciona el tipo de evento</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'Casamiento', icon: Heart },
                                    { id: '15 Años', icon: PartyPopper },
                                    { id: 'Bautismo', icon: Baby },
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => handleUpdate('type', type.id)}
                                        className={`flex flex-col items-center p-4 border rounded-sm transition-all duration-300 ${
                                            eventDetails.type === type.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-black/5 hover:border-primary/40'
                                        }`}
                                    >
                                        <type.icon className={`w-5 h-5 mb-2 ${eventDetails.type === type.id ? 'text-primary' : 'text-outline'}`} />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">{type.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. CRONOGRAMA */}
                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-black/5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-outline">Fecha Tentativa</label>
                                <input
                                    type="date"
                                    value={eventDetails.date}
                                    onChange={(e) => handleUpdate('date', e.target.value)}
                                    className="w-full bg-surface p-3 text-sm border-0 border-b border-outline/30 focus:border-primary outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-outline">Invitados</label>
                                <input
                                    type="number"
                                    placeholder="ej. 150"
                                    value={eventDetails.guests || ''}
                                    onChange={(e) => handleUpdate('guests', e.target.value)}
                                    className="w-full bg-surface p-3 text-sm border-0 border-b border-outline/30 focus:border-primary outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* 3. ESPECIFICACIONES TÉCNICAS */}
                        <div className="space-y-6 pt-6 border-t border-black/5">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-outline">Salón (m²)</label>
                                    <input
                                        type="number" placeholder="400"
                                        onChange={(e) => handleUpdate('size', e.target.value)}
                                        className="w-full bg-surface p-3 text-sm border-0 border-b border-outline/30 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-outline">Altura Techo (m)</label>
                                    <input
                                        type="number" placeholder="4.5"
                                        onChange={(e) => handleUpdate('height', e.target.value)}
                                        className="w-full bg-surface p-3 text-sm border-0 border-b border-outline/30 outline-none"
                                    />
                                </div>
                            </div>

                            {/* ENTELADO LÓGICA */}
                            <div className="space-y-4 pt-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={eventDetails.fullDraping}
                                        onChange={(e) => handleUpdate('fullDraping', e.target.checked)}
                                        className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary"
                                    />
                                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface">Entelado completo del salón</span>
                                </label>

                                {/* Aparece solo si NO es entelado completo */}
                                {!eventDetails.fullDraping && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="grid grid-cols-2 gap-6 pl-7"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase text-outline">Paredes a entelar</label>
                                            <input
                                                type="number" placeholder="0"
                                                onChange={(e) => handleUpdate('wallCount', e.target.value)}
                                                className="w-full bg-surface p-2 text-xs border-b border-outline/30 outline-none"
                                            />
                                        </div>
                                        <label className="flex items-center gap-3 cursor-pointer self-end pb-2">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => handleUpdate('ceilingDraping', e.target.checked)}
                                                className="w-3 h-3 rounded-sm text-primary"
                                            />
                                            <span className="text-[9px] font-bold uppercase text-outline tracking-widest">Incluir techo</span>
                                        </label>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-on-primary py-5 rounded-sm font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                        >
                            Comenzar Selección <ChevronRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}