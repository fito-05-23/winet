import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState(''); // Estado faltante para la contraseña
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
    const [acceptedTerms, setAcceptedTerms] = useState(false);


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
        setShowPassword(!showPassword);
    };

    const handleSubmit = () => {
        if (emailError || !acceptedTerms || !email || !password) return;
        console.log('Email:', email);
        console.log('Contraseña:', password);
        // Lógica para enviar el registro
    };



    const isSubmitDisabled = !acceptedTerms || emailError || !email || !password;

    return (
        <View style={styles.container}>
            {/* Logo */}
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                />
            </View>
            
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={styles.subtitle}>Crea tu cuenta para comenzar</Text>
            </View>
            
            {/* Formulario de registro */}
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
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                
                <View style={styles.inputContainer}>
                    <MaterialIcons name="lock" size={24} color="#666" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
                        <MaterialIcons
                            name={showPassword ? "visibility-off" : "visibility"}
                            size={24}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.termsContainer}>
                    <TouchableOpacity 
                        style={styles.checkbox} 
                        onPress={() => setAcceptedTerms(!acceptedTerms)}
                    >
                        {acceptedTerms ? (
                            <MaterialIcons name="check-box" size={24} color="#101084" />
                        ) : (
                            <MaterialIcons name="check-box-outline-blank" size={24} color="#ccc" />
                        )}
                    </TouchableOpacity>
                    <Text style={styles.termsText}>
                        Acepto haber leído las{' '}
                        <Link href="/privacy-policy" style={styles.termsLink}>
                            Políticas de privacidad
                        </Link>
                    </Text>
                </View>
                
                <TouchableOpacity 
                    style={[
                        styles.submitButton, 
                        isSubmitDisabled && styles.disabledButton
                    ]} 
                    onPress={handleSubmit}
                    disabled={isSubmitDisabled}
                >
                    <Text style={styles.submitButtonText}>Registrarse</Text>
                </TouchableOpacity>
            </View>

            {/* Enlace a login */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
                <Link href="/login" style={styles.footerLink}>
                    Iniciar Sesión
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
    },
    form: {
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
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
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    checkbox: {
        marginRight: 8,
    },
    termsText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        flexWrap: 'wrap',
    },
    termsLink: {
        color: '#101084',
        fontWeight: 'bold',
    },
    submitButton: {
        height: 50,
        borderRadius: 50,
        backgroundColor: '#101084',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
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
    eyeIcon: {
        marginRight: 16,
    },
});