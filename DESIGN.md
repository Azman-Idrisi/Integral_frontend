# DESIGN.md

The design system for the Integral Student Portal app: an Apple Liquid Glass–inspired look with light and dark themes, built from a small five-color palette.

The restyle keeps the existing screens, layouts and navigation (login plus three tabs). It changes color, materials, shape, type, and the tab bar. **Migration from the original UI** at the end records what changed from the first version of the app.

Product vocabulary (Attendance Standing, Enrollment Number, Academic Session, Sign-in) is defined in `../../GLOSSARY.md`. On-screen text uses those terms.

## Identity

- The app is **independent** and is not affiliated with Integral University. **Never use the university's official logos, seals, emblems or accreditation badges** (the ICPE emblem, the round seal, the NAAC A+ badge or any other official mark), anywhere in the app, its icon, splash screen or store listing. See `docs/adr/0002-independent-app-no-official-marks.md`.
- The app's own mark is the app icon (`assets/icon.png`), shown on the login screen. It is currently green (`#038A57`) on a white tile, which predates the current palette.
- An independence line appears at the bottom of the login screen and of Profile: **"Independent app · Not affiliated with Integral University"** (footnote style, `text-muted`).

## Color

Use as few colors as possible. Every contrast figure below is measured (WCAG 2.x), at the worst point over the screen background, cards and the background glows.

### Palette

| Token | Value | Role |
|---|---|---|
| `sky` | `#23C9FF` | The single accent, in both themes |
| `ice` | `#7CC6FE` | Background glows only. It's as bright as `sky` (1.05:1), so it never does a separate job. |
| `ink` | `#051014` | Dark background, light-theme text, labels on `sky` |
| `slate` | `#2E4052` | Dark cards (translucent), light-theme secondary text |
| `white` | `#FFFFFF` | Light-theme cards, dark-theme text |

`#04724D`, the fifth color supplied, is not used. No other colors are used anywhere: there is no red, amber or green.

### Neutrals

| Token | Dark | Light | Used for |
|---|---|---|---|
| `bg` | `ink` | `#F2F9FF` (`ice` at 0.10 on white) | Screen background |
| `surface` | `slate` at 0.45 (translucent) | `white` at 0.65 (translucent) | Cards |
| `surface-raised` | `white` at 0.06 | `slate` at 0.06 | Inputs, nested blocks inside cards, small pills (translucent) |
| `surface-solid` | `#13212A` | `white` | Opaque card for Reduce Transparency and native spinner backgrounds |
| `text` | `white` (13.7:1 or better) | `ink` (18.6:1 or better) | Titles, body, values |
| `text-muted` | `white` at 0.70 (7.5:1 or better) | `slate` (10.3:1 or better) | Secondary text, labels, inactive tab |
| `text-subtle` | `white` at 0.65 (4.6:1 or better) | `slate` at 0.85 (5.9:1 or better) | Placeholders, empty states |
| `border-control` | `white` at 0.50 (3.4:1 or better) | `slate` at 0.65 (3.4:1 or better) | Outlines of inputs and other interactive controls (3:1 rule) |
| `border` | `white` at 0.12 | `slate` at 0.15 | Decorative dividers and hairlines only. Never the only edge of a control. |
| `on-fill` | `ink` | `ink` | Text on `sky` and `ice` fills |

These figures are the worst case over `bg`, every glow center, the translucent cards and the raised blocks on them.

### Accent

- `accent` is `sky` in both themes. It fills the primary button (as tinted glass), the light-theme tab selector and Safe indicators.
- `accent-ink` is the color for small accent graphics (spinners, the input focus ring, pull-to-refresh): `sky` in dark (8.5:1 or better), `ink` in light. `sky` is only 1.9:1 on white, so it is never text or a small graphic in the light theme.

### Attendance Standing colors

Palette only. The three Standings differ by color **and** by shape: Safe and Borderline are filled, Short is an outline.

| Standing | Range | Token | Value |
|---|---|---|---|
| Safe | 75% and above | `safe` | `sky` `#23C9FF`, filled |
| Borderline | at least 70%, below 75% | `borderline` | `ice` `#7CC6FE`, filled |
| Short | below 70% | `short` | `text` (`white` dark / `ink` light), outlined |

- `sky` and `ice` look alike (1.05:1), so **always pair the color with the word** Safe, Borderline or Short, and the overall card's ring icon. Color is never the only signal, and here it's a weak one by design: Short reads as an outline, not an alarm.
- **Dark theme:** Standing colors may be text, icons and fills. On cards: sky 7.1:1, ice 7.4:1, white 13.7:1.
- **Light theme:** sky and ice are **fills only**, with `on-fill` text (10.0:1, 10.4:1), or ring and bar segments. Percentages and icons use `text`, with a colored dot or ring beside them. Short is `ink`, which works as text too.
- The overall card on Attendance follows the same rules as the subject cards. There is no separate hero color.
- `danger` (error icons) is `text`. There is no destructive color: Log out is a neutral button.

