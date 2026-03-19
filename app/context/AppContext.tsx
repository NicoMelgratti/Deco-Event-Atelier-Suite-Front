'use client';
import React, { createContext, useContext, useState } from 'react';
import { BudgetItem, EventDetails, Item } from '../lib/types';

interface AppContextType {
    budget: BudgetItem[];
    setBudget: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
    eventDetails: EventDetails;
    setEventDetails: React.Dispatch<React.SetStateAction<EventDetails>>;
    addToBudget: (item: Item) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [budget, setBudget] = useState<BudgetItem[]>([]);
    const [eventDetails, setEventDetails] = useState<EventDetails>({
        type: '', date: '', guests: 0, size: 0, height: 0,
        fullDraping: false, wallCount: 0, ceilingDraping: false
    });

    const addToBudget = (item: Item) => {
        setBudget(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    return (
        <AppContext.Provider value={{ budget, setBudget, eventDetails, setEventDetails, addToBudget }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp debe usarse dentro de AppProvider');
    return context;
};