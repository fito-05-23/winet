import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Home() {
    const nombreCliente = "Jonathan Romano"; // Nombre del cliente
    const numeroCliente = "22387"; // Número de cliente
    const plan = "Plan Básico"; // Plan del cliente
    const saldoAPagar = "$5000.00"; // Saldo a pagar
    const vencimiento = "15/10/2023"; // Fecha de vencimiento
    const puntosDisponibles = "1,500"; // Puntos disponibles

    return (
        <View style={styles.container}>
            {/* Encabezado con nombre y foto de perfil */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Hola {nombreCliente}!</Text>
                <Image
                    source={require('@/assets/images/profile.png')} // Ruta de la imagen de perfil
                    style={styles.profileImage}
                />
            </View>

            {/* Contenedor con número de cliente */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Número de cliente</Text>
                <Text style={styles.cardValue}>{numeroCliente}</Text>
            </View>

            {/* Contenedor con plan, saldo a pagar y vencimiento */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Plan y saldo a pagar</Text>
                <Text style={styles.cardValue}>{plan}</Text>
                <Text style={styles.cardValue}>{saldoAPagar}</Text>
                <Text style={styles.cardSubtitle}>Vencimiento: {vencimiento}</Text>
                <View style={styles.statusContainer}>
                    <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                    <Text style={styles.statusText}>ESTÁS AL DÍA CON TU FACTURA</Text>
                </View>
            </View>

            {/* Contenedor con puntos disponibles */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Puntos disponibles</Text>
                <Text style={styles.cardValue}>{puntosDisponibles} puntos</Text>
            </View>

            {/* Botones con iconos */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <MaterialIcons name="payment" size={24} color="#101084" />
                    <Text style={styles.buttonText}>PAGAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <MaterialIcons name="loyalty" size={24} color="#101084" />
                    <Text style={styles.buttonText}>PUNTOS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <MaterialIcons name="card-giftcard" size={24} color="#101084" />
                    <Text style={styles.buttonText}>BENEFICIOS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <MaterialIcons name="store" size={24} color="#101084" />
                    <Text style={styles.buttonText}>TIENDAS ADHERIDAS</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25, // Hace la imagen circular
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusText: {
        fontSize: 14,
        color: '#4CAF50',
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        width: '48%', // Dos botones por fila
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    buttonText: {
        fontSize: 14,
        color: '#101084',
        marginTop: 8,
        fontWeight: 'bold',
    },
});