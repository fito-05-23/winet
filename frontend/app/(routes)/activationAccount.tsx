import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function ActivationCode() {
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);

    const handleChange = (text, index) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Auto-focus siguiente input
        if (text && index < 5) {
            inputs.current[index + 1].focus();
        }
    };
    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleSubmit = () => {
        const fullCode = code.join('');
        if (fullCode.length === 6) {
            console.log('Código ingresado:', fullCode);
            // Aquí iría la validación del código
            alert(`Código válido: ${fullCode}`);
            router.back();
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                />
            </View>

            <View style={styles.header}>
                <Text style={styles.title}>Verificación de código</Text>
                <Text style={styles.subtitle}>
                    Ingresa el código de 6 dígitos que recibiste
                </Text>
            </View>

            <View style={styles.codeContainer}>
                {[...Array(6)].map((_, index) => (
                    <TextInput
                        key={index}
                        style={styles.codeInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={code[index]}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        ref={(ref) => (inputs.current[index] = ref)}
                        selectTextOnFocus
                    />
                ))}
            </View>

            <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: code.join('').length === 6 ? '#101084' : '#ccc' }]} 
                onPress={handleSubmit}
                disabled={code.join('').length !== 6}
            >
                <Text style={styles.submitButtonText}>Verificar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.backLink} 
                onPress={() => router.back()}
            >
                <Text style={styles.backLinkText}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
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
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    codeInput: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: '#101084',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#101084',
    },
    submitButton: {
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 20,
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