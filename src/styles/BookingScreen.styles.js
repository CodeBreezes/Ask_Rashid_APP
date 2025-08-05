import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Page container below header
  pageContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f0f5', // Soft gray for background
    padding: 16,
    paddingTop: 10, // Ensure content starts below header
  },

  // Header (shared style with login/profile)
  headerContainer: {
    height: 55,
    backgroundColor: '#F9A825',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  headerSpacer: {
    width: 24, 
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 10,
  },

 input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 25,
  padding: 12,
  marginBottom: 10,
  backgroundColor: '#fff',   
  color: '#000',              
},


  dropdownTouchable: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 12,
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
  },

  dateButton: {
    backgroundColor: '#eee',
    padding: 14,
    borderRadius: 25,
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#333',
    fontSize: 12,
  },

  bookButton: {
    backgroundColor: '#0D5EA6',
    padding: 16,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },

  serviceCard: {
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  serviceCost: {
    fontSize: 15,
    fontWeight: '600',
    color: '#28a745',
  },
  serviceDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },

  modalClose: {
    marginTop: 12,
    alignSelf: 'center',
    padding: 10,
  },
  modalCloseText: {
    color: '#ff5252',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsButtonText: {
    color: 'blue',
    }
});
