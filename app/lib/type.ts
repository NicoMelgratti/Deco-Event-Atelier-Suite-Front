export interface Item {
    id: string;
    name: string;
    category: 'Estructurales' | 'Mobiliario' | 'Iluminación';
    price: number;
    image: string;
    description?: string;
    unit?: string;
    warning?: string;
}

export interface EventDetails {
    type: string;
    date: string;
    guests: number;
    size: number;
    height: number;
    fullDraping: boolean; // Entelado completo
    wallCount: number;   // Cantidad de paredes
    ceilingDraping: boolean; // Si se hace techo o no
}

export interface BudgetItem extends Item {
    quantity: number;
}
