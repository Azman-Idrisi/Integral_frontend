import { View, Text } from "react-native";

export default function AttendanceCard({
  item,
}: any) {
  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 18,
        borderRadius: 16,
        marginBottom: 15,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        {item.course}
      </Text>

      <Text>
        Held: {item.held}
      </Text>

      <Text>
        Present: {item.present}
      </Text>

      <Text>
        Attendance: {item.percentage}%
      </Text>

      <Text>
        Status: {item.status}
      </Text>
    </View>
  );
}