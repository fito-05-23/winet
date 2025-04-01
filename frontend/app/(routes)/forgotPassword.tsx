import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        // Lógica para enviar instrucciones de recuperación
        console.log('Enviando instrucciones a:', email);
        // Aquí iría la llamada a tu API/backend
        alert(`Se han enviado instrucciones a ${email}`);
        router.back(); // Vuelve atrás después de enviar
    };

    return (
        <View style={styles.container}>
            {/* Logo (mismo que en login) */}
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                />
            </View>

            {/* Título y descripción */}
            <View style={styles.header}>
                <Text style={styles.title}>Recuperar contraseña</Text>
                <Text style={styles.subtitle}>
                    Ingresa tu correo electrónico y te enviaremos las instrucciones para reestablecer tu contraseña
                </Text>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <MaterialIcons name="email" size={24} color="#666" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={handleSubmit}
                    disabled={!email} // Deshabilitado si no hay email
                >
                    <Text style={styles.submitButtonText}>Enviar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.backLink} 
                    onPress={() => router.back()}
                >
                    <Text style={styles.backLinkText}>Volver al inicio de sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    logo: {
        width: "60%",
        height: 250,
        alignSelf: "center",
        marginTop: 50,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#101084',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    form: {
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    icon: {
        marginLeft: 16,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    submitButton: {
        height: 50,
        borderRadius: 50,
        backgroundColor: '#101084',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    backLink: {
        alignSelf: 'center',
    },
    backLinkText: {
        color: '#101084',
        fontSize: 14,
        fontWeight: '500',
    },
});