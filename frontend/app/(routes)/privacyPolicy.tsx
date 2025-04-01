import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function PrivacyPolicy() {
    const router = useRouter();

    return (
        <View style={styles.outerContainer}>
            {/* Fondo gris */}
            <View style={styles.grayBackground}>
                
                {/* Flecha de volver POSICIONADA EN EL FONDO GRIS (fuera del contenedor blanco) */}
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialIcons name="arrow-back" size={28} color="#101084" />
                </TouchableOpacity>

                {/* Contenedor blanco (sin espacio extra para la flecha) */}
                <View style={styles.whiteContainer}>
                    <ScrollView 
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.title}>Política de Privacidad</Text>
                        
                        <Text style={styles.paragraph}>
                            En nuestra aplicación, la privacidad de nuestros usuarios es de suma importancia. Esta política describe cómo recopilamos, usamos y protegemos tu información.
                        </Text>

                        <Text style={styles.subtitle}>1. Información que recopilamos</Text>
                        <Text style={styles.paragraph}>
                            Solo recopilamos información esencial para el funcionamiento de la aplicación, como datos de registro básicos y preferencias de usuario. Nunca compartiremos tu información con terceros sin tu consentimiento.
                        </Text>

                        <Text style={styles.subtitle}>2. Uso de datos</Text>
                        <Text style={styles.paragraph}>
                            Utilizamos tu información únicamente para proporcionar y mejorar nuestros servicios. Todos los datos se almacenan de forma segura en servidores protegidos con cifrado de última generación.
                        </Text>

                        <Text style={styles.subtitle}>3. Tus derechos</Text>
                        <Text style={styles.paragraph}>
                            Tienes derecho a acceder, modificar o eliminar tu información personal en cualquier momento. Para ejercer estos derechos, contacta a nuestro equipo de soporte a través de la aplicación.
                        </Text>

                        <Text style={[styles.paragraph, styles.updateText]}>
                            Última actualización: 01 de Enero de 2024
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    grayBackground: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 40,
    },
    whiteContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        paddingHorizontal: 25,
        paddingVertical: 20,
        // Sin marginTop para que la flecha quede claramente fuera
    },
    backButton: {
        position: 'absolute',
        top: 10, // Posición en el área gris (fuera del contenedor blanco)
        left: 20,
        zIndex: 2,
        // Sin fondo, solo el icono
    },
    content: {
        paddingTop: 10,
        paddingBottom: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#101084',
        marginBottom: 25,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 19,
        fontWeight: '600',
        color: '#101084',
        marginTop: 15,
        marginBottom: 12,
    },
    paragraph: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        marginBottom: 15,
        textAlign: 'justify',
    },
    updateText: {
        marginTop: 20,
        color: '#999',
        textAlign: 'center',
    },
});