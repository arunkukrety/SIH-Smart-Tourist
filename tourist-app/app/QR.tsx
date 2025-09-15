import { Text, View, TouchableOpacity, SafeAreaView, Image, Alert } from "react-native";
import { QrCode, MapPin, User, Bell, Settings, Phone } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function QRPage() {
  const router = useRouter();
  
  const bottomNavItems = [
    { icon: QrCode, label: "QR", route: "/QR" },
    { icon: MapPin, label: "Map", route: "/map" },
    { icon: User, label: "Profile", route: "/profile" },
    { icon: Bell, label: "Alerts", route: "/alerts" },
    { icon: Settings, label: "Settings", route: "/settings" }
  ];

  const handleSOSPress = () => {
    Alert.alert(
      "Emergency SOS",
      "Are you sure you want to send an emergency alert? This will notify local authorities and your emergency contacts.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Send SOS",
          style: "destructive",
          onPress: () => {
            // here you would implement the actual SOS functionality
            Alert.alert("SOS Sent", "Emergency alert has been sent to authorities and your emergency contacts.");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Main Content Area */}
      <View className="flex-1 justify-center items-center px-6">
        {/* QR Code Area */}
        <View className="w-full max-w-sm aspect-square bg-white rounded-2xl mb-8 justify-center items-center border-2 border-gray-300">
          <Image 
            source={require("../assets/images/QR.png")}
            className="w-48 h-48"
            resizeMode="contain"
          />
        </View>

        {/* Status Text */}
        <Text className="text-white text-center text-lg font-medium mb-2">
          Digital Tourist ID
        </Text>
        <Text className="text-gray-400 text-center text-sm mb-8">
          Verified • Active
        </Text>

        {/* SOS Button */}
        <TouchableOpacity
          className="bg-red-600 px-8 py-4 rounded-2xl flex-row items-center gap-3"
          activeOpacity={0.8}
          onPress={handleSOSPress}
        >
          <Phone size={24} color="#ffffff" />
          <Text className="text-white text-lg font-semibold">SOS Emergency</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View className="bg-white border-t border-gray-200 px-4 py-2">
        <View className="flex-row justify-around items-center">
          {bottomNavItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = item.route === "/QR";
            
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
