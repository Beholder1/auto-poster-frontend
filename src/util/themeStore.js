import {create} from 'zustand';
import {persist} from "zustand/middleware";

export const useThemeStore = create(persist((set, get) => {
    return {
        mode: "light",
        setMode: (newMode) => {
            set(() => ({
                mode: newMode
            }))
        }
    }
}, {name: "theme"}))