### Roles

| Role | Token |
|---|---|
| `accent`: primary button, Safe | `sky` |
| `accent-ink`: spinners, focus ring, pull-to-refresh | `sky` (dark) / `ink` (light) |
| `danger`: error icons | `text` |

## Theming

- **Both themes ship.** By default the app follows the phone's system setting (`app.json` `userInterfaceStyle: "automatic"`). Profile has an **Appearance** control with System, Light and Dark. The choice is remembered between launches.
- All values live in `src/theme/` (`tokens.ts`, `metrics.ts`), read through `useTheme()`. Screens and components must not contain hex values or inline colors.
- Each token in this document maps one-to-one to a theme token name, written in camelCase in code (`surface-raised` → `surfaceRaised`).
- Screens build styles with `createStyles((theme) => …)`, which creates a stylesheet for each theme once. The Appearance setting is applied with `Appearance.setColorScheme`, so `useColorScheme()`, the status bar and native dialogs all follow it.

## Materials: Liquid Glass

Apple's guidance (*Adopting Liquid Glass*, HIG *Materials*): glass forms a functional layer for controls and navigation above the content, and is used sparingly. Tint only prominent actions. Slider and toggle knobs "transform into Liquid Glass during interaction". Glass needs color behind it; opaque backgrounds defeat it.

Here glass with a fill is used only for the floating layer (the tab bar and its selector, the sticky Timetable day headers) and the primary button, which is the only tinted element. Neutral controls are fill-less (see Neutral controls).

### Translucent content

Content (cards, list rows, inputs, pills) is **translucent but not glass**, in line with Apple's "standard materials" for the content layer. `surface` and `surface-raised` are semi-transparent, so the background shows through. Cards (`Card` component) get a 1px `glass-stroke` hairline and nothing else: no rim, sheen, glow or ring.

Cards don't blur. The only thing behind a card is the screen background, which is all soft gradients, so a blurred copy would look the same as the translucent fill and cost a blur pass per card while scrolling. With Reduce Transparency on, cards switch to `surface-solid`.

### Neutral controls

Neutral buttons (secondary, icon) and the segmented control's track have **no fill at all**: no blur, tint, sheen or glow. They have only `glass-control-edge`, a 1px ring plus a faint top-left highlight. The label sits straight on the background (16.3:1 dark, 17.4:1 light), and the ring marks the shape (3.2:1 dark, 3.5:1 light). Only the primary button and the floating layer (tab bar, sticky headers) carry a glass fill.

| Platform | Implementation |
|---|---|
| iOS 26+ | `GlassView` from `expo-glass-effect`, regular variant (interactive and tinted for the primary button). Check `isGlassEffectAPIAvailable()` first. |
| Android 12+ (API 31+) | The tab bar: `BlurView` from `expo-blur` (`blurMethod="dimezisBlurViewSdk31Plus"`) with `glass-fill-blur` on top. Glass inside a screen (sticky day headers, the primary button): no blur, see below. |
| Older Android, or iOS without glass | No blur: `glass-fill` at 0.85 (or the tint). |
| Reduce Transparency on | Opaque: `surface-solid` for bars, and the tint over solid `bg` for the primary button. Neutral controls stay fill-less. |

### Blur source (Android)

Android can only blur a view from outside it. Each screen's root is a `BlurTargetView`, and the tab bar, which sits outside the screens, blurs whichever screen is focused. Glass inside a screen uses the plain fill. A second, nested blur target holding just the glows was tried, but on a device it rendered in-screen glass as a washed-out gray slab, so it was removed.

### Tokens

| Token | Dark | Light |
|---|---|---|
| `glass-fill-blur` / `glass-fill` | `#13212A` at 0.80 / 0.85 | `white` at 0.80 / 0.85 |
| `glass-control-edge` | Inset 1px ring white 0.35, 1.5px top-left white 0.35 | Inset 1px ring `ink` 0.50, 1.5px top-left white 0.90 |
| `glass-stroke` | `white` at 0.10, 1px hairline | `ink` at 0.08, 1px hairline |
| `glass-sheen` | Top-down gradient, white 0.16 → 0 by 40% of the height | White 0.70 → 0 by 50% |
| `glass-rim` | Inset shadows: 1px white 0.14 all round, 1.5px white 0.55 top-left, 1px white 0.28 bottom-right, 14px white 0.10 inner glow | 1px white 0.70 all round, 1.5px white top-left, 1px ink 0.08 bottom-right, 14px white 0.60 inner glow |
| `glass-ring` | Inset 1px ring, white 0.35 | Inset 1px ring, ink 0.55 |
| `selector-fill` | `white` at 0.14 | `sky` at 0.18 |
| `thumb-fill` | `white` at 0.14 | `white` |
| `accent-glass` | `sky` at 0.85 | same |
| `glass-tint-sheen` / `glass-tint-rim` | The dark `glass-sheen` / `glass-rim`, used on tinted glass in both themes | same |

