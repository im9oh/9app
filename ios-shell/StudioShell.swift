// StudioShell.swift
// A tiny native "launcher" you sideload ONCE. It reads a projects.json manifest
// and opens each project's web app in a WKWebView. Web apps live/update on
// Cloudflare (or GitHub Pages), so you ship changes without re-sideloading.
//
// Setup: see ios-shell/README.md. Replace the default ContentView.swift/App file
// in a fresh SwiftUI app with this single file.

import SwiftUI
import WebKit
import UserNotifications

// ── Config ───────────────────────────────────────────────────────────────────
// Point this at wherever your manifest is served. Swap to your Cloudflare URL
// once Pages is connected (e.g. https://yourname.pages.dev/projects.json).
let MANIFEST_URL = "https://im9oh.github.io/9app/projects.json"

// ── App entry ────────────────────────────────────────────────────────────────
@main
struct StudioShellApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    var body: some Scene {
        WindowGroup {
            LauncherView().preferredColorScheme(.dark)
        }
    }
}

final class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { _, _ in }
        return true
    }
    // Show notifications even while the app is open.
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound, .badge])
    }
}

// ── Model ────────────────────────────────────────────────────────────────────
struct Project: Identifiable, Decodable {
    let id: String
    let name: String
    var subtitle: String?
    var emoji: String?
    var color: String?
    let url: String
}
struct Manifest: Decodable { let projects: [Project] }

// ── Launcher ─────────────────────────────────────────────────────────────────
struct LauncherView: View {
    @State private var projects: [Project] = []
    @State private var selected: Project?
    @State private var loading = true
    @State private var error: String?

    private let bg = Color(red: 0.043, green: 0.043, blue: 0.070)

    var body: some View {
        ZStack {
            bg.ignoresSafeArea()
            if let sel = selected {
                ProjectWebView(project: sel) { selected = nil }
                    .transition(.move(edge: .trailing))
            } else {
                launcher
            }
        }
        .task { await load() }
    }

    private var launcher: some View {
        VStack(alignment: .leading, spacing: 22) {
            VStack(alignment: .leading, spacing: 4) {
                Text("My Apps").font(.system(size: 34, weight: .bold)).foregroundColor(.white)
                Text("Sideloaded shell · apps update from the cloud")
                    .font(.footnote).foregroundColor(.gray)
            }
            if loading {
                Spacer(); ProgressView().tint(.white).frame(maxWidth: .infinity); Spacer()
            } else if let e = error {
                Spacer()
                VStack(spacing: 10) {
                    Text("Couldn't load your apps").foregroundColor(.white).font(.headline)
                    Text(e).foregroundColor(.gray).font(.footnote).multilineTextAlignment(.center)
                    Button("Retry") { Task { await load() } }.tint(.purple)
                }.frame(maxWidth: .infinity)
                Spacer()
            } else {
                ScrollView {
                    LazyVGrid(columns: [GridItem(.flexible(), spacing: 16), GridItem(.flexible())], spacing: 16) {
                        ForEach(projects) { p in
                            Button { withAnimation(.easeOut(duration: 0.25)) { selected = p } } label: {
                                ProjectTile(project: p)
                            }.buttonStyle(.plain)
                        }
                    }
                }
            }
            Spacer(minLength: 0)
        }
        .padding(24)
    }

    private func load() async {
        loading = true; error = nil
        guard let u = URL(string: MANIFEST_URL) else { error = "Bad manifest URL."; loading = false; return }
        do {
            var req = URLRequest(url: u)
            req.cachePolicy = .reloadIgnoringLocalCacheData
            let (data, _) = try await URLSession.shared.data(for: req)
            projects = try JSONDecoder().decode(Manifest.self, from: data).projects
        } catch {
            self.error = error.localizedDescription
        }
        loading = false
    }
}

struct ProjectTile: View {
    let project: Project
    private var accent: Color { Color(hex: project.color ?? "#8b5cf6") }
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(project.emoji ?? "📱").font(.system(size: 32))
            Spacer(minLength: 0)
            Text(project.name).font(.headline).foregroundColor(.white).lineLimit(1)
            if let s = project.subtitle {
                Text(s).font(.caption).foregroundColor(.gray).lineLimit(2)
            }
        }
        .frame(maxWidth: .infinity, minHeight: 140, alignment: .topLeading)
        .padding(16)
        .background(Color.white.opacity(0.05))
        .overlay(RoundedRectangle(cornerRadius: 20).stroke(accent.opacity(0.35), lineWidth: 1))
        .clipShape(RoundedRectangle(cornerRadius: 20))
    }
}

