import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Image,
  Alert,
  Dimensions,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Types
interface User {
  id: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  nationality: string;
  phone: string;
  email: string;
  address?: string;
  passportNumber?: string;
  visaNumber?: string;
  insuranceNumber?: string;
  kycStatus: 'Pending' | 'Verified' | 'Rejected';
  registrationDate: string;
  registeredBy: string;
  profileImage?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: string;
  notes?: string;
  auditTrail?: Array<{
    action: string;
    timestamp: string;
    officer: string;
  }>;
}

interface FilterOptions {
  kycStatus: string;
  nationality: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  issuerOfficer: string;
}

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;

const ViewUsersScreen: React.FC = () => {
  // State Management
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    kycStatus: '',
    nationality: '',
    dateRange: { start: null, end: null },
    issuerOfficer: '',
  });
  const [showDatePicker, setShowDatePicker] = useState<{
    visible: boolean;
    type: 'start' | 'end';
  }>({ visible: false, type: 'start' });

  // Mock Data (Replace with your API call)
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setRefreshing(true);
    // Simulate API call - Replace with your actual API
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: 'USR001',
          fullName: 'John Doe',
          gender: 'Male',
          dateOfBirth: '1990-05-15',
          nationality: 'USA',
          phone: '+1-555-0123',
          email: 'john.doe@email.com',
          address: '123 Main St, New York, NY',
          passportNumber: 'P123456789',
          kycStatus: 'Verified',
          registrationDate: '2024-01-15',
          registeredBy: 'OFF001',
          profileImage: 'https://via.placeholder.com/100',
          emergencyContact: {
            name: 'Jane Doe',
            phone: '+1-555-0124',
            relationship: 'Spouse'
          },
          medicalInfo: 'No known allergies',
          auditTrail: [
            { action: 'Created', timestamp: '2024-01-15T10:00:00Z', officer: 'OFF001' },
            { action: 'KYC Verified', timestamp: '2024-01-16T14:30:00Z', officer: 'OFF002' }
          ]
        },
        {
          id: 'USR002',
          fullName: 'Maria Garcia',
          gender: 'Female',
          dateOfBirth: '1985-08-22',
          nationality: 'Spain',
          phone: '+34-600-123456',
          email: 'maria.garcia@email.com',
          kycStatus: 'Pending',
          registrationDate: '2024-02-10',
          registeredBy: 'OFF002',
          profileImage: 'https://via.placeholder.com/100',
        },
        {
          id: 'USR003',
          fullName: 'Ahmed Hassan',
          gender: 'Male',
          dateOfBirth: '1992-12-03',
          nationality: 'Egypt',
          phone: '+20-100-1234567',
          email: 'ahmed.hassan@email.com',
          kycStatus: 'Rejected',
          registrationDate: '2024-01-28',
          registeredBy: 'OFF001',
          profileImage: 'https://via.placeholder.com/100',
        }
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setRefreshing(false);
    }, 1000);
  };

  // Calculate age from DOB
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Search and Filter Logic
  const filteredAndSearchedUsers = useMemo(() => {
    let result = filteredUsers;

    // Apply search
    if (searchQuery.trim()) {
      result = result.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.passportNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.kycStatus) {
      result = result.filter(user => user.kycStatus === filters.kycStatus);
    }
    if (filters.nationality) {
      result = result.filter(user => user.nationality === filters.nationality);
    }
    if (filters.issuerOfficer) {
      result = result.filter(user => user.registeredBy === filters.issuerOfficer);
    }
    if (filters.dateRange.start && filters.dateRange.end) {
      result = result.filter(user => {
        const regDate = new Date(user.registrationDate);
        return regDate >= filters.dateRange.start! && regDate <= filters.dateRange.end!;
      });
    }

    return result;
  }, [filteredUsers, searchQuery, filters]);

  // KYC Status Badge Component
  const KYCBadge: React.FC<{ status: User['kycStatus'] }> = ({ status }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'Verified': return '#22C55E';
        case 'Pending': return '#F59E0B';
        case 'Rejected': return '#EF4444';
        default: return '#6B7280';
      }
    };

    return (
      <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.badgeText}>{status}</Text>
      </View>
    );
  };

  // User Card Component (Mobile)
  const UserCard: React.FC<{ user: User }> = ({ user }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => {
        setSelectedUser(user);
        setModalVisible(true);
      }}
    >
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: user.profileImage || 'https://via.placeholder.com/60' }}
          style={styles.profileImage}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{user.fullName}</Text>
          <Text style={styles.cardSubtext}>ID: {user.id}</Text>
          <Text style={styles.cardSubtext}>{user.nationality} • Age {calculateAge(user.dateOfBirth)}</Text>
        </View>
        <KYCBadge status={user.kycStatus} />
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardContact}>{user.phone}</Text>
        <Text style={styles.cardDate}>Reg: {new Date(user.registrationDate).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  // User Table Row Component (Desktop/Tablet)
  const UserTableRow: React.FC<{ user: User; index: number }> = ({ user, index }) => (
    <TouchableOpacity
      style={[styles.tableRow, index % 2 === 0 && styles.evenRow]}
      onPress={() => {
        setSelectedUser(user);
        setModalVisible(true);
      }}
    >
      <View style={styles.tableCell}>
        <Image
          source={{ uri: user.profileImage || 'https://via.placeholder.com/40' }}
          style={styles.tableProfileImage}
        />
      </View>
      <Text style={[styles.tableCell, styles.tableCellText]}>{user.id}</Text>
      <Text style={[styles.tableCell, styles.tableCellText]}>{user.fullName}</Text>
      <Text style={[styles.tableCell, styles.tableCellText]}>{user.gender}</Text>
      <Text style={[styles.tableCell, styles.tableCellText]}>{calculateAge(user.dateOfBirth)}</Text>
      <Text style={[styles.tableCell, styles.tableCellText]}>{user.nationality}</Text>
      <Text style={[styles.tableCell, styles.tableCellText]} numberOfLines={1}>
        {user.phone.length > 12 ? user.phone.substring(0, 12) + '...' : user.phone}
      </Text>
      <View style={styles.tableCell}>
        <KYCBadge status={user.kycStatus} />
      </View>
      <Text style={[styles.tableCell, styles.tableCellText]}>
        {new Date(user.registrationDate).toLocaleDateString()}
      </Text>
      <Text style={[styles.tableCell, styles.tableCellText]}>{user.registeredBy}</Text>
    </TouchableOpacity>
  );

  // Actions
  const handleKYCStatusChange = (newStatus: User['kycStatus']) => {
    if (selectedUser) {
      Alert.alert(
        'Confirm Status Change',
        `Change KYC status to ${newStatus}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: () => {
              // Update user status - Replace with your API call
              setUsers(prevUsers =>
                prevUsers.map(user =>
                  user.id === selectedUser.id
                    ? { ...user, kycStatus: newStatus }
                    : user
                )
              );
              setFilteredUsers(prevUsers =>
                prevUsers.map(user =>
                  user.id === selectedUser.id
                    ? { ...user, kycStatus: newStatus }
                    : user
                )
              );
              setSelectedUser({ ...selectedUser, kycStatus: newStatus });
            }
          }
        ]
      );
    }
  };

  const handleExport = () => {
    Alert.alert('Export', 'Export functionality would be implemented here');
  };

  const handleDelete = () => {
    if (selectedUser) {
      Alert.alert(
        'Confirm Delete',
        `Are you sure you want to delete ${selectedUser.fullName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
              setFilteredUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
              setModalVisible(false);
            }
          }
        ]
      );
    }
  };

  // Render Methods
  const renderSearchAndFilters = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, ID, email, passport..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFiltersVisible(true)}
      >
        <Ionicons name="filter" size={20} color="#FFFFFF" />
        <Text style={styles.filterButtonText}>Filters</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTableHeader = () => (
    <View style={[styles.tableRow, styles.tableHeader]}>
      <Text style={[styles.tableCell, styles.tableHeaderText]}>Photo</Text>
      <Text style={[styles.tableCell, styles.tableHeaderText]}>ID</Text>
      <Text style={[styles.tableCell, styles.tableHeaderText]}>Full Name</Text>
      <Text style={[styles.tableCell, styles.tableHeaderText]}>Gender</Text>
      <Text style={[styles.tableCell, styles.tableHeaderText]}>Age</Text>
      <Text style={[styles.tableCell, styles.tableHeaderText]}>Nationality</Text>
      <Text style={[styles.tableCell, styles.tableHeaderText]}>Contact</Text>
      <Text style={[styles.tableCell, styles.tableHeaderText]}>KYC Status</Text>
      <Text style={[styles.tableCell, styles.tableHeaderText]}>Reg. Date</Text>
      <Text style={[styles.tableCell, styles.tableHeaderText]}>Registered By</Text>
    </View>
  );

  const renderUserModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>User Details</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {selectedUser && (
            <>
              {/* Personal Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.userInfo}>
                  <Image
                    source={{ uri: selectedUser.profileImage || 'https://via.placeholder.com/100' }}
                    style={styles.modalProfileImage}
                  />
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{selectedUser.fullName}</Text>
                    <Text style={styles.userSubtext}>ID: {selectedUser.id}</Text>
                    <KYCBadge status={selectedUser.kycStatus} />
                  </View>
                </View>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Date of Birth</Text>
                    <Text style={styles.infoValue}>{new Date(selectedUser.dateOfBirth).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Age</Text>
                    <Text style={styles.infoValue}>{calculateAge(selectedUser.dateOfBirth)} years</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Gender</Text>
                    <Text style={styles.infoValue}>{selectedUser.gender}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Nationality</Text>
                    <Text style={styles.infoValue}>{selectedUser.nationality}</Text>
                  </View>
                </View>
              </View>

              {/* Contact Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Phone</Text>
                    <Text style={styles.infoValue}>{selectedUser.phone}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{selectedUser.email}</Text>
                  </View>
                  {selectedUser.address && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Address</Text>
                      <Text style={styles.infoValue}>{selectedUser.address}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Travel Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Travel Information</Text>
                <View style={styles.infoGrid}>
                  {selectedUser.passportNumber && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Passport Number</Text>
                      <Text style={styles.infoValue}>{selectedUser.passportNumber}</Text>
                    </View>
                  )}
                  {selectedUser.visaNumber && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Visa Number</Text>
                      <Text style={styles.infoValue}>{selectedUser.visaNumber}</Text>
                    </View>
                  )}
                  {selectedUser.insuranceNumber && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Insurance Number</Text>
                      <Text style={styles.infoValue}>{selectedUser.insuranceNumber}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Emergency Contact */}
              {selectedUser.emergencyContact && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Emergency Contact</Text>
                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Name</Text>
                      <Text style={styles.infoValue}>{selectedUser.emergencyContact.name}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Phone</Text>
                      <Text style={styles.infoValue}>{selectedUser.emergencyContact.phone}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Relationship</Text>
                      <Text style={styles.infoValue}>{selectedUser.emergencyContact.relationship}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Actions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Actions</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleKYCStatusChange('Verified')}>
                    <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                    <Text style={[styles.actionButtonText, { color: '#22C55E' }]}>Approve KYC</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleKYCStatusChange('Rejected')}>
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                    <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Reject KYC</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
                    <Ionicons name="download" size={20} color="#3B82F6" />
                    <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Export Data</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                    <Ionicons name="trash" size={20} color="#EF4444" />
                    <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Delete User</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  const renderFiltersModal = () => (
    <Modal
      visible={filtersVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity
            onPress={() => setFiltersVisible(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          {/* Filter content would go here */}
          <Text style={styles.sectionTitle}>Filter options would be implemented here</Text>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>View Users</Text>
        <Text style={styles.subtitle}>{filteredAndSearchedUsers.length} users found</Text>
      </View>

      {renderSearchAndFilters()}

      <View style={styles.content}>
        {isTablet ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={loadUsers} />
            }
          >
            <View>
              {renderTableHeader()}
              <FlatList
                data={filteredAndSearchedUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => <UserTableRow user={item} index={index} />}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={filteredAndSearchedUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <UserCard user={item} />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={loadUsers} />
            }
          />
        )}
      </View>

      {renderUserModal()}
      {renderFiltersModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  // Table Styles
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    minHeight: 60,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 2,
    borderBottomColor: '#D1D5DB',
  },
  evenRow: {
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    minWidth: 100,
  },
  tableCellText: {
    fontSize: 14,
    color: '#374151',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  tableProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  // Card Styles
  userCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContact: {
    fontSize: 14,
    color: '#374151',
  },
  cardDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // Badge Styles
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ViewUsersScreen;