Every glass surface gets `GlassEdge`: the `glass-stroke` hairline, the `glass-sheen` gradient (`experimental_backgroundImage`) and the `glass-rim` light (inset `boxShadow`). Together they give the bright all-round rim and lighter top of Apple's glass. RN can't refract what's behind, so there is no lensing. Thumbs that mark a selection also get `glass-ring`. On iOS 26+, `GlassView` draws its own edge, but the thumbs keep `GlassEdge`.

Contrast on the tab bar, worst case (pure white content under the dark bar, black under the light bar):
- labels sit below the sheen: `text-muted` 5.2:1 (blurred, 0.80) and 6.0:1 (0.85) in dark, 6.6:1 and 7.5:1 in light;
- inactive icons sit partly under the sheen: 4.3:1 or better.

The Android blur adds its own tint overlay under our fill (dark gray in dark, near-white in light). It never takes the background darker than `ink` or lighter than white, so the figures above still hold.

### Background glows

Each screen's background carries large, soft, off-canvas radial glows. They are kept **minimal** on purpose: just enough color for the glass to pick up, without tinting the screen.
- **Dark theme:** `ice` at 0.10 (top right), `sky` at 0.08 (middle left), `slate` at 0.35 (bottom right).
- **Light theme:** `sky` at 0.06 and `ice` at 0.08.

All text contrast above is measured over the glow centers as well as plain `bg`.

## Typography

- **iOS:** the San Francisco family, as the system font. SF Pro is chosen by weight. SF Mono (`fontFamily: "ui-monospace"`) is used for identifiers and times: the Enrollment Number pill, the ABC ID and timetable slot times.
- **Android and web:** Inter (OFL), loaded at runtime with `@expo-google-fonts/inter` (weights 400, 600 and 700). Apple's font license allows SF only on Apple platforms, and Inter is designed very close to SF Pro. Each Inter weight is its own font family. Where iOS uses SF Mono, Android uses Inter's tabular figures. If Inter fails to load, the app falls back to the system font.
- Pick weights with `...font.regular`, `...font.semibold` and `...font.bold`, and monospace with `...font.mono` (`theme/metrics.ts`). Never set `fontWeight` or `fontFamily` directly.
- Sizes follow Apple's text styles, one step smaller. Text is in sentence case. UPPERCASE is used only for the overline role. Stat numbers use `fontVariant: ["tabular-nums"]`.

| Role | Size / line height | Weight | Notes |
|---|---|---|---|
| Display | 44 / 52 | 700 | Overall attendance % |
| Large title | 28 / 34 | 700 | Page titles ("Attendance", "Timetable", "Profile") |
| Title | 20 / 25 | 700 | "Sign in", subject % (bold 20 counts as large text) |
| Headline | 17 / 22 | 600 | Timetable day headers, student name, app name on login, Standing word |
| Body strong | 15 / 20 | 600 | Course names, values |
| Body | 15 / 20 | 400 | Inputs, paragraphs |
| Callout | 14 / 19 | 400–600 | Profile rows, buttons (600) |
| Footnote | 12 / 16 | 400 | Subtitles, independence line, slot times |
| Caption | 11 / 13 | 600 | Pills, stat labels |
| Tab label | 10 / 12 | 600 | Tab bar |
| Overline | 11 / 13 | 600, UPPERCASE, tracking 0.5 | Tiny section and field labels ("CUMULATIVE", "DATE OF BIRTH") |

## Shape

Corners are rounded and concentric (nested shapes share a center).

| Radius | Used for |
|---|---|
| `9999` (capsule) | Tab bar, tab selector, all buttons, pills, segmented controls, progress bars |
| `24` | Cards |
| `16` | Nested blocks inside cards. An element within 8px of a card edge uses 24 − its inset instead. |
| `20` | Profile photo, app icon on the login screen |
| `14` | Inputs, captcha box |

## Elevation

Cards don't use heavy drop shadows. Depth comes from surface contrast and glass.

