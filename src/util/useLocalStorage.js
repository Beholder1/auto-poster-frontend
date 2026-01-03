import {useEffect, useState} from "react";

export function useLocalState(defaultValue, key) {
    const [value, setValue] = useState(() => {
        try {
            const localStorageValue = localStorage.getItem(key);
            if (localStorageValue !== null) {
                try {
                    return JSON.parse(localStorageValue);
                } catch (e) {
                    console.error(`Error parsing localStorage key "${key}":`, e);
                    return localStorageValue;
                }
            }
            return defaultValue;
        } catch (e) {
            console.error(`Error reading localStorage key "${key}":`, e);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            const valueToStore = typeof value === 'string' ? JSON.stringify(value) : JSON.stringify(value);
            localStorage.setItem(key, JSON.stringify(value))
        } catch (e) {
            console.error(`Error writing to localStorage key "${key}":`, e);
        }
    }, [key, value]);
    
    return [value, setValue]
}