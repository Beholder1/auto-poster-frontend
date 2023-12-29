import {create} from 'zustand';
import {persist} from "zustand/middleware";

export const useAccountsQuantityStore = create(persist((set, get) => {
    return {
        mode: 1,
        setMode: (newMode) => {
            set(() => ({
                mode: newMode
            }))
        }
    }
}, {name: "accountsQuantity"}))