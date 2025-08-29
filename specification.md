# **Muhsin (مُحْسِن) - Application Specification**

## 1.0 General App Structure

The application is built around a main tab bar with three primary screens:

1.  **Stats:** (Left Tab) Visualizations of the user's activity and progress.
2.  **Home:** (Center Tab) The main screen for daily logging of deeds.
3.  **Settings:** (Right Tab) Configuration, app information, and user data management.

## 2.0 Screens & Features

### 2.1 Home Screen

The primary landing screen for the user.

- **Header:**
  - Displays the current date in both Gregorian (Miladi) and Hijri calendars.
- **Date Scroller:**
  - A horizontally scrolling list of dates is positioned directly below the header.
  - It displays a full week at a time, snapping to each day.
  - Today is visually highlighted with an outline.
  - Users can tap any day to view and log deeds for that date.
- **Deeds List:**
  - The main content area lists the deeds the user has chosen to track for the selected day.
  - Deeds are organized into categories (e.g., "PRAYERS").
  - Each deed is displayed in a row with its name and an associated icon.
- **Floating Action Button (FAB):**
  - A floating action button with a `+` icon, used to navigate to the "Add Deed" screen.
- **Interaction:**
  - Tapping on a deed in the list opens the **"Log Deed" Modal** (see section 3.1).
  - After a deed is logged, its status is reflected on the right side of its row, with a background color and icon corresponding to the status (e.g., Green for Jamaah, Yellow for On Time).

### 2.2 Stats Screen

This screen provides an overview of the user's performance and consistency.

- **Deed Activity Graph:**
  - A grid-based visualization, similar to a GitHub contribution graph.
  - The Y-axis lists the user's main tracked deeds (e.g., the 5 daily prayers), represented by their icons.
  - The X-axis represents the selected time interval (e.g., days).
  - Each cell in the grid is colored to represent the completion state of that deed on that day.
- **Time Interval Switcher:**
  - A set of buttons or tabs that filters the data for the entire screen.
  - Options: `Weeks`, `Months`, `Years`, `All time`.
- **Status Summary:**
  - A 2x2 grid of boxes displaying the overall percentage breakdown for prayer performance.
  - Each box corresponds to a state and its color:
    - **In Jamaah** (Green)
    - **On time** (Yellow)
    - **Late** (Red)
    - **Not prayed** (Black/Dark Grey)
  - Each box contains the status title, the percentage, the total count (e.g., "27 times"), and a small visual bar chart.
- **Stats by Deed (Expandable View):**
  - An expandable list item, initially titled "Fard prayers" or similar.
  - When expanded, it reveals a detailed statistical breakdown for each individual deed.
  - Each deed shows a multi-colored progress bar visualizing the percentage breakdown of all its logged statuses (e.g., Fajr: 29% Jamaah, 43% On time, 28% Not prayed).

### 2.3 Settings Screen

Provides access to various configuration options and app-related actions.

- **Main Settings (each navigates to a submenu/modal):**
  - **Notifications:** Set reminders for logging deeds. The sub-screen contains a toggle for a "Daily reminder" and a setting for the specific `Time`.
  - **Deed Manager:** Manage custom and default deeds.
  - **Appearance:** A menu to switch the app's theme between `Light`, `Dark`, and `System` default.
  - **Haptics:** A simple toggle (`Enabled`/`Disabled`) for haptic feedback.
  - **App Language:** A menu to change the app's language.
- **Generic Actions:**
  - **Invite a friend:** Opens the native OS share sheet.
  - **Rate the app:** Self explanatory.
  - **Send feedback:** Opens the default email client with a pre-filled recipient address and subject line.
  - **Privacy Policy:** Displays the app's privacy policy.
- **Footer Information:**
  - **App/Version Info Label:** A small label displaying the current app version (e.g., "App version 2.4.2").
    - Tapping this label 7 times enables Developer Mode. When enabled, the label should change to indicate this (e.g., "App version 2.4.2 (Dev)").
  - **Credit Label:** A label stating "Made with 🤍 in Istanbul".
- **Reset Everything Button:**
  - A button to reset all user data and preferences.
  - This action must trigger a confirmation dialog to prevent accidental data loss.
- **Developer Mode (Hidden):**
  - Enabled via the version info label.
  - Long-pressing the version label (while dev mode is active) opens a developer settings submenu.
  - **Enable/Disable Demo Mode:** This key feature replaces the current user's data with randomized, pre-populated data for demonstration purposes. Disabling it must restore the user's original data without any loss.

## 3.0 Modals & Sub-screens

### 3.1 Log Deed Modal

This modal appears when a user taps a deed on the Home screen.

- **Layout:**
  - Contains the deed's icon, a title (e.g., "How did you complete Fajr today?"), and a list of options.
- **Options for Default Prayers:**
  1.  `Not prayed` (Black icon)
  2.  `Late` (Red icon)
  3.  `On time` (Yellow icon)
  4.  `In jamaah` (Green icon)
- **Options for Custom Deeds:**
  - A simple binary choice, such as `Completed` (Green) and `Missed` (Red).

### 3.2 Add Deed Screen

This is a full screen, not a modal, accessed from the Home screen's FAB.

- **Layout:**
  - The first option is a button to **"Create new deed"**, which navigates to the Custom Deed screen.
  - Below this is a scrollable list of pre-defined, categorized deeds that the user can enable.
  - Categories include: `Prayers`, `Fasting`, `Learning & dawah`, `Social`, etc.

### 3.3 Create Custom Deed Screen

Accessed from the "Add Deed" screen.

- **Icon Selector:** Allows the user to choose an icon for the new deed.
- **Deed Name:** A text input field for the deed's name.
- **Configuration Options (each navigates to a dedicated sub-screen):**
  - **Frequency:** Define how often the deed occurs. Options include:
    - _Daily:_ Select specific days of the week and number of times per day.
    - _Weekly:_ Select the number of times per week.
    - _Monthly:_ Choose between Gregorian/Islamic calendars and specify days.
    - _Yearly._
  - **Goal (Optional):** Set a target for the deed.
    - Define a `Value` (numeric) and a `Unit` (e.g., Count, Minutes, Hours, Pages, or a custom unit).
  - **Parent Deed (Optional):** Assign a hierarchical parent to the deed.
