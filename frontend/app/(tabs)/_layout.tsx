import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Inicio",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Perfil",
                }}
            />
        </Tabs>
    );
}
/*// app/home/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function HomeLayout() {
    return (
        <View style={styles.container}>
            {/* Encabezado personalizado }
            <Stack.Screen
                options={{
                    title: 'Inicio',
                    headerStyle: {
                        backgroundColor: '#4CAF50',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />

            {/* Aquí se renderizará el contenido de la pantalla Home }
            <Stack />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});*/