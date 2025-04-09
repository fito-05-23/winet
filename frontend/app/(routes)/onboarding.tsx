import { View, Text, Image, StyleSheet, ScrollView, Pressable } from "react-native";
import { Link } from "expo-router";
import { setOnboardingSeen } from "@/utils/storage"; // Para marcar el onboarding como visto

const slides = [
    {
        id: "1",
        title: "Bienvenido a Winet",
        description: "Descubre una nueva forma de disfrutar del vino.",
        image: require("@/assets/images/intro_1.png"), // Reemplaza con tu imagen
    },
    {
        id: "2",
        title: "Explora y Comparte",
        description: "Encuentra recomendaciones y comparte tus experiencias.",
        image: require("@/assets/images/intro_2.png"), // Reemplaza con tu imagen
    },
    {
        id: "3",
        title: "Únete a la Comunidad",
        description: "Conéctate con otros amantes del vino.",
        image: require("@/assets/images/intro_3.png"), // Reemplaza con tu imagen
    },
];

export default function Onboarding() {
    const handleCompleteOnboarding = () => {
        setOnboardingSeen(); // Marca el onboarding como visto
        // Redirige a la pantalla de login
        // Puedes usar un router aquí si es necesario
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {slides.map((slide) => (
                <View key={slide.id} style={styles.slide}>
                    <Image source={slide.image} style={styles.image} />
                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.description}>{slide.description}</Text>
                </View>
            ))}
            <Pressable style={styles.button} onPress={handleCompleteOnboarding}>
                <Text style={styles.buttonText}>Comenzar</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    slide: {
        alignItems: "center",
        marginBottom: 40,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        color: "#666",
    },
    button: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});