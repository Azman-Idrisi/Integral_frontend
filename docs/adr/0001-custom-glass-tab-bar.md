# Custom glass tab bar instead of NativeTabs

We draw our own floating, Liquid Glass–style tab bar (glass capsule, sliding Reanimated selector) instead of using Expo Router's `NativeTabs`. `NativeTabs` gives the real iOS 26 Liquid Glass bar for free, but on Android, our primary platform, it renders a Material 3 bottom bar, and the API is still marked beta. A custom bar is the only way to get the same glass look on both platforms. On iOS 26+ the custom bar uses `GlassView` from `expo-glass-effect` internally, and on Android 12+ it uses `expo-blur`.
