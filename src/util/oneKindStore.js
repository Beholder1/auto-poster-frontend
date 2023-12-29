import {create} from 'zustand';
import {persist} from "zustand/middleware";

export const useOneKindStore = create(persist((set, get) => {
    return {
        mode: true,
        setMode: (newMode) => {
            set(() => ({
                mode: newMode
            }))
        }
    }
}, {name: "oneKind"}))