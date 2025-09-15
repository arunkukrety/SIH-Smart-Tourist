import { Text, View } from "react-native";
import { BookmarkCheck } from "lucide-react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BookmarkCheck className="text-black" />
      <Text className="text-red-500">
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
