'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Item } from '../types';
import { Plus } from 'lucide-react';

export default function CatalogoPage() {
    const { budget, addToBudget } = useApp();
    const [articulos, setArticulos] = useState<Item[]>([]);

    useEffect(() => {
        // 1. Traemos los artículos de la DB (Java)
        fetch('http://localhost:8080/api/articulos')
            .then(res => res.json())
            .then(data => {
                // 2. Buscamos sus fotos en el LocalStorage
                const fotosLocales = JSON.parse(localStorage.getItem('atelier_fotos') || '{}');

                // 3. Unimos los datos
                const articulosConFotos = data.map((art: any) => ({
                    ...art,
                    image: fotosLocales[art.id] || "https://via.placeholder.com/400?text=Sin+Foto+Local"
                }));

                setArticulos(articulosConFotos);
            });
    }, []);

    const total = budget.reduce((acc, i) => acc + (i.precio * i.quantity), 0);

    return (
        <div className="max-w-screen-2xl mx-auto px-12 flex gap-12 pt-8">
            <div className="flex-1">
                <h2 className="font-serif text-6xl mb-16 italic">Atelier Curado</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                    {articulos.map((item) => (
                        <div key={item.id} className="group">
                            <div className="aspect-[3/4] bg-[#f2f4f2] rounded-sm overflow-hidden mb-6 relative">
                                <img src={item.image} alt={item.nombre} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                <button
                                    onClick={() => addToBudget(item)}
                                    className="absolute bottom-6 right-6 bg-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Plus className="text-[#606042]" />
                                </button>
                            </div>
                            <div className="flex justify-between font-serif text-2xl text-[#2d3432]">
                                <h4>{item.nombre}</h4>
                                <p className="text-[#606042]">${item.precio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar Simple */}
            <aside className="w-[350px] sticky top-32 h-fit bg-white p-8 rounded-3xl shadow-xl border border-[#ecefec]">
                <h3 className="font-serif text-2xl mb-8 border-b pb-4">Tu Selección</h3>
                <div className="space-y-4 mb-8">
                    {budget.map(i => (
                        <div key={i.id} className="flex justify-between text-sm font-bold">
                            <span>{i.quantity}x {i.nombre}</span>
                            <span>${i.precio * i.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold uppercase text-[#adb3b0]">Total</span>
                    <span className="font-serif text-4xl text-[#606042]">${total}</span>
                </div>
            </aside>
        </div>
    );
}