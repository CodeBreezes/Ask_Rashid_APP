 import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  inputContainer: {
    gap: 16,
    marginTop: 30,
  },

  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },

  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },

  forgotPasswordText: {
    fontSize: 14,
    color: '#666',
  },

  loginButton: {
    backgroundColor: '#EAA64D',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 30,
    elevation: 2,
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  registerText: {
    color: '#666',
    fontSize: 14,
  },

  registerLink: {
    color: '#28a745',
    fontSize: 14,
    fontWeight: '600',
  },

  googleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  googleSignInText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },

  // Beautiful Google Modal Styles
  googleModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  googleModalBox: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    alignItems: 'center',
  },

  googleModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },

  googleModalSubText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },

  googleInput: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#000',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  googleSubmitButton: {
    width: '100%',
    backgroundColor: '#6A5ACD',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  googleSubmitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  googleCancelText: {
    marginTop: 16,
    color: '#cc0000',
    fontSize: 14,
    fontWeight: '600',
  },

  // Optional: Spinner/Loader overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default styles;
