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
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import Texts from "../../components/Texts";

const { width } = Dimensions.get('window');

const ChangePasswordScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(null);

    // 👇 Added states for visibility toggles
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChangePassword = async () => {
        setMessage('');
        setMessageType(null);

        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage(t('changePasswordFillAll'));
            setMessageType('error');
            return;
        }


        if (newPassword !== confirmPassword) {
            setMessage(t('changePasswordMismatch'));
            setMessageType('error');
            return;
        }


        try {
            setLoading(true);
            const response = await changePassword(oldPassword, newPassword, confirmPassword);

            if (response?.isUpdated && !response?.errorMessages?.length) {
                const successMsg = response?.data?.successMessages?.[0] || t('changePasswordSuccess');
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
                const errorMsg = response?.data?.errorMessages?.[0] || t('changePasswordIncorrectOld');
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
        <MainLayout title={t('changePasswordTitle')}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.headerContainer}>
                        <Texts style={styles.header}>{t('changePasswordHeader')}</Texts>
                        <Texts style={styles.subHeader}>
                            {t('changePasswordSubHeader')}
                        </Texts>
                    </View>

                    {message ? (
                        <View
                            style={[
                                styles.messageBox,
                                messageType === 'success' ? styles.successBox : styles.errorBox,
                            ]}
                        >
                            <Texts
                                style={[
                                    styles.messageText,
                                    messageType === 'success' ? styles.successText : styles.errorText,
                                ]}
                            >
                                {message}
                            </Texts>
                        </View>
                    ) : null}

                    <View style={styles.card}>
                        {/* Old Password */}
                        <View style={styles.inputGroup}>
                            <Texts style={styles.label}>{t('oldPassword')}</Texts>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry={!showOld}
                                    placeholder={t('oldPasswordPlaceholder')}
                                    placeholderTextColor="#999"
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                />
                                <TouchableOpacity onPress={() => setShowOld(!showOld)} style={styles.eyeIcon}>
                                    <Icon name={showOld ? 'eye-off' : 'eye'} size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* New Password */}
                        <View style={styles.inputGroup}>
                            <Texts style={styles.label}>{t('newPassword')}</Texts>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry={!showNew}
                                    placeholder={t('newPasswordPlaceholder')}
                                    placeholderTextColor="#999"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeIcon}>
                                    <Icon name={showNew ? 'eye-off' : 'eye'} size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm New Password */}
                        <View style={styles.inputGroup}>
                            <Texts style={styles.label}>{t('confirmNewPassword')}</Texts>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry={!showConfirm}
                                    placeholder={t('confirmNewPasswordPlaceholder')}
                                    placeholderTextColor="#999"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>
                                    <Icon name={showConfirm ? 'eye-off' : 'eye'} size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleChangePassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Texts style={styles.buttonText}> {t('updatePasswordButton')}</Texts>
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
        color: '#0D5EA6',
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
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f4f8',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingRight: 10,
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    eyeIcon: {
        paddingHorizontal: 6,
    },
    button: {
        backgroundColor: '#0D5EA6',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#0D5EA6',
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
