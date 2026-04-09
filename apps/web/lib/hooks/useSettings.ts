'use client';

import { useState, useEffect } from 'react';
import { SettingsAPI } from '@/lib/api/client';

export interface Settings {
    shopName: string;
    shopEmail: string;
    shopPhone: string;
    shopAddress: string;
    stockAlertDefault: number;
    shippingCostDefault: number;
    freeShippingThreshold: number;
}

const defaultSettings: Settings = {
    shopName: 'MEEY Nail Shop',
    shopEmail: 'meeybouabdellah@gmail.com',
    shopPhone: '0775436562',
    shopAddress: 'Alger, Algérie',
    stockAlertDefault: 5,
    shippingCostDefault: 600,
    freeShippingThreshold: 10000,
};

let cachedSettings: Settings | null = null;
let listeners: Array<(settings: Settings) => void> = [];

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(cachedSettings || defaultSettings);
    const [loading, setLoading] = useState(!cachedSettings);

    useEffect(() => {
        const fetchSettings = async () => {
            if (cachedSettings) return;

            try {
                const res = await SettingsAPI.get();
                if (res.success && res.data) {
                    cachedSettings = res.data;
                    listeners.forEach(l => l(res.data));
                }
            } catch (err) {

            } finally {
                setLoading(false);
            }
        };

        const onUpdate = (newSettings: Settings) => {
            setSettings(newSettings);
        };

        listeners.push(onUpdate);
        fetchSettings();

        return () => {
            listeners = listeners.filter(l => l !== onUpdate);
        };
    }, []);

    // Helper to refresh settings globally
    const refreshSettings = async () => {
        try {
            const res = await SettingsAPI.get();
            if (res.success && res.data) {
                cachedSettings = res.data;
                listeners.forEach(l => l(res.data));
            }
            return res;
        } catch (err) {

            return { success: false, error: 'Network error' };
        }
    };

    return { settings, loading, refreshSettings };
}
