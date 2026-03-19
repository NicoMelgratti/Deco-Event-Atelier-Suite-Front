'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Check, Trash2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CatalogoPage() {
    const [articulos, setArticulos] = useState<any[]>([]);
    const { budget, setBudget } = useApp();
    const router = useRouter();

    useEffect(() => {
        fetch('http://localhost:8080/api/articulos')
            .then(res => res.json())
            .then(data => setArticulos(data));
    }, []);

    // Función principal para agregar/quitar artículo con cantidad base 1
    const toggleArticulo = (art: any) => {
        const existe = budget.find((i: any) => i.id === art.id);
        if (existe) {
            setBudget(budget.filter((i: any) => i.id !== art.id));
        } else {
            const foto = JSON.parse(localStorage.getItem('atelier_fotos') || '{}')[art.id];
            setBudget([...budget, { ...art, quantity: 1, image: foto }]);
        }
    };

    // --- NUEVAS FUNCIONES PARA EL SELECTOR DE CANTIDAD ---
    const incrementarCantidad = (artId: number) => {
        setBudget(budget.map((i: any) =>
            i.id === artId ? { ...i, quantity: i.quantity + 1 } : i
        ));
    };

    const decrementarCantidad = (artId: number) => {
        const item = budget.find((i: any) => i.id === artId);
        if (item && item.quantity > 1) {
            setBudget(budget.map((i: any) =>
                i.id === artId ? { ...i, quantity: i.quantity - 1 } : i
            ));
        } else if (item && item.quantity === 1) {
            // Si la cantidad llega a 0, removemos el artículo
            setBudget(budget.filter((i: any) => i.id !== artId));
        }
    };
    // ---------------------------------------------------------

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 relative pb-32">
            <header className="text-center mb-16">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#adb3b0]">Colección Atelier</span>
                <h1 className="font-serif text-6xl italic mt-4 text-[#606042]">Piezas de Diseño</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {articulos.map(art => {
                    const seleccionado = budget.find((i: any) => i.id === art.id);
                    const foto = JSON.parse(localStorage.getItem('atelier_fotos') || '{}')[art.id];

                    return (
                        <div key={art.id} className={`group bg-white rounded-[40px] p-6 border transition-all duration-500 hover:shadow-2xl ${seleccionado ? 'border-[#606042] shadow-xl' : 'border-[#ecefec] shadow-sm'}`}>
                            {/* Area de Imagen con el botón de toggle en la parte superior-derecha */}
                            <div className="aspect-[4/5] rounded-[32px] overflow-hidden mb-6 relative">
                                <img src={foto || '/placeholder.jpg'} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${seleccionado ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} />
                                <button onClick={() => toggleArticulo(art)} className={`absolute top-4 right-4 p-4 rounded-full shadow-lg transition-all ${seleccionado ? 'bg-[#606042] text-white scale-110' : 'bg-white text-[#606042] hover:scale-110'}`}>
                                    {seleccionado ? <Check size={20} /> : <Plus size={20} />}
                                </button>
                            </div>

                            {/* --- NUEVO SELECTOR DE CANTIDAD (solo si seleccionado) --- */}
                            {seleccionado && (
                                <div className="bg-[#fdfcf5] p-3 rounded-2xl border border-[#ecefec] mb-6 flex items-center justify-between shadow-inner">
                                    <button
                                        onClick={() => decrementarCantidad(art.id)}
                                        className="bg-white text-[#606042] p-3 rounded-xl border border-[#ecefec] shadow-sm hover:scale-110 transition-transform active:scale-95"
                                    >
                                        <Trash2 size={16} className="text-red-300 group-hover:text-red-500" />
                                    </button>
                                    <div className="text-center">
                                        <p className="text-[10px] uppercase font-bold text-[#adb3b0] tracking-wider mb-1">Cantidad</p>
                                        <p className="font-serif text-3xl font-bold text-[#606042]">{budget.find((i: any) => i.id === art.id)?.quantity || 1}</p>
                                    </div>
                                    <button
                                        onClick={() => incrementarCantidad(art.id)}
                                        className="bg-[#606042] text-white p-3 rounded-xl shadow-lg hover:scale-110 transition-transform active:scale-95"
                                    >
                                        <Plus size={16} /> {/* El botón "+" que pediste en la parte de abajo */}
                                    </button>
                                </div>
                            )}
                            {/* --- FIN NUEVO SELECTOR --- */}

                            <div className="px-2">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-serif text-2xl italic text-[#606042]">{art.nombre}</h3>
                                    <span className="font-serif text-xl font-bold text-[#606042]">${art.precio?.toLocaleString()}</span>
                                </div>
                                <p className="text-[10px] uppercase tracking-widest text-[#adb3b0]">{art.categoria}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* BOTÓN FLOTANTE DE PRESUPUESTO */}
            {budget.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <button
                        onClick={() => router.push('/presupuesto')}
                        className="bg-[#606042] text-[#fbfad3] px-10 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] flex items-center gap-6 shadow-[0_20px_50px_rgba(96,96,66,0.3)] hover:scale-105 active:scale-95 transition-all group"
                    >
                        Continuar al Presupuesto ({budget.length})
                        <div className="bg-[#fbfad3] text-[#606042] p-2 rounded-full transition-transform group-hover:translate-x-2">
                            <ArrowRight size={16} />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}