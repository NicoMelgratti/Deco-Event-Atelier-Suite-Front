export interface Item {
    id?: number; // El ID lo genera la base de datos
    nombre: string;
    categoria: 'Estructurales' | 'Mobiliario' | 'Iluminación';
    precio: number;
    image: string; // Guardaremos aquí la URL o el Base64
    descripcion?: string;
    requiereAlturaMinima?: number;
    ocupaM2?: number;
}

export interface BudgetItem extends Item {
    quantity: number;
}

export interface EventDetails {
    type: string;
    date: string;
    guests: number;
    size: number;
    height: number;
    fullDraping: boolean;
    wallCount: number;
    ceilingDraping: boolean;
}

export interface PedidoRequest {
    fechaEvento: string;
    tipoEvento: string;
    m2Salon: number;
    costoSalon: number;
    totalFinal: number;
    detalles: DetallePedidoRequest[];
}

export interface DetallePedidoRequest {
    articuloId: number;
    cantidad: number;
    precioUnitario: number;
}