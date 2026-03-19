'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Trash2, Check, X, Calendar, ShoppingBag, User, Phone, ExternalLink } from 'lucide-react';

export default function AdminPage() {
    const [autenticado, setAutenticado] = useState(false);
    const [password, setPassword] = useState('');
    const [tabActiva, setTabActiva] = useState<'inventario' | 'pedidos'>('inventario');

    // CONFIGURACIÓN GLOBAL
    const [precioM2, setPrecioM2] = useState(0);

    // INVENTARIO
    const [articulos, setArticulos] = useState<any[]>([]);
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('Mobiliario');
    const [precio, setPrecio] = useState('');
    const [imagenBase64, setImagenBase64] = useState('');

    // PEDIDOS
    const [pedidos, setPedidos] = useState<any[]>([]);

    useEffect(() => {
        if (autenticado) {
            cargarInventario();
            cargarPedidos();
            cargarPrecioM2();
        }
    }, [autenticado]);

    const cargarPrecioM2 = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/config/PRECIO_M2_ENTELADO');
            const data = await res.json();
            setPrecioM2(data);
        } catch (e) { console.error("Error cargando precio config"); }
    };

    const actualizarPrecioM2 = async () => {
        const res = await fetch('http://localhost:8080/api/config/PRECIO_M2_ENTELADO', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(precioM2)
        });
        if (res.ok) alert("¡Precio del m² actualizado!");
    };

    const cargarInventario = async () => {
        const res = await fetch('http://localhost:8080/api/articulos');
        const data = await res.json();
        setArticulos(data);
    };

    const cargarPedidos = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/pedidos');
            const data = await res.json();
            setPedidos(data);
        } catch (e) { console.error("Error cargando pedidos"); }
    };

    const manejarLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') setAutenticado(true);
        else alert('Contraseña incorrecta');
    };

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
        if (!confirm('¿Eliminar esta pieza?')) return;
        const res = await fetch(`http://localhost:8080/api/articulos/${id}`, { method: 'DELETE' });
        if (res.ok) {
            const almacen = JSON.parse(localStorage.getItem('atelier_fotos') || '{}');
            delete almacen[id];
            localStorage.setItem('atelier_fotos', JSON.stringify(almacen));
            cargarInventario();
        }
    };

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
                        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#fdfcf5] border border-[#ecefec] p-5 rounded-full text-center outline-none focus:ring-1 focus:ring-[#606042]" />
                        <button type="submit" className="w-full bg-[#606042] text-[#fbfad3] py-5 rounded-full font-bold uppercase tracking-widest text-xs">Entrar</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto w-full px-6 py-10">
            {/* SELECTOR DE TABS */}
            <div className="flex gap-8 mb-12 border-b border-[#ecefec] pb-4 justify-center">
                <button onClick={() => setTabActiva('inventario')} className={`font-serif text-2xl italic transition-all ${tabActiva === 'inventario' ? 'text-[#606042] border-b-2 border-[#606042]' : 'text-[#adb3b0]'}`}>Gestión de Catálogo</button>
                <button onClick={() => setTabActiva('pedidos')} className={`font-serif text-2xl italic transition-all ${tabActiva === 'pedidos' ? 'text-[#606042] border-b-2 border-[#606042]' : 'text-[#adb3b0]'}`}>Pedidos y Fechas</button>
            </div>

            {tabActiva === 'inventario' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* BANNER PRECIO CONFIG */}
                    <div className="col-span-1 lg:col-span-3 bg-[#fdfcf5] p-6 rounded-[32px] border border-[#ecefec] mb-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#606042] p-4 rounded-2xl text-white shadow-lg"><ShoppingBag size={24} /></div>
                            <div>
                                <h4 className="font-serif text-xl italic text-[#606042]">Valor del Entelado</h4>
                                <p className="text-[10px] uppercase text-[#adb3b0] tracking-[0.2em]">Precio por metro cuadrado (m²)</p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <input type="number" value={precioM2} onChange={(e) => setPrecioM2(parseFloat(e.target.value))} className="w-full md:w-32 pl-4 py-4 bg-white border border-[#ecefec] rounded-2xl outline-none font-bold text-[#606042]" />
                            <button onClick={actualizarPrecioM2} className="bg-[#606042] text-white px-8 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-[#4a4a32] transition-all">Actualizar</button>
                        </div>
                    </div>

                    {/* FORM CARGA */}
                    <form onSubmit={publicarArticulo} className="bg-white p-8 rounded-[32px] shadow-xl border border-[#ecefec] h-fit space-y-6">
                        <h3 className="font-serif text-xl italic mb-4">Nueva Pieza</h3>
                        <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-[#f2f4f2] p-4 rounded-xl outline-none" required />
                        <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full bg-[#f2f4f2] p-4 rounded-xl outline-none text-sm">
                            <option value="Mobiliario">Mobiliario</option>
                            <option value="Estructurales">Estructurales</option>
                            <option value="Iluminación">Iluminación</option>
                        </select>
                        <input type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} className="w-full bg-[#f2f4f2] p-4 rounded-xl outline-none" required />
                        <div className="border-2 border-dashed border-[#ecefec] p-4 rounded-xl text-center bg-[#fdfcf5]">
                            <input type="file" onChange={(e: any) => {
                                const reader = new FileReader();
                                reader.onload = () => setImagenBase64(reader.result as string);
                                reader.readAsDataURL(e.target.files[0]);
                            }} className="text-[10px]" />
                        </div>
                        <button type="submit" className="w-full bg-[#606042] text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-lg">Registrar</button>
                    </form>

                    {/* LISTA INVENTARIO */}
                    <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-xl border border-[#ecefec]">
                        <h3 className="font-serif text-xl italic mb-6">Inventario Actual</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {articulos.map(art => (
                                <div key={art.id} className="flex items-center justify-between p-4 bg-[#fdfcf5] rounded-2xl border border-[#f2f4f2]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-[#ecefec]">
                                            <img src={JSON.parse(localStorage.getItem('atelier_fotos') || '{}')[art.id]} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-bold text-sm text-[#606042]">{art.nombre}</span>
                                    </div>
                                    <button onClick={() => eliminarArticulo(art.id)} className="text-red-200 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {tabActiva === 'pedidos' && (
                <div className="space-y-6">
                    {pedidos.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[40px] border border-[#ecefec] italic text-[#adb3b0]">Sin pedidos pendientes.</div>
                    ) : (
                        pedidos.map(ped => (
                            <div key={ped.id} className="bg-white rounded-[40px] p-8 shadow-xl border border-[#ecefec] flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex gap-8 items-center">
                                    <div className="bg-[#f2f4f2] p-5 rounded-2xl"><Calendar className="text-[#606042] w-7 h-7" /></div>
                                    <div>
                                        <h4 className="font-serif text-3xl italic text-[#606042]">{ped.tipoEvento}</h4>
                                        <p className="text-sm font-bold text-[#606042] bg-[#fbfad3] px-3 py-1 rounded-full w-fit mt-1">{ped.fechaEvento}</p>
                                        <div className="mt-3 flex flex-col gap-1">
                                            <p className="text-xs text-[#606042] font-semibold flex items-center gap-2"><User size={12}/> {ped.nombreContacto}</p>
                                            <a href={`https://wa.me/${ped.telefonoContacto}`} target="_blank" className="text-[11px] text-green-600 font-bold flex items-center gap-2"><Phone size={12}/> {ped.telefonoContacto} <ExternalLink size={10}/></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-[9px] uppercase font-bold text-[#adb3b0] tracking-[0.3em] mb-1">Inversión Estimada</p>
                                    <p className="font-serif text-4xl font-bold text-[#606042]">${ped.totalEstimado?.toLocaleString()}</p>
                                    <p className="text-[10px] text-[#adb3b0] mt-1">{ped.salonM2} m² • {ped.detalles?.length || 0} Artículos</p>
                                </div>
                                <div className="flex gap-4">
                                    {ped.estado === 'PENDIENTE' ? (
                                        <>
                                            <button onClick={() => actualizarEstadoPedido(ped.id, 'ACEPTADO')} className="bg-[#f2f4f2] text-green-600 p-5 rounded-full hover:bg-green-600 hover:text-white transition-all"><Check size={24} /></button>
                                            <button onClick={() => actualizarEstadoPedido(ped.id, 'RECHAZADO')} className="bg-[#f2f4f2] text-red-400 p-5 rounded-full hover:bg-red-500 hover:text-white transition-all"><X size={24} /></button>
                                        </>
                                    ) : (
                                        <span className={`px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] ${ped.estado === 'ACEPTADO' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>{ped.estado}</span>
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