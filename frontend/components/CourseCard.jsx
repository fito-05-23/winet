// components/CourseCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CourseCard = ({ title, instructor }) => {
    return (
        <TouchableOpacity style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.instructor}>{instructor}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    instructor: {
        fontSize: 14,
        color: '#666',
    },
});

export default CourseCard;