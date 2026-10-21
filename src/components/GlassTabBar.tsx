import * as Haptics from "expo-haptics";
import type { BottomTabBarProps } from "expo-router/tabs";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyles, radius, spring, tabBar, type } from "../theme";
import Glass, { GlassEdge } from "./Glass";

const INSET = 4;
const STRETCH = 0.15;
const LIFT = 0.06;

// Bottom padding for scroll content so the last item clears the bar.
export function useTabBarClearance() {
  const insets = useSafeAreaInsets();
  return tabBar.height + tabBar.offset + insets.bottom + 16;
}

// Floating glass tab bar (DESIGN.md › Floating tab bar, ADR 0001).
export default function GlassTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  const styles = useStyles();
  const [width, setWidth] = useState(0);
  const tabWidth = (width - INSET * 2) / state.routes.length;
  const position = useSharedValue(state.index);
  const target = useSharedValue(state.index);
  const lift = useSharedValue(0);

  useEffect(() => {
    target.set(state.index);
    position.set(withSpring(state.index, spring));
  }, [state.index, position, target]);

  // Stretches along the direction of travel, easing back as it arrives,
  // and lifts slightly while a tab is pressed.
  const selectorStyle = useAnimatedStyle(() => {
    const distance = Math.min(Math.abs(target.get() - position.get()), 1);
    const lifted = 1 + LIFT * lift.get();
    return {
      width: tabWidth,
      transform: [
        { translateX: position.get() * tabWidth },
        { scaleX: lifted + STRETCH * distance },
        { scaleY: lifted },
      ],
    };
  });

  return (
    <Glass style={[styles.bar, { bottom: insets.bottom + tabBar.offset }]}>
      <View
        accessibilityRole="tablist"
        style={styles.row}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {width > 0 && (
          <Animated.View style={[styles.selector, selectorStyle]}>
            <GlassEdge borderRadius={radius.capsule} ring />
          </Animated.View>
        )}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const label = options.title ?? route.name;
          const color = focused
            ? styles.activeLabel.color
            : styles.inactiveLabel.color;

          const onPress = () => {
            Haptics.selectionAsync();
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              onPress={onPress}
              onPressIn={() => lift.set(withSpring(1, spring))}
              onPressOut={() => lift.set(withSpring(0, spring))}
              onLongPress={() =>
                navigation.emit({ type: "tabLongPress", target: route.key })
              }
              style={styles.tab}
            >
              {options.tabBarIcon?.({ focused, color, size: 22 })}
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  focused ? styles.activeLabel : styles.inactiveLabel,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Glass>
  );
}

const useStyles = createStyles(({ colors }) => ({
  bar: {
    position: "absolute",
    left: tabBar.inset,
    right: tabBar.inset,
    height: tabBar.height,
    borderRadius: radius.capsule,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    padding: INSET,
  },
  selector: {
    position: "absolute",
    top: INSET,
    bottom: INSET,
    left: INSET,
    borderRadius: radius.capsule,
    backgroundColor: colors.selectorFill,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    ...type.tabLabel,
  },
  activeLabel: {
    color: colors.text,
  },
  inactiveLabel: {
    color: colors.textMuted,
  },
}));