| Level | Dark | Light | Used for |
|---|---|---|---|
| Card | none | `boxShadow: 0 2px 8px` `ink` at 0.06 | Cards |
| Floating | `boxShadow: 0 8px 24px` black at 0.45 | `boxShadow: 0 8px 24px` `ink` at 0.12 | Tab bar, floating glass |

Both use `boxShadow`, not Android `elevation`. `boxShadow` is drawn only outside the shape, while `elevation` shows through translucent cards and glass and darkens them.

## Spacing and layout

- Screen gutter is 20. Card padding is 20 (16 for list cards). The gap between cards is 12, and the gap between sections is 24.
- Every screen uses `SafeAreaView` for the top edge. Scrolling content goes under the floating tab bar, and its bottom padding equals the bar height + the bar's bottom offset + 16, so the last item can scroll clear of the bar.
- Touch targets are at least 44×44.

## Components

### Floating tab bar

A custom tab bar that looks the same on Android and iOS. It is not Expo's `NativeTabs`; see `docs/adr/0001-custom-glass-tab-bar.md`.
- **Shape:** a glass capsule (`9999`), 64 tall, inset 16 from the left and right edges. Its bottom sits 8 above the bottom safe-area inset. It uses Floating elevation and stays visible while scrolling.
- **Tabs:** Attendance, Timetable and Profile, laid out with equal widths. Each has a 22px Ionicons icon (filled when active, outline when inactive) above a sentence-case tab label.
- **Selector:** a capsule inset 4 inside the bar, with `selector-fill`, a glass edge and `glass-ring`. It slides to the selected tab with a Reanimated spring and stretches along the direction of travel. While a tab is pressed, it lifts (scales up 6%).
  - The active icon and label use `text`. Inactive ones use `text-muted`.
- **Haptics:** a selection haptic on press (`expo-haptics`).

### Buttons

