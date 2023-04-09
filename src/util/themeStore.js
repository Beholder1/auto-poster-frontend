import create from 'zustand';
import {persist} from "zustand/middleware";

export const useThemeStore = create(persist((set, get) => {
    return {
        mode: "light",
        setMode: () => {
            const currentMode = get().mode
            const newMode = currentMode === "light" ? "dark" : "light"
            set(() => ({
                mode: newMode
            }))
        }
    }
}, {name: "theme"}))