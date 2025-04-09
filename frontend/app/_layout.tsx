// app/_layout.tsx
import { Slot } from 'expo-router';
import React from 'react';

export default function RootLayout() {
    return <Slot />; // Expo Router manejará automáticamente los layouts anidados
}