Every button is a capsule at least 52 tall, with a Callout 600 sentence-case label, except icon buttons. All buttons swell to 104% while pressed. Disabled buttons drop to opacity 0.5.
- **Primary:** `accent-glass` (`sky` at 0.85) with an `ink` label ("Sign in"): 7.4:1 or better in dark, 10.7:1 in light. The loading spinner is `ink` too.
- **Secondary:** fill-less, with only `glass-control-edge`, and a `text` label straight on the background ("Continue as …", "Try again"). An optional 20px icon sits before the label. On a device, the earlier gray glass fill came out close to the label color, so it was removed.
- **Log out** is a secondary button with a `log-out-outline` icon. There is no destructive style. The confirmation dialog marks the action as destructive.
- **Icon button:** a round fill-less button, 44 × 44, with `glass-control-edge` and a 20px `text` icon, and no visible label. Its accessibility label names the action (the captcha's "Refresh captcha").
- Buttons have no shadow. The primary button's tinted glass uses `glass-tint-sheen` and `glass-tint-rim` in both themes, because the light theme's strong white sheen would wash out the color.
- The primary tint opacity is the lowest at which the label stays at 4.5:1 over `bg` and the glows. Put the primary button on the screen background, not on cards.

### Inputs

A `surface-raised` fill with a 1px `border-control` outline, radius 14, 52 tall and padding 16. Text uses the Body style in `text`, and placeholders use `text-subtle`. When focused, the border becomes 2px `accent-ink`. Each input has an overline field label above it.

### Pills

- **Standing pill:** Safe and Borderline are filled `sky` / `ice` with `on-fill` Caption text. Short is an outline: a 1px `short` border with `short` text.
- **Info pill:** a `surface-raised` fill with `text-muted` Caption text (Academic Session, and the Enrollment Number in mono).

### Segmented control

Used for Appearance on Profile, with an icon and a label per option: System (phone), Light (sun) and Dark (moon).
- **Track:** a fill-less capsule, 52 tall, with only `glass-control-edge`.
- **Thumb:** a lighter glass capsule, inset 4, with `thumb-fill`, a glass edge and `glass-ring`. It slides with the same spring as the tab selector and lifts by 6% while pressed. The ring keeps the selection at 3:1 or more against the background behind the clear track (4.2:1 dark, 3.9:1 light).
- The selected icon and label use `text` and Callout 600. The others use `text-muted`.

### Screens

- **Login:**
  - No card: the form sits directly on the screen background, within the 20 gutter, centered vertically.
  - The app icon (88, radius 20) sits above the app name (Headline). Below them come the "Sign in" title, the subtitle, the Enrollment Number, Password and Captcha fields, and the primary button.
  - A "Continue as …" secondary button appears when saved credentials exist.
  - The independence line is pinned to the bottom of the screen.
- **Attendance:**
  - **Overall card:** a regular translucent card, like the subject cards. It shows the "CUMULATIVE" overline (`text-muted`), the percentage in Display style, the Standing word (Headline, `text`), and a ring in the Standing color holding a Standing icon (checkmark for Safe, alert for Borderline, close for Short). The percentage and icon use the Standing color in dark and `text` in light.
  - **Subject cards:**
    - The course name in Body strong sits on the left. On the right is the percentage in Title style: status color in the dark theme, `text` plus a status dot in the light theme.
    - Below them is a 6px capsule progress bar: the status color on a `surface-raised` track.
    - At the bottom are the Held, Present and Absent stats and the standing pill.
- **Timetable:**
  - An info pill shows the Academic Session.
  - Sticky day headers are glass capsules that hug the day name, in Headline style.
  - Each slot card has a `surface-raised` period column flush with the card's left edge (Headline-style number in `text`, "PERIOD" overline). Next to it are the time (Footnote mono, `text-muted`) and the subjects (Body strong).
- **Profile:**
  - Hero card: the photo, the name (Headline), an Enrollment Number info pill, and the ABC ID (Footnote mono, `text-muted`).
  - A grouped details card with label (`text-muted`) and value (`text`, 600) rows separated by `border` hairlines.
  - Then the Appearance control, the Log out button, and the independence line.

### Loading, empty and error states

- **Loading:** a centered `accent-ink` spinner with Footnote `text-muted` text ("Loading attendance…").
- **Empty:** Callout `text-subtle`.
- **Error:** a `danger` icon with a `text` message, plus a secondary "Try again" button.
- **Sign-in expired:** "Your sign-in expired. Please sign in again."
- Lists support pull-to-refresh tinted `accent-ink`.

## Wording

Use the terms defined in `GLOSSARY.md`: **Enrollment Number** (never "username" or "ID"), **Academic Session** and **Sign-in**. "Session" never appears on its own. Attendance is described as **Safe**, **Borderline** or **Short**. GOOD, LOW, BAD, SAFE, SHORT and SMS-provided status text don't appear.

## Migration from the original UI

**Status (2026-10-22):** implemented. The palette was replaced on 2026-10-22: the university-sampled brand colors (`#038A57`, `#4A2B5C`, `#2A2D4A`, `#BE3635`, `#916A39`) gave way to the five-color palette above, and Merriweather to SF Pro with Inter on Android. Still to do on a device: tune the glows and check the blurred glass. The app icon is still the earlier green.

The original UI was a Spotify-style dark-only theme: `#121212`/`#181818`/`#1f1f1f` surfaces, a single `#1ed760` accent, UPPERCASE tracked text everywhere, radius 8 cards with heavy shadows, and a flat full-width bar from the Expo Router `Tabs` component. Everything was hardcoded inline per screen.

| Original | Replaced with |
|---|---|
| `#1ed760` accent (buttons, links, active tab, spinners, period numbers) | `sky` / `accent-ink`, following the contrast rules |
| `#ffa42b` / `#f3727f` attendance colors | `borderline` (`ice`) / `short` (outlined `text`), and `safe` (`sky`) for good attendance |
| `#f3727f` Log out outline, error text | Neutral glass Log out button with an icon, error icon plus `text` |
| `#4d4d4d` placeholders and empty text | `text-subtle` |
| `#4d4d4d` input borders | `border-control` |
| Thresholds 75 / 60, labels GOOD/LOW/BAD and SAFE/LOW/SHORT, SMS status text wins | Thresholds 75 / 70, Safe / Borderline / Short, app label always wins |
| UPPERCASE titles, buttons, tabs | Sentence case. Overline only for tiny labels |
| Radius 8 cards, 6 inputs | 24 cards, 14 inputs |
| Heavy shadows on every card | Elevation table above |
| Full-width `Tabs` bar | Floating glass tab bar |
| "I" logo circle | The app icon |

Other changes made:
- Deleted `src/styles/colors.ts`, an unused light palette replaced by `src/theme/`.
- `CustomInput` merges a passed `style` with its base style instead of replacing it.
- `AttendanceCard` renders its progress-bar track.
- The login screen uses `CustomButton` instead of an inline button.
- The "Contact IT Support" link on the login screen had no `onPress`. It was removed, because pointing students to university IT about an independent app would be misleading.
- `app.json`: `userInterfaceStyle: "automatic"`, splash `backgroundColor` set to the light `bg` with a dark variant, adaptive-icon background `#FFFFFF`.
- New dependencies: `expo-blur`, `expo-haptics` and `@expo-google-fonts/inter`.
