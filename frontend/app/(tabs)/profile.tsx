import { Link } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Profile() {
    return (
        <View>
            <Text>Pantalla de Perfil</Text>
            <Link href="/(routes)/onboarding" asChild>
                <Button title="Cerrar Sesión" />
            </Link>
        </View>
    );
}