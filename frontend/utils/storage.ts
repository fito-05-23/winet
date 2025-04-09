import AsyncStorage from "@react-native-async-storage/async-storage";

// Obtener el estado de onboarding
export const getOnboardingSeen = async () => {
    try {
        const value = await AsyncStorage.getItem("hasSeenOnboarding");
        return value === "true"; // Devuelve true si ya ha visto el onboarding
    } catch (error) {
        console.error("Error al obtener el estado de onboarding:", error);
        return false;
    }
};

// Guardar el estado de onboarding
export const setOnboardingSeen = async () => {
    try {
        await AsyncStorage.setItem("hasSeenOnboarding", "true");
    } catch (error) {
        console.error("Error al guardar el estado de onboarding:", error);
    }
};