// ── Project web view ─────────────────────────────────────────────────────────
struct ProjectWebView: View {
    let project: Project
    let onHome: () -> Void
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button(action: onHome) {
                    Image(systemName: "square.grid.2x2.fill").foregroundColor(.white)
                }
                Spacer()
                Text(project.name).foregroundColor(.white).font(.subheadline.weight(.semibold))
                Spacer()
                Image(systemName: "square.grid.2x2.fill").opacity(0) // balances the layout
            }
            .padding(.horizontal, 16).padding(.vertical, 10)
            .background(Color(red: 0.063, green: 0.063, blue: 0.098))
            WebView(urlString: project.url, project: project.id).ignoresSafeArea(edges: .bottom)
        }
        .background(Color(red: 0.043, green: 0.043, blue: 0.070))
    }
}

struct WebView: UIViewRepresentable {
    let urlString: String
    let project: String

    func makeCoordinator() -> Coordinator { Coordinator(project: project) }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        let ucc = WKUserContentController()
        ucc.add(context.coordinator, name: "shell")
        config.userContentController = ucc
        config.websiteDataStore = .default() // persistent localStorage across launches
        let wv = WKWebView(frame: .zero, configuration: config)
        wv.isOpaque = false
        wv.backgroundColor = .clear
        wv.scrollView.backgroundColor = .clear
        wv.allowsBackForwardNavigationGestures = true
        if let u = URL(string: urlString) {
            wv.load(URLRequest(url: u, cachePolicy: .reloadIgnoringLocalCacheData))
        }
        return wv
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    final class Coordinator: NSObject, WKScriptMessageHandler {
        let project: String
        init(project: String) { self.project = project }

        func userContentController(_ ucc: WKUserContentController, didReceive message: WKScriptMessage) {
            guard message.name == "shell",
                  let body = message.body as? [String: Any],
                  let type = body["type"] as? String else { return }
            if type == "scheduleNotifications", let items = body["items"] as? [[String: Any]] {
                NotificationScheduler.reschedule(project: project, items: items)
            }
        }
    }
}

// ── Local notifications ──────────────────────────────────────────────────────
enum NotificationScheduler {
    // Replace only THIS project's pending notifications, then add the new set.
    static func reschedule(project: String, items: [[String: Any]]) {
        let center = UNUserNotificationCenter.current()
        center.getPendingNotificationRequests { pending in
            let mine = pending.filter { $0.identifier.hasPrefix(project + ":") }.map { $0.identifier }
            center.removePendingNotificationRequests(withIdentifiers: mine)
            for it in items {
                guard let title = it["title"] as? String,
                      let bodyText = it["body"] as? String,
                      let atStr = it["at"] as? String,
                      let date = parseDate(atStr) else { continue }

                let content = UNMutableNotificationContent()
                content.title = title
                content.body = bodyText
                content.sound = .default

                let weekly = (it["repeat"] as? String) == "weekly"
                let trigger: UNCalendarNotificationTrigger
                if weekly {
                    let c = Calendar.current.dateComponents([.weekday, .hour, .minute], from: date)
                    trigger = UNCalendarNotificationTrigger(dateMatching: c, repeats: true)
                } else {
                    if date <= Date() { continue }
                    let c = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: date)
                    trigger = UNCalendarNotificationTrigger(dateMatching: c, repeats: false)
                }
                let rawId = (it["id"] as? String) ?? UUID().uuidString
                let req = UNNotificationRequest(identifier: project + ":" + rawId, content: content, trigger: trigger)
                center.add(req)
            }
        }
    }

    static func parseDate(_ s: String) -> Date? {
        let iso = ISO8601DateFormatter()
        if let d = iso.date(from: s) { return d }
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US_POSIX")
        f.dateFormat = "yyyy-MM-dd'T'HH:mm"
        return f.date(from: s)
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
extension Color {
    init(hex: String) {
        var s = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if s.hasPrefix("#") { s.removeFirst() }
        var v: UInt64 = 0
        Scanner(string: s).scanHexInt64(&v)
        let r = Double((v & 0xFF0000) >> 16) / 255
        let g = Double((v & 0x00FF00) >> 8) / 255
        let b = Double(v & 0x0000FF) / 255
        self.init(red: r, green: g, blue: b)
    }
}
