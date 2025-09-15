import { Text, View, TouchableOpacity, SafeAreaView, Alert, Platform } from "react-native";
import { QrCode, MapPin, User, Bell, Settings, Navigation, Map, Locate } from "lucide-react-native";
import { useRouter } from "expo-router";

// Safe import with platform guard
let MapView: any = null;
let Camera: any = null;
let UserLocation: any = null;

if (Platform.OS !== "web") {
	try {
		const maplibre = require("@maplibre/maplibre-react-native");
		MapView = maplibre.MapView;
		Camera = maplibre.Camera;
		UserLocation = maplibre.UserLocation;
	} catch (error) {
		// silently fallback; native module might not be available in dev
	}
}

export default function MapPage() {
	const router = useRouter();
	
	const bottomNavItems = [
		{ icon: QrCode, label: "QR", route: "/QR" },
		{ icon: MapPin, label: "Map", route: "/map" },
		{ icon: User, label: "Profile", route: "/profile" },
		{ icon: Bell, label: "Alerts", route: "/alerts" },
		{ icon: Settings, label: "Settings", route: "/settings" }
	];

	// default location (jaipur, india)
	const defaultLocation = [75.8649, 26.9124];
	
	const handleGetDirections = () => {
		Alert.alert("Get Directions", "This would open navigation to your destination");
	};
	
	const handleFindPlaces = () => {
		Alert.alert("Find Places", "This would show nearby attractions and services");
	};

	return (
		<SafeAreaView className="flex-1 bg-black">
			{/* Header */}
			<View className="px-6 py-4">
				<Text className="text-white text-2xl font-bold mb-2">Map</Text>
				<Text className="text-gray-400 text-sm">Explore your current location and nearby attractions</Text>
			</View>

			{/* Main Content Area */}
			<View className="flex-1 px-6">
				{/* Map Container */}
				<View className="flex-1 rounded-2xl overflow-hidden mb-6 border border-gray-700">
					{MapView && Camera ? (
						<MapView
							style={{ flex: 1 }}
							mapStyle={{
								version: 8,
								sources: {
									'osm': {
										type: 'raster',
										tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
										tileSize: 256,
										attribution: '© OpenStreetMap contributors'
									}
								},
								layers: [
									{
										id: 'osm',
										type: 'raster',
										source: 'osm'
									}
								]
							}}
							logoEnabled={false}
							attributionEnabled={true}
							attributionPosition={{ bottom: 8, right: 8 }}
						>
							<Camera
								centerCoordinate={defaultLocation}
								zoomLevel={12}
								animationDuration={1000}
								animationMode="easeTo"
							/>
							{UserLocation ? (
								<UserLocation visible={true} showsUserHeadingIndicator={true} animated={true} />
							) : null}
						</MapView>
					) : (
						<View className="flex-1 bg-gray-800 justify-center items-center">
							<Map size={64} color="#666666" />
							<Text className="text-gray-400 text-lg font-medium mt-4">OpenStreetMap</Text>
							<Text className="text-gray-500 text-sm text-center mt-2 px-4">
								{Platform.OS === 'web' ? 'map is not available on web in this build' : 'map is loading or not available'}
							</Text>
						</View>
					)}
				</View>

				{/* Quick Actions */}
				<View className="w-full flex-row gap-4 mb-4">
					<TouchableOpacity 
						className="flex-1 bg-white rounded-2xl p-4 flex-row items-center justify-center gap-3"
						onPress={handleGetDirections}
					>
						<Navigation size={24} color="#000000" />
						<Text className="text-black font-medium">Get Directions</Text>
					</TouchableOpacity>
					
					<TouchableOpacity 
						className="flex-1 bg-white rounded-2xl p-4 flex-row items-center justify-center gap-3"
						onPress={handleFindPlaces}
					>
						<MapPin size={24} color="#000000" />
						<Text className="text-black font-medium">Find Places</Text>
					</TouchableOpacity>
				</View>

				{/* Location Info */}
				<View className="bg-white rounded-2xl p-4 mb-4">
					<View className="flex-row items-center gap-3">
						<Locate size={20} color="#666666" />
						<View className="flex-1">
							<Text className="text-black font-medium">Current Location</Text>
							<Text className="text-gray-600 text-sm">Jaipur, Rajasthan, India</Text>
						</View>
					</View>
				</View>
			</View>

			{/* Bottom Navigation */}
			<View className="bg-white border-t border-gray-200 px-4 py-2">
				<View className="flex-row justify-around items-center">
					{bottomNavItems.map((item, index) => {
						const IconComponent = item.icon;
						const isActive = item.route === "/map";
						
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
