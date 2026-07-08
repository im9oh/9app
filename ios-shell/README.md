# Studio Shell — sideloadable iOS launcher

A tiny native app you sideload **once**. It loads your projects (web apps) from a
`projects.json` manifest and opens each in a full-screen web view. Your apps live
and update on the cloud (GitHub Pages / Cloudflare), so you ship changes by
deploying — **no re-sideloading** to update an app.

It also bridges **local notifications**: a project's web app can ask the shell to
schedule on-device notifications (used here for due-reminders + a weekly recap).
No paid Apple Developer account and no push server required.

## Build & sideload (one time)

You need a **Mac with Xcode** and your **iPhone + a USB cable**.

1. **Create the project**
   - Xcode → **File ▸ New ▸ Project… ▸ iOS ▸ App** → Next.
   - Product Name: `StudioShell` · Interface: **SwiftUI** · Language: **Swift**.
   - Pick a Team (your free Apple ID is fine) and any unique Bundle Identifier,
     e.g. `com.yourname.studioshell`. Finish.

2. **Drop in the code**
   - In the new project you'll have `StudioShellApp.swift` and `ContentView.swift`.
   - **Delete both** (right-click ▸ Delete ▸ Move to Trash).
   - Drag **`StudioShell.swift`** (this folder) into the project (tick
     "Copy items if needed"). This one file contains the whole app.

3. **Allow notifications wording (optional but nice)**
   - Select the project ▸ your target ▸ **Info** tab ▸ add a row:
     Key `Privacy - User Notifications Usage Description` isn't required for local
     notifications, so you can skip this. (No special capability is needed —
     local notifications work without the Push Notifications entitlement.)

4. **Run on your iPhone**
   - Plug in your iPhone, select it as the run destination (top bar), press **▶**.
   - First run: on the iPhone, **Settings ▸ General ▸ VPN & Device Management** →
     trust your developer certificate.
   - The app launches, shows **My Apps**, and Studio Nine opens inside it. Tap
     **Allow** when it asks about notifications.

## Updating

- **Change an app (e.g. Studio Nine):** just deploy the web app. The shell always
  loads the latest — nothing to reinstall.
- **Add another project:** add an entry to `projects.json` (see below) and deploy.
  It appears in the launcher automatically.
- **Change the shell itself** (rare): re-run from Xcode.

## Free-account note

With a **free** Apple ID, a sideloaded app stops opening after **7 days** — just
re-run it from Xcode to refresh it (your data and the cloud apps are untouched).
A paid Apple Developer account ($99/yr) extends this to a year, and tools like
**AltStore / SideStore** can auto-re-sign over Wi-Fi if you'd rather not plug in.

## The manifest (`projects.json`)

```json
{
  "projects": [
    {
      "id": "studio-nine",
      "name": "Studio Nine",
      "subtitle": "Music production HQ",
      "emoji": "🎛️",
      "color": "#8b5cf6",
      "url": "https://im9oh.github.io/9app/"
    }
  ]
}
```

Point `MANIFEST_URL` at the top of `StudioShell.swift` to wherever you serve this
file. Swap the GitHub Pages URLs for your Cloudflare URLs once Pages is connected.
