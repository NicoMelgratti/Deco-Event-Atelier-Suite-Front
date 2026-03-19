'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Package, Upload, Trash2, Check, X, Calendar, ShoppingBag } from 'lucide-react';

export default function AdminPage() {
    const [autenticado, setAutenticado] = useState(false);
    const [password, setPassword] = useState('');
    const [tabActiva, setTabActiva] = useState<'inventario' | 'pedidos'>('inventario');

    // Estados para Inventario
    const [articulos, setArticulos] = useState<any[]>([]);
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('Mobiliario');
    const [precio, setPrecio] = useState('');
    const [imagenBase64, setImagenBase64] = useState('');

    // Estados para Pedidos
    const [pedidos, setPedidos] = useState<any[]>([]);

    useEffect(() => {
        if (autenticado) {
            cargarInventario();
            cargarPedidos();
        }
    }, [autenticado]);

    const cargarInventario = async () => {
        const res = await fetch('http://localhost:8080/api/articulos');
        const data = await res.json();
        setArticulos(data);
    };

    const cargarPedidos = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/pedidos');
            const data = await res.json();
            console.log("Datos recibidos del back:", data); // Esto lo ves en la consola (F12)
            setPedidos(data);
        } catch (error) {
            console.error("Error al buscar pedidos:", error);
        }
    };

    const manejarLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') setAutenticado(true);
        else alert('Contraseña incorrecta');
    };

    // --- LÓGICA DE INVENTARIO ---
    const publicarArticulo = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8080/api/articulos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, categoria, precio: parseFloat(precio) }),
        });

        if (res.ok) {
            const guardado = await res.json();
            if (imagenBase64) {
                const almacen = JSON.parse(localStorage.getItem('atelier_fotos') || '{}');
                almacen[guardado.id] = imagenBase64;
                localStorage.setItem('atelier_fotos', JSON.stringify(almacen));
            }
            alert('¡Artículo agregado!');
            setNombre(''); setPrecio(''); setImagenBase64('');
            cargarInventario();
        }
    };

    const eliminarArticulo = async (id: number) => {
        if (!confirm('¿Seguro que quieres eliminar esta pieza del catálogo?')) return;

        const res = await fetch(`http://localhost:8080/api/articulos/${id}`, { method: 'DELETE' });
        if (res.ok) {
            // Limpiar foto del localstorage
            const almacen = JSON.parse(localStorage.getItem('atelier_fotos') || '{}');
            delete almacen[id];
            localStorage.setItem('atelier_fotos', JSON.stringify(almacen));
            cargarInventario();
        }
    };

    // --- LÓGICA DE PEDIDOS ---
    const actualizarEstadoPedido = async (id: number, nuevoEstado: string) => {
        const res = await fetch(`http://localhost:8080/api/pedidos/${id}/estado?estado=${nuevoEstado}`, {
            method: 'PATCH'
        });
        if (res.ok) cargarPedidos();
    };

    if (!autenticado) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
                <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-[#ecefec] w-full max-w-md text-center">
                    <Lock className="w-12 h-12 mx-auto mb-8 text-[#606042]" />
                    <h2 className="font-serif text-3xl mb-10 italic">Acceso Atelier</h2>
                    <form onSubmit={manejarLogin} className="space-y-6">
                        <input
                            type="password" placeholder="Contraseña" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#fdfcf5] border border-[#ecefec] p-5 rounded-full text-center outline-none focus:ring-1 focus:ring-[#606042]"
                        />
                        <button type="submit" className="w-full bg-[#606042] text-[#fbfad3] py-5 rounded-full font-bold uppercase tracking-widest text-xs">Entrar</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto w-full px-6 py-10">
            {/* TABS SELECTOR */}
            <div className="flex gap-8 mb-12 border-b border-[#ecefec] pb-4 justify-center">
                <button
                    onClick={() => setTabActiva('inventario')}
                    className={`font-serif text-2xl italic transition-all ${tabActiva === 'inventario' ? 'text-[#606042] border-b-2 border-[#606042]' : 'text-[#adb3b0]'}`}
                >
                    Gestión de Catálogo
                </button>
                <button
                    onClick={() => setTabActiva('pedidos')}
                    className={`font-serif text-2xl italic transition-all ${tabActiva === 'pedidos' ? 'text-[#606042] border-b-2 border-[#606042]' : 'text-[#adb3b0]'}`}
                >
                    Pedidos y Fechas
                </button>
            </div>

            {/* TAB: INVENTARIO */}
            {tabActiva === 'inventario' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Formulario Carga */}
                    <form onSubmit={publicarArticulo} className="bg-white p-8 rounded-[32px] shadow-xl border border-[#ecefec] h-fit space-y-6">
                        <h3 className="font-serif text-xl italic mb-4">Nueva Pieza</h3>
                        <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-[#f2f4f2] p-4 rounded-xl outline-none" required />
                        <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full bg-[#f2f4f2] p-4 rounded-xl outline-none">
                            <option value="Mobiliario">Mobiliario</option>
                            <option value="Estructurales">Estructurales</option>
                            <option value="Iluminación">Iluminación</option>
                        </select>
                        <input type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} className="w-full bg-[#f2f4f2] p-4 rounded-xl outline-none" required />
                        <div className="border-2 border-dashed border-[#ecefec] p-4 rounded-xl text-center">
                            <input type="file" onChange={(e: any) => {
                                const reader = new FileReader();
                                reader.onload = () => setImagenBase64(reader.result as string);
                                reader.readAsDataURL(e.target.files[0]);
                            }} className="text-xs" />
                        </div>
                        <button type="submit" className="w-full bg-[#606042] text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-widest">Registrar</button>
                    </form>

                    {/* Lista para Eliminar */}
                    <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-xl border border-[#ecefec]">
                        <h3 className="font-serif text-xl italic mb-6">Inventario Actual</h3>
                        <div className="space-y-4">
                            {articulos.map(art => (
                                <div key={art.id} className="flex items-center justify-between p-4 bg-[#fdfcf5] rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden">
                                            <img src={JSON.parse(localStorage.getItem('atelier_fotos') || '{}')[art.id]} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{art.nombre}</p>
                                            <p className="text-[10px] uppercase text-[#adb3b0]">{art.categoria}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => eliminarArticulo(art.id)} className="text-red-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: PEDIDOS */}
            {tabActiva === 'pedidos' && (
                <div className="space-y-6">
                    {pedidos.length === 0 ? (
                        <p className="text-center py-20 italic text-[#adb3b0]">No hay pedidos pendientes.</p>
                    ) : (
                        pedidos.map(ped => (
                            <div key={ped.id} className="bg-white rounded-[32px] p-8 shadow-xl border border-[#ecefec] flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex gap-8 items-center">
                                    <div className="bg-[#f2f4f2] p-4 rounded-2xl"><Calendar className="text-[#606042]" /></div>
                                    <div>
                                        <h4 className="font-serif text-2xl italic">{ped.tipoEvento}</h4>
                                        <p className="text-sm font-bold text-[#606042]">{ped.fechaEvento}</p>
                                        <p className="text-xs text-[#adb3b0] uppercase tracking-widest mt-1">{ped.m2Salon} m² • {ped.detalles?.length || 0} Artículos</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-[#adb3b0] mb-1">Inversión Total</p>
                                    <p className="font-serif text-3xl font-bold">${ped.totalFinal?.toLocaleString()}</p>
                                </div>

                                <div className="flex gap-3">
                                    {ped.estado === 'PENDIENTE' ? (
                                        <>
                                            <button onClick={() => actualizarEstadoPedido(ped.id, 'ACEPTADO')} className="bg-green-50 text-green-600 p-4 rounded-full hover:bg-green-600 hover:text-white transition-all"><Check size={20} /></button>
                                            <button onClick={() => actualizarEstadoPedido(ped.id, 'RECHAZADO')} className="bg-red-50 text-red-600 p-4 rounded-full hover:bg-red-600 hover:text-white transition-all"><X size={20} /></button>
                                        </>
                                    ) : (
                                        <span className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest ${ped.estado === 'ACEPTADO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {ped.estado}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}