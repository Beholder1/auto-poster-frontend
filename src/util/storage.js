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

export const useRefreshAccountsQuantityStore = create(persist((set, get) => {
    return {
        mode: 1,
        setMode: (newMode) => {
            set(() => ({
                mode: newMode
            }))
        }
    }
}, {name: "refreshAccountsQuantity"}))

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

export const usePostsQuantityStore = create(persist((set, get) => {
    return {
        mode: 1,
        setMode: (newMode) => {
            set(() => ({
                mode: newMode
            }))
        }
    }
}, {name: "postsQuantity"}))

export const useHideBeforeFriendsStore = create(persist((set, get) => {
    return {
        mode: true,
        setMode: (newMode) => {
            set(() => ({
                mode: newMode
            }))
        }
    }
}, {name: "hideBeforeFriends"}))

export const useRefreshAllAccountsStore = create(persist((set, get) => {
    return {
        mode: true,
        setMode: (newMode) => {
            set(() => ({
                mode: newMode
            }))
        }
    }
}, {name: "refreshAllAccounts"}))

export const useToFinishStore = create(persist((set, get) => {
    return {
        mode: true,
        setMode: (newMode) => {
            set(() => ({
                mode: newMode
            }))
        }
    }
}, {name: "toFinish"}))
