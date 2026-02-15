import { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        shippingCharge: 0, // Default to 0 until loaded
        freeShippingThreshold: 0,
        loading: true
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Determine API URL based on environment or existing axios config
                // validated in pervious steps that axios baseURL is correct
                const { data } = await axios.get('/settings');
                // Ensure values are numbers
                setSettings({
                    shippingCharge: Number(data.shippingCharge),
                    freeShippingThreshold: Number(data.freeShippingThreshold),
                    loading: false
                });
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                // Fallback defaults if API fails - Force Free Shipping as per requirement
                setSettings({
                    shippingCharge: 0,
                    freeShippingThreshold: 0,
                    loading: false
                });
            }
        };

        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;
