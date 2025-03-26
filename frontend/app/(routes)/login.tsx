import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState(''); // Estado faltante para la contraseña
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
    
    const validateEmail = (text) => {
        setEmail(text);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (text.length === 0) {
            setEmailError('');
        } else if (!emailRegex.test(text)) {
            setEmailError('Por favor ingresa un email válido');
        } else {
            setEmailError('');
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword); // Alterna la visibilidad de la contraseña
    };

    const handleLogin = () => {
        // Aca va la lógica para iniciar sesión
        console.log('Redirigiendo a la página home...');
        router.push('/home'); // Redirige a la página home
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/logo.png')} // Asegúrate de que la ruta sea correcta
                    style={styles.logo}
                />
            </View>
            <View style={styles.header}>
                <Text style={styles.subtitle}>Ingresa para ver tus facturas, solicitar servicios y gestionar tus puntos</Text>
            </View>
            {/* Formulario de login */}
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <MaterialIcons name="email" size={24} color="#666" style={styles.icon} />
                    <TextInput
                        style={[
                            styles.input,
                            emailError && styles.inputError
                        ]}
                        placeholder="Correo electrónico"
                        value={email}
                        onChangeText={validateEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <MaterialIcons name="lock" size={24} color="#666" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        secureTextEntry={!showPassword} // Oculta o muestra la contraseña
                    />
                    {/* Botón de ojo para mostrar/ocultar contraseña */}
                    <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
                        <MaterialIcons
                            name={showPassword ? "visibility-off" : "visibility"} // Cambia el ícono según el estado
                            size={24}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>
                {/* Enlace "Olvidé mi contraseña" */}
                <Link href="/forgot-password" style={styles.forgotPassword}>
                     Olvidé mi contraseña
                </Link>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>

            {/* Opciones alternativas */}
            <View style={styles.socialButtons}>
                <Text style={styles.socialText}>O inicia sesión con:</Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 20,
                        gap: 10,
                    }}
                >
                    {/* Icono de Google */}
                    <TouchableOpacity>
                        <FontAwesome name="google" size={30} color="#101084" />
                    </TouchableOpacity>
                    {/* Icono de GitHub */}
                    <TouchableOpacity>
                        <MaterialIcons name="facebook" size={30} color="#101084" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Enlace a registro */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
                <Link href="/signup" style={styles.footerLink}>
                    Registrate
                </Link>
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
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    form: {
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1, // Línea inferior
        borderBottomColor: '#ccc', // Color de la línea inferior
    },
    icon: {
        marginLeft: 16,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
    },
    inputError: {
        borderBottomColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
        marginLeft: 16,
    },
    eyeIcon: {
        marginRight: 16,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#101084',
        fontSize: 14,
    },
    loginButton: {
        height: 50,
        borderRadius: 50,
        backgroundColor: '#101084',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    socialButtons: {
        alignItems: 'center',
        marginBottom: 24,
    },
    socialText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    socialIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    footerLink: {
        fontSize: 14,
        color: '#101084',
        fontWeight: 'bold',
    },
});