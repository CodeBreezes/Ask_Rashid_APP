import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { changePassword } from '../../api/userApi';
import MainLayout from '../../components/MainLayout';

const { width } = Dimensions.get('window');

const ChangePasswordScreen = () => {
    const navigation = useNavigation();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(null); // 'success' | 'error'

    const handleChangePassword = async () => {
        setMessage('');
        setMessageType(null);

        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage('Please fill in all fields');
            setMessageType('error');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match');
            setMessageType('error');
            return;
        }

        try {
            setLoading(true);
            const response = await changePassword(oldPassword, newPassword, confirmPassword);

            if (response?.isUpdated && !response?.errorMessages?.length) {
                const successMsg = response?.data?.successMessages?.[0] || 'Password changed successfully!';
                setMessage(successMsg);
                setMessageType('success');

                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');

                setTimeout(() => {
                    setMessage('');
                    setMessageType(null);
                }, 4000);
            } else {
                const errorMsg = response?.data?.errorMessages?.[0] || 'Old password is incorrect.';
                setMessage(errorMsg);
                setMessageType('error');
            }
        } catch (error) {
            const errorMsg =
                error?.response?.data?.errorMessages?.[0] ||
                error?.response?.data?.message ||
                'Something went wrong. Please try again.';
            setMessage(errorMsg);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout title="Change Password">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Change Password</Text>
                        <Text style={styles.subHeader}>
                            Ensure your account is secure by updating your password regularly.
                        </Text>
                    </View>

                    {message ? (
                        <View
                            style={[
                                styles.messageBox,
                                messageType === 'success' ? styles.successBox : styles.errorBox,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.messageText,
                                    messageType === 'success' ? styles.successText : styles.errorText,
                                ]}
                            >
                                {message}
                            </Text>
                        </View>
                    ) : null}

                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Old Password</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry
                                placeholder="Enter your current password"
                                placeholderTextColor="#999"
                                value={oldPassword}
                                onChangeText={setOldPassword}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>New Password</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry
                                placeholder="Create a strong new password"
                                placeholderTextColor="#999"
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry
                                placeholder="Confirm your new password"
                                placeholderTextColor="#999"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleChangePassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Update Password</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </MainLayout>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
        backgroundColor: '#f5f7fa',
    },
    headerContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e2a78',
    },
    subHeader: {
        fontSize: 16,
        color: '#667',
        marginTop: 5,
        textAlign: 'center',
        maxWidth: 350,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 8,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f0f4f8',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    button: {
        backgroundColor: '#4c66f5',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#4c66f5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonDisabled: {
        backgroundColor: '#a8b9f0',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    messageBox: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 500,
    },
    successBox: {
        backgroundColor: '#d1f7c4',
        borderColor: '#28a745',
        borderWidth: 1,
    },
    errorBox: {
        backgroundColor: '#fde2e2',
        borderColor: '#dc3545',
        borderWidth: 1,
    },
    messageText: {
        textAlign: 'center',
        fontSize: 15,
    },
    successText: {
        color: '#155724',
    },
    errorText: {
        color: '#721c24',
    },
});

export default ChangePasswordScreen;
