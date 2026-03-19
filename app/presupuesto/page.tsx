'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Send, Home, Ruler } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PresupuestoPage() {
    const { budget, setBudget, eventDetails } = useApp();
    const router = useRouter();

    // LÓGICA DE COSTOS
    const totalArticulos = budget.reduce((acc: number, item: any) => acc + (item.precio * item.quantity), 0);
    const costoSalon = (eventDetails.size || 0) * 20000;
    const totalFinal = totalArticulos + costoSalon;

    const eliminarDelCarrito = (id: string) => {
        setBudget(budget.filter((i: any) => i.id !== id));
    };

    const enviarPedido = async () => {
        if (budget.length === 0) return alert("El carrito está vacío");

        const pedidoCompleto = {
            fechaEvento: eventDetails.date,
            tipoEvento: eventDetails.type,
            m2Salon: eventDetails.size,
            costoSalon: costoSalon,
            totalFinal: totalFinal,
            estado: 'PENDIENTE',
            detalles: budget.map((i: any) => ({
                articuloId: i.id,
                cantidad: i.quantity,
                precioUnitario: i.precio
            }))
        };

        try {
            const res = await fetch('http://localhost:8080/api/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoCompleto)
            });

            if (res.ok) {
                alert("¡Pedido enviado con éxito! El administrador revisará la fecha.");
                setBudget([]); // Limpiamos el carrito
                router.push('/');
            }
        } catch (error) {
            alert("Error al conectar con el servidor");
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <header className="mb-12 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#adb3b0]">Paso Final</span>
                <h1 className="font-serif text-5xl italic mt-2">Tu Obra Maestra</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* LISTA DE ARTÍCULOS */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-[#2d3432]/5 border border-[#ecefec]">
                        <h3 className="font-serif text-2xl mb-8 border-b pb-4">Elementos del Atelier</h3>
                        {budget.length === 0 ? (
                            <p className="italic text-[#adb3b0] py-10 text-center">No hay artículos en tu selección.</p>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                <tr className="text-[10px] uppercase text-[#adb3b0] tracking-widest border-b border-[#f2f4f2]">
                                    <th className="pb-4">Pieza</th>
                                    <th className="pb-4">Cant.</th>
                                    <th className="pb-4 text-right">Subtotal</th>
                                    <th className="pb-4"></th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f2f4f2]">
                                {budget.map((item: any) => (
                                    <tr key={item.id} className="group">
                                        <td className="py-6 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-[#f2f4f2] overflow-hidden">
                                                <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                                            </div>
                                            <span className="font-bold text-sm">{item.nombre}</span>
                                        </td>
                                        <td className="py-6 text-sm">{item.quantity}</td>
                                        <td className="py-6 text-right font-serif font-bold">${(item.precio * item.quantity).toLocaleString()}</td>
                                        <td className="py-6 text-right pl-4">
                                            <button onClick={() => eliminarDelCarrito(item.id)} className="text-red-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* DETALLES DEL SALÓN */}
                    <div className="bg-[#f2f4f2] rounded-[32px] p-8 flex items-center justify-between border border-[#ecefec]">
                        <div className="flex items-center gap-6">
                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                                <Ruler className="text-[#606042]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-[#767c79]">Servicio de Arquitectura de Eventos</p>
                                <h4 className="text-xl font-bold">Base Salón ({eventDetails.size} m²)</h4>
                            </div>
                        </div>
                        <p className="font-serif text-2xl font-bold text-[#606042]">${costoSalon.toLocaleString()}</p>
                    </div>
                </div>

                {/* RESUMEN DE PAGO */}
                <aside className="lg:col-span-1">
                    <div className="bg-[#606042] text-[#fbfad3] rounded-[40px] p-10 shadow-2xl sticky top-32">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mb-8 text-center">Inversión Final</h4>

                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between text-sm opacity-80">
                                <span>Total Artículos</span>
                                <span>${totalArticulos.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm opacity-80">
                                <span>Canon Salón</span>
                                <span>${costoSalon.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-[#fbfad3]/20 my-6"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-lg">Total</span>
                                <span className="font-serif text-4xl font-bold">${totalFinal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={enviarPedido}
                            className="w-full bg-[#fbfad3] text-[#606042] py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95"
                        >
                            Confirmar Pedido <Send size={16} />
                        </button>

                        <p className="text-[9px] text-center mt-6 opacity-50 uppercase tracking-widest leading-relaxed">
                            Sujeto a disponibilidad para la fecha: <br/>
                            <span className="font-bold">{eventDetails.date}</span>
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}