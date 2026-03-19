'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Send, Ruler, User, Phone, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PresupuestoPage() {
    const { budget, setBudget, eventDetails } = useApp();
    const router = useRouter();

    // Estados para el formulario y control de carga
    const [nombreContacto, setNombreContacto] = useState('');
    const [telefonoContacto, setTelefonoContacto] = useState('');
    const [enviando, setEnviando] = useState(false);

    // LÓGICA DE COSTOS (Asegurate que 20000 coincida con tu precio config)
    const totalArticulos = budget.reduce((acc: number, item: any) => acc + (item.precio * item.quantity), 0);
    const costoSalon = (eventDetails.size || 0) * 20000;
    const totalFinal = totalArticulos + costoSalon;

    const eliminarDelCarrito = (id: string) => {
        setBudget(budget.filter((i: any) => i.id !== id));
    };

    const enviarPedido = async () => {
        // 1. Validaciones Previas
        if (budget.length === 0) return alert("El carrito está vacío");
        if (!nombreContacto.trim() || !telefonoContacto.trim()) {
            return alert("Por favor, completa nombre y teléfono para que Valentina pueda contactarte.");
        }

        setEnviando(true);

        // 2. Armado del paquete (Coincide exacto con tu PedidoDTO y DetallePedidoDTO)
        const pedidoCompleto = {
            nombreContacto: nombreContacto,
            telefonoContacto: telefonoContacto,
            fechaEvento: eventDetails.date,
            tipoEvento: eventDetails.type,
            salonM2: eventDetails.size || 0,
            totalEstimado: totalFinal,
            estado: 'PENDIENTE',
            detalles: budget.map((i: any) => ({
                articuloId: i.id,    // Coincide con item.getArticuloId() en Java
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
                alert("¡Pedido enviado con éxito! El equipo de Valentina Decoración revisará tu solicitud.");
                setBudget([]);
                router.push('/');
            } else {
                const errorData = await res.text();
                console.error("Error del servidor:", errorData);
                alert("Hubo un problema al procesar el pedido en el servidor.");
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor. Revisá que el Backend esté corriendo.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <header className="mb-12 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#adb3b0]">Paso Final</span>
                <h1 className="font-serif text-5xl italic mt-2 text-[#606042]">Tu Obra Maestra</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">

                    {/* SECCIÓN: DATOS DE CONTACTO */}
                    <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-[#2d3432]/5 border border-[#ecefec]">
                        <h3 className="font-serif text-2xl mb-6 flex items-center gap-3 text-[#606042]">
                            <User size={20} /> Datos de Contacto
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-[#adb3b0] ml-4">Nombre Completo *</label>
                                <input
                                    type="text"
                                    value={nombreContacto}
                                    onChange={(e) => setNombreContacto(e.target.value)}
                                    placeholder="Ej: Juan Pérez"
                                    className="w-full bg-[#fdfcf5] p-4 rounded-2xl border border-[#ecefec] outline-none focus:ring-1 focus:ring-[#606042] text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-[#adb3b0] ml-4">WhatsApp / Teléfono *</label>
                                <input
                                    type="tel"
                                    value={telefonoContacto}
                                    onChange={(e) => setTelefonoContacto(e.target.value)}
                                    placeholder="Ej: 342 1234567"
                                    className="w-full bg-[#fdfcf5] p-4 rounded-2xl border border-[#ecefec] outline-none focus:ring-1 focus:ring-[#606042] text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* LISTA DE ARTÍCULOS */}
                    <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-[#2d3432]/5 border border-[#ecefec]">
                        <h3 className="font-serif text-2xl mb-8 border-b pb-4 text-[#606042]">Elementos del Atelier</h3>
                        {budget.length === 0 ? (
                            <p className="italic text-[#adb3b0] py-10 text-center">No hay artículos en tu selección.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                    <tr className="text-[10px] uppercase text-[#adb3b0] tracking-widest border-b border-[#f2f4f2]">
                                        <th className="pb-4 text-xs">Pieza</th>
                                        <th className="pb-4 text-xs">Cant.</th>
                                        <th className="pb-4 text-right text-xs">Subtotal</th>
                                        <th className="pb-4"></th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f2f4f2]">
                                    {budget.map((item: any) => (
                                        <tr key={item.id} className="group">
                                            <td className="py-6 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-[#f2f4f2] overflow-hidden border border-[#ecefec]">
                                                    <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                                </div>
                                                <span className="font-bold text-sm text-[#606042]">{item.nombre}</span>
                                            </td>
                                            <td className="py-6 text-sm">{item.quantity}</td>
                                            <td className="py-6 text-right font-serif font-bold text-[#606042]">${(item.precio * item.quantity).toLocaleString()}</td>
                                            <td className="py-6 text-right pl-4">
                                                <button onClick={() => eliminarDelCarrito(item.id)} className="text-red-200 hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* DETALLES DEL SALÓN */}
                    <div className="bg-[#f2f4f2] rounded-[32px] p-8 flex items-center justify-between border border-[#ecefec] shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#ecefec]">
                                <Ruler className="text-[#606042]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-[#767c79] tracking-wider">Arquitectura de Eventos</p>
                                <h4 className="text-xl font-bold text-[#606042]">Base Salón ({eventDetails.size} m²)</h4>
                            </div>
                        </div>
                        <p className="font-serif text-2xl font-bold text-[#606042]">${costoSalon.toLocaleString()}</p>
                    </div>
                </div>

                {/* RESUMEN DE PAGO */}
                <aside className="lg:col-span-1">
                    <div className="bg-[#606042] text-[#fbfad3] rounded-[40px] p-10 shadow-2xl sticky top-32 border border-[#4a4a32]">
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
                            disabled={enviando}
                            className={`w-full bg-[#fbfad3] text-[#606042] py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.02] transition-all shadow-lg active:scale-95 ${enviando ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {enviando ? (
                                <>Procesando... <Loader2 className="animate-spin" size={16} /></>
                            ) : (
                                <>Confirmar Pedido <Send size={16} /></>
                            )}
                        </button>

                        <p className="text-[9px] text-center mt-6 opacity-50 uppercase tracking-[0.2em] leading-relaxed">
                            Reserva sujeta a disponibilidad: <br/>
                            <span className="font-bold text-[#fbfad3]">{eventDetails.date || 'Fecha no seleccionada'}</span>
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}