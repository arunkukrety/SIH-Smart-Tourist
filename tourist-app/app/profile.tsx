import { Text, View, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { User, Phone, Mail, MapPin, Calendar, Plane, Shield, Clock, Edit, Settings, QrCode, Bell } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  
  const bottomNavItems = [
    { icon: QrCode, label: "QR", route: "/QR" },
    { icon: MapPin, label: "Map", route: "/map" },
    { icon: User, label: "Profile", route: "/profile" },
    { icon: Bell, label: "Alerts", route: "/alerts" },
    { icon: Settings, label: "Settings", route: "/settings" }
  ];

  // Mock tourist data based on authority dashboard structure
  const touristData = {
    id: "550e8400-e29b-41d4-a716-446655440001",
    digital_id: "T001234",
    first_name: "John",
    last_name: "Smith",
    full_name: "John Smith",
    date_of_birth: "1985-03-15",
    gender: "male",
    nationality: "American",
    profile_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "active",
    contacts: {
      phone_primary: "+1-555-0123",
      phone_secondary: "+1-555-0124",
      email: "john.smith@email.com",
      emergency_contact_name: "Jane Smith",
      emergency_contact_phone: "+1-555-0125",
      emergency_contact_relation: "Wife"
    },
    documents: {
      passport_number: "A1234567",
      passport_country: "United States",
      passport_issue_date: "2020-01-15",
      passport_expiry_date: "2030-01-15",
      visa_number: "V7890123",
      visa_type: "Tourist",
      visa_issue_date: "2024-01-10",
      visa_expiry_date: "2024-07-10"
    },
    addresses: [{
      type: "current",
      country: "India",
      state: "Rajasthan",
      city: "Jaipur",
      postal_code: "302001",
      address_line: "123 Hotel Plaza, Near City Palace",
      hotel_name: "Hotel Plaza Jaipur",
      room_number: "205",
      check_in_date: "2024-01-15",
      check_out_date: "2024-01-25",
      is_primary: true
    }],
    travel: {
      arrival_date: "2024-01-15",
      departure_date: "2024-01-25",
      arrival_flight: "AI101",
      departure_flight: "AI102",
      arrival_airport: "Jaipur International Airport",
      departure_airport: "Jaipur International Airport",
      travel_purpose: "tourism",
      travel_duration_days: 10,
      budget_range: "high",
      travel_insurance: true
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDaysRemaining = () => {
    const departure = new Date(touristData.travel.departure_date);
    const today = new Date();
    const diffTime = departure.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const currentAddress = touristData.addresses.find(addr => addr.is_primary) || touristData.addresses[0];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="py-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-2xl font-bold">Profile</Text>
            <TouchableOpacity className="p-2">
              <Settings size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View className="bg-white rounded-2xl p-6 mb-6">
            <View className="flex-row items-center gap-4 mb-4">
              <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center">
                <User size={32} color="#000000" />
              </View>
              <View className="flex-1">
                <Text className="text-black text-xl font-bold">{touristData.full_name}</Text>
                <Text className="text-gray-600 text-sm">ID: {touristData.digital_id}</Text>
                <Text className="text-gray-600 text-sm">{touristData.nationality} • {touristData.gender}</Text>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-800 text-xs font-medium">{touristData.status}</Text>
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View className="bg-white rounded-2xl p-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-black text-lg font-semibold">Contact Information</Text>
              <TouchableOpacity>
                <Edit size={20} color="#666666" />
              </TouchableOpacity>
            </View>
            
            <View className="space-y-3">
              <View className="flex-row items-center gap-3">
                <Phone size={20} color="#666666" />
                <Text className="text-black text-base">{touristData.contacts.phone_primary}</Text>
              </View>
              
              <View className="flex-row items-center gap-3">
                <Mail size={20} color="#666666" />
                <Text className="text-black text-base">{touristData.contacts.email}</Text>
              </View>
              
              <View className="mt-4 p-3 bg-gray-50 rounded-lg">
                <Text className="text-gray-600 text-sm font-medium mb-1">Emergency Contact</Text>
                <Text className="text-black text-sm">{touristData.contacts.emergency_contact_name} ({touristData.contacts.emergency_contact_relation})</Text>
                <Text className="text-gray-600 text-sm">{touristData.contacts.emergency_contact_phone}</Text>
              </View>
            </View>
          </View>

          {/* Documents */}
          <View className="bg-white rounded-2xl p-6 mb-6">
            <Text className="text-black text-lg font-semibold mb-4">Documents</Text>
            
            <View className="space-y-4">
              <View className="p-4 border border-gray-200 rounded-lg">
                <View className="flex-row items-center gap-3 mb-2">
                  <Shield size={20} color="#666666" />
                  <Text className="text-black font-medium">Passport</Text>
                </View>
                <Text className="text-gray-600 text-sm">{touristData.documents.passport_number} ({touristData.documents.passport_country})</Text>
                <Text className="text-gray-500 text-xs mt-1">
                  Issued: {formatDate(touristData.documents.passport_issue_date)} • Expires: {formatDate(touristData.documents.passport_expiry_date)}
                </Text>
              </View>
              
              <View className="p-4 border border-gray-200 rounded-lg">
                <View className="flex-row items-center gap-3 mb-2">
                  <Shield size={20} color="#666666" />
                  <Text className="text-black font-medium">Visa</Text>
                </View>
                <Text className="text-gray-600 text-sm">{touristData.documents.visa_type} ({touristData.documents.visa_number})</Text>
                <Text className="text-gray-500 text-xs mt-1">
                  Issued: {formatDate(touristData.documents.visa_issue_date)} • Expires: {formatDate(touristData.documents.visa_expiry_date)}
                </Text>
              </View>
            </View>
          </View>

          {/* Current Location */}
          <View className="bg-white rounded-2xl p-6 mb-6">
            <Text className="text-black text-lg font-semibold mb-4">Current Location</Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center gap-3">
                <MapPin size={20} color="#666666" />
                <Text className="text-black text-base">{currentAddress.city}, {currentAddress.state}, {currentAddress.country}</Text>
              </View>
              
              <View className="p-3 bg-gray-50 rounded-lg">
                <Text className="text-gray-600 text-sm font-medium mb-1">Hotel</Text>
                <Text className="text-black text-sm">{currentAddress.hotel_name}</Text>
                <Text className="text-gray-600 text-sm">Room {currentAddress.room_number}</Text>
                <Text className="text-gray-500 text-xs mt-1">{currentAddress.address_line}</Text>
              </View>
            </View>
          </View>

          {/* Travel Information */}
          <View className="bg-white rounded-2xl p-6 mb-6">
            <Text className="text-black text-lg font-semibold mb-4">Travel Information</Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-sm">Purpose</Text>
                <Text className="text-black text-sm capitalize">{touristData.travel.travel_purpose}</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-sm">Duration</Text>
                <Text className="text-black text-sm">{touristData.travel.travel_duration_days} days</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-sm">Budget</Text>
                <Text className="text-black text-sm capitalize">{touristData.travel.budget_range}</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-sm">Insurance</Text>
                <Text className="text-black text-sm">{touristData.travel.travel_insurance ? 'Yes' : 'No'}</Text>
              </View>
            </View>
          </View>

          {/* Flight Information */}
          <View className="bg-white rounded-2xl p-6 mb-6">
            <Text className="text-black text-lg font-semibold mb-4">Flight Information</Text>
            
            <View className="space-y-4">
              <View className="p-3 bg-gray-50 rounded-lg">
                <View className="flex-row items-center gap-3 mb-2">
                  <Plane size={20} color="#666666" />
                  <Text className="text-black font-medium">Arrival</Text>
                </View>
                <Text className="text-gray-600 text-sm">{touristData.travel.arrival_flight} to {touristData.travel.arrival_airport}</Text>
                <Text className="text-gray-500 text-xs mt-1">{formatDate(touristData.travel.arrival_date)}</Text>
              </View>
              
              <View className="p-3 bg-gray-50 rounded-lg">
                <View className="flex-row items-center gap-3 mb-2">
                  <Plane size={20} color="#666666" />
                  <Text className="text-black font-medium">Departure</Text>
                </View>
                <Text className="text-gray-600 text-sm">{touristData.travel.departure_flight} from {touristData.travel.departure_airport}</Text>
                <Text className="text-gray-500 text-xs mt-1">{formatDate(touristData.travel.departure_date)}</Text>
              </View>
            </View>
          </View>

          {/* Timeline */}
          <View className="bg-white rounded-2xl p-6 mb-6">
            <Text className="text-black text-lg font-semibold mb-4">Timeline</Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-sm">Arrival</Text>
                <Text className="text-black text-sm">{formatDate(touristData.travel.arrival_date)}</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-sm">Departure</Text>
                <Text className="text-black text-sm">{formatDate(touristData.travel.departure_date)}</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-sm">Days Remaining</Text>
                <Text className="text-black text-sm font-medium">{calculateDaysRemaining()}</Text>
              </View>
            </View>
          </View>

          {/* Personal Information */}
          <View className="bg-white rounded-2xl p-6 mb-6">
            <Text className="text-black text-lg font-semibold mb-4">Personal Information</Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-sm">Date of Birth</Text>
                <Text className="text-black text-sm">{formatDate(touristData.date_of_birth)}</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-sm">Gender</Text>
                <Text className="text-black text-sm capitalize">{touristData.gender}</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-sm">Nationality</Text>
                <Text className="text-black text-sm">{touristData.nationality}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-white border-t border-gray-200 px-4 py-2">
        <View className="flex-row justify-around items-center">
          {bottomNavItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = item.route === "/profile";
            
            return (
              <TouchableOpacity
                key={index}
                className={`flex-1 items-center py-3 ${
                  isActive ? 'bg-gray-100 rounded-lg' : ''
                }`}
                activeOpacity={0.7}
                onPress={() => router.push(item.route)}
              >
                <IconComponent 
                  size={24} 
                  color={isActive ? "#000000" : "#666666"} 
                />
                <Text 
                  className={`text-xs mt-1 ${
                    isActive ? 'text-black font-medium' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
