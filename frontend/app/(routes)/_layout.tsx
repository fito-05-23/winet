// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

export default function AuthLayout() {
    return (
        <View style={styles.container}>
            {/* Contenido dinámico (login o registro) */}
            <Stack
                screenOptions={{
                    headerShown: false, // Oculta la barra de navegación superior
                }}
            >
                <Stack.Screen
                    name="index" // Pantalla de login
                    options={{
                        title: 'Iniciar Sesión', // Título de la pantalla
                    }}
                />
                <Stack.Screen
                    name="signup" // Pantalla de registro
                    options={{
                        title: 'Registro', // Título de la pantalla
                    }}
                />
            </Stack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        paddingTop: 100, // Espacio superior para el logo
        paddingBottom: 20, // Espacio inferior para el logo
    },
});