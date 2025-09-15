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
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

// Types
interface User {
  id: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  nationality: string;
  phone: string;
  email: string;
  passportNumber?: string;
  visaNumber?: string;
  kycStatus: 'Pending' | 'Verified' | 'Rejected' | 'In Review' | 'Docs Required';
  currentStep: string;
  assignedOfficer: string;
  lastUpdated: string;
  registrationDate: string;
  profileImage?: string;
  documents: Array<{
    type: string;
    url: string;
    verified: boolean;
    rejectionReason?: string;
  }>;
  timeline: Array<{
    step: string;
    timestamp: string;
    officer: string;
    notes?: string;
  }>;
  notes: Array<{
    text: string;
    timestamp: string;
    officer: string;
  }>;
}

interface FilterOptions {
  kycStatus: string;
  assignedOfficer: string;
  nationality: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface DashboardStats {
  totalUsers: number;
  pendingKYC: number;
  verifiedKYC: number;
  rejectedKYC: number;
}

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;

const StatusPage: React.FC = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingKYC: 0,
    verifiedKYC: 0,
    rejectedKYC: 0,
  });
  const [filters, setFilters] = useState<FilterOptions>({
    kycStatus: '',
    assignedOfficer: '',
    nationality: '',
    dateRange: { start: null, end: null },
  });

  // Load Mock Users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setRefreshing(true);
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
          passportNumber: 'P123456789',
          kycStatus: 'Verified',
          currentStep: 'Approved',
          assignedOfficer: 'OFF001',
          lastUpdated: '2024-01-16T14:30:00Z',
          registrationDate: '2024-01-15',
          profileImage: 'https://via.placeholder.com/100',
          documents: [
            { type: 'Passport', url: 'doc1.pdf', verified: true },
            { type: 'Selfie', url: 'selfie1.jpg', verified: true },
          ],
          timeline: [
            { step: 'Registration', timestamp: '2024-01-15T10:00:00Z', officer: 'System' },
            { step: 'Docs Uploaded', timestamp: '2024-01-15T14:00:00Z', officer: 'USR001' },
            { step: 'Under Review', timestamp: '2024-01-16T09:00:00Z', officer: 'OFF001' },
            { step: 'Approved', timestamp: '2024-01-16T14:30:00Z', officer: 'OFF001' },
          ],
          notes: [{ text: 'All documents verified successfully', timestamp: '2024-01-16T14:30:00Z', officer: 'OFF001' }],
        },
        {
          id: 'USR002',
          fullName: 'Maria Garcia',
          gender: 'Female',
          dateOfBirth: '1985-08-22',
          nationality: 'Spain',
          phone: '+34-600-123456',
          email: 'maria.garcia@email.com',
          kycStatus: 'In Review',
          currentStep: 'Under Manual Review',
          assignedOfficer: 'OFF002',
          lastUpdated: '2024-02-10T11:15:00Z',
          registrationDate: '2024-02-10',
          profileImage: 'https://via.placeholder.com/100',
          documents: [
            { type: 'Passport', url: 'doc2.pdf', verified: false },
            { type: 'Selfie', url: 'selfie2.jpg', verified: true },
          ],
          timeline: [
            { step: 'Registration', timestamp: '2024-02-10T09:00:00Z', officer: 'System' },
            { step: 'Docs Uploaded', timestamp: '2024-02-10T10:00:00Z', officer: 'USR002' },
            { step: 'Under Review', timestamp: '2024-02-10T11:15:00Z', officer: 'OFF002' },
          ],
          notes: [],
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
          currentStep: 'Rejected - Expired Passport',
          assignedOfficer: 'OFF001',
          lastUpdated: '2024-01-28T16:45:00Z',
          registrationDate: '2024-01-28',
          profileImage: 'https://via.placeholder.com/100',
          documents: [
            { type: 'Passport', url: 'doc3.pdf', verified: false, rejectionReason: 'Passport expired' },
            { type: 'Selfie', url: 'selfie3.jpg', verified: true },
          ],
          timeline: [
            { step: 'Registration', timestamp: '2024-01-28T14:00:00Z', officer: 'System' },
            { step: 'Docs Uploaded', timestamp: '2024-01-28T15:00:00Z', officer: 'USR003' },
            { step: 'Under Review', timestamp: '2024-01-28T15:30:00Z', officer: 'OFF001' },
            { step: 'Rejected', timestamp: '2024-01-28T16:45:00Z', officer: 'OFF001' },
          ],
          notes: [{ text: 'Passport has expired. Please upload valid passport.', timestamp: '2024-01-28T16:45:00Z', officer: 'OFF001' }],
        },
      ];

      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setDashboardStats({
        totalUsers: mockUsers.length,
        pendingKYC: mockUsers.filter(u => u.kycStatus === 'Pending' || u.kycStatus === 'In Review').length,
        verifiedKYC: mockUsers.filter(u => u.kycStatus === 'Verified').length,
        rejectedKYC: mockUsers.filter(u => u.kycStatus === 'Rejected').length,
      });
      setRefreshing(false);
    }, 1000);
  };

  // Filters & Search
  const filteredAndSearchedUsers = useMemo(() => {
    return filteredUsers.filter(user => {
      const matchSearch =
        !searchQuery ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.passportNumber?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchKYC = !filters.kycStatus || user.kycStatus === filters.kycStatus;
      const matchOfficer = !filters.assignedOfficer || user.assignedOfficer === filters.assignedOfficer;
      const matchNationality = !filters.nationality || user.nationality === filters.nationality;

      return matchSearch && matchKYC && matchOfficer && matchNationality;
    });
  }, [filteredUsers, searchQuery, filters]);

  // Status Badge
  const StatusBadge: React.FC<{ status: User['kycStatus']; size?: 'small' | 'normal' }> = ({ status, size = 'normal' }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'Verified':
          return '#22C55E';
        case 'Pending':
          return '#F59E0B';
        case 'In Review':
          return '#3B82F6';
        case 'Rejected':
          return '#EF4444';
        case 'Docs Required':
          return '#8B5CF6';
        default:
          return '#6B7280';
      }
    };
    const badgeSize = size === 'small' ? styles.badgeSmall : styles.badge;
    const textSize = size === 'small' ? styles.badgeTextSmall : styles.badgeText;

    return (
      <View style={[badgeSize, { backgroundColor: getStatusColor() }]}>
        <Text style={textSize}>{status}</Text>
      </View>
    );
  };

  // Pie Chart Data
  const pieChartData = [
    { name: 'Verified', count: dashboardStats.verifiedKYC, color: '#22C55E', legendFontColor: '#374151' },
    { name: 'Pending', count: dashboardStats.pendingKYC, color: '#F59E0B', legendFontColor: '#374151' },
    { name: 'Rejected', count: dashboardStats.rejectedKYC, color: '#EF4444', legendFontColor: '#374151' },
  ];

  // Handlers
  const handleBatchAction = (action: 'approve' | 'reject' | 'export') => {
    Alert.alert(
      'Batch Action',
      `${action.charAt(0).toUpperCase() + action.slice(1)} ${selectedUsers.length} selected users?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setSelectedUsers([]);
            setShowBatchActions(false);
            Alert.alert('Success', `${action} applied to selected users`);
          },
        },
      ]
    );
  };

  const handleStatusChange = (newStatus: User['kycStatus']) => {
    if (!selectedUser) return;
    Alert.alert(
      'Confirm Status Change',
      `Change KYC status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            const updatedUsers = users.map(u =>
              u.id === selectedUser.id ? { ...u, kycStatus: newStatus, lastUpdated: new Date().toISOString() } : u
            );
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
            setSelectedUser({ ...selectedUser, kycStatus: newStatus });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadUsers} />}
      >
        <View style={styles.dashboard}>
          <Text style={styles.sectionTitle}>Overview Dashboard</Text>
          <View style={styles.dashboardCards}>
            <View style={[styles.dashboardCard, { borderTopColor: '#3B82F6' }]}>
              <Text style={styles.cardTitle}>Total Users</Text>
              <Text style={styles.cardValue}>{dashboardStats.totalUsers}</Text>
            </View>
            <View style={[styles.dashboardCard, { borderTopColor: '#F59E0B' }]}>
              <Text style={styles.cardTitle}>Pending KYC</Text>
              <Text style={styles.cardValue}>{dashboardStats.pendingKYC}</Text>
            </View>
            <View style={[styles.dashboardCard, { borderTopColor: '#22C55E' }]}>
              <Text style={styles.cardTitle}>Verified KYC</Text>
              <Text style={styles.cardValue}>{dashboardStats.verifiedKYC}</Text>
            </View>
            <View style={[styles.dashboardCard, { borderTopColor: '#EF4444' }]}>
              <Text style={styles.cardTitle}>Rejected KYC</Text>
              <Text style={styles.cardValue}>{dashboardStats.rejectedKYC}</Text>
            </View>
          </View>

          {isTablet && dashboardStats.totalUsers > 0 && (
            <View style={{ marginTop: 20 }}>
              <PieChart
                data={pieChartData}
                width={screenWidth / 2}
                height={180}
                chartConfig={{ color: (opacity = 1) => `rgba(0,0,0,${opacity})` }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContainer: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginVertical: 8 },
  dashboard: { padding: 16 },
  dashboardCards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dashboardCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12, borderTopWidth: 4, marginBottom: 12 },
  cardTitle: { fontSize: 14, color: '#6B7280' },
  cardValue: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeSmall: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 14, color: '#FFFFFF', fontWeight: '600' },
  badgeTextSmall: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
});

export default StatusPage;
