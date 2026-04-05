# Codex Prompt: Firebase Auth + Apple Sign In Integration

## Context
The DoomForGood iOS app (bundle ID: `com.rockpaperreality.DoomForGood`) now has Firebase configured:
- `GoogleService-Info.plist` is in the project (DoomForGood/DoomForGood/ alongside Models, Services, etc.)
- Firebase SPM packages added: **FirebaseAuth**, **FirebaseAnalytics**, and **GoogleSignIn** (add GoogleSignIn via SPM if not already present: `https://github.com/google/GoogleSignIn-iOS`)
- Firebase Console: Authentication enabled with **Apple** and **Google** sign-in providers
- Updated `GoogleService-Info.plist` with Google OAuth client IDs (already replaced in Xcode)
- The app uses SwiftUI with `@main` entry point in `DoomForGoodApp.swift`
- Stripe is already integrated (test mode) via `StripeService.swift`
- User settings stored in `AppSettings.swift` (singleton, `@Published` properties backed by UserDefaults)

## What to Build

### 1. Initialize Firebase in DoomForGoodApp.swift

In `DoomForGoodApp.swift`, add Firebase initialization. The app does NOT use AppDelegate — it uses SwiftUI's `@main` struct pattern.

**Changes to `DoomForGoodApp.swift`:**
- Add `import FirebaseCore` at top
- Add an `init()` block (one already exists at line 27) — add `FirebaseApp.configure()` as the FIRST line inside the existing `init()`, before the Stripe and notification coordinator setup
- That's it for this file. Do NOT create a separate AppDelegate class — use the existing init.

```swift
// At top of file, add:
import FirebaseCore

// Inside the existing init(), add as first line:
init() {
    FirebaseApp.configure()  // ← ADD THIS LINE
    print("🚀 DoomForGood launching...")
    // ... rest of existing init code stays the same
}
```

### 2. Create AuthenticationService.swift

Create a new file: `DoomForGood/DoomForGood/Services/AuthenticationService.swift`

This service manages Firebase Auth state and Apple Sign In. Requirements:

```swift
import Foundation
import FirebaseCore
import FirebaseAuth
import GoogleSignIn
import AuthenticationServices
import CryptoKit

final class AuthenticationService: ObservableObject {
    static let shared = AuthenticationService()

    @Published var currentUser: User?  // Firebase Auth User
    @Published var isSignedIn: Bool = false
    @Published var userEmail: String?
    @Published var displayName: String?

    // For Apple Sign In nonce
    private var currentNonce: String?

    private init() {
        // Listen for auth state changes
        Auth.auth().addStateDidChangeListener { [weak self] _, user in
            DispatchQueue.main.async {
                self?.currentUser = user
                self?.isSignedIn = user != nil
                self?.userEmail = user?.email
                self?.displayName = user?.displayName
            }
        }
    }

    // MARK: - Google Sign In

    /// Sign in with Google using Firebase Auth
    func signInWithGoogle(presenting viewController: UIViewController, completion: @escaping (Bool, Error?) -> Void) {
        guard let clientID = FirebaseApp.app()?.options.clientID else {
            completion(false, NSError(domain: "AuthService", code: -1, userInfo: [NSLocalizedDescriptionKey: "Missing Firebase client ID"]))
            return
        }

        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config

        GIDSignIn.sharedInstance.signIn(withPresenting: viewController) { [weak self] result, error in
            if let error {
                print("❌ Google sign in failed: \(error.localizedDescription)")
                completion(false, error)
                return
            }

            guard let user = result?.user,
                  let idToken = user.idToken?.tokenString else {
                completion(false, NSError(domain: "AuthService", code: -1, userInfo: [NSLocalizedDescriptionKey: "Missing Google ID token"]))
                return
            }

            let credential = GoogleAuthProvider.credential(withIDToken: idToken, accessToken: user.accessToken.tokenString)

            Auth.auth().signIn(with: credential) { authResult, error in
                DispatchQueue.main.async {
                    if let error {
                        print("❌ Firebase Google sign in failed: \(error.localizedDescription)")
                        completion(false, error)
                        return
                    }

                    if let firebaseUser = authResult?.user {
                        print("✅ Google signed in as: \(firebaseUser.email ?? "no email")")
                        self?.userEmail = firebaseUser.email
                        self?.displayName = firebaseUser.displayName
                        AppSettings.shared.userEmail = firebaseUser.email
                        completion(true, nil)
                    }
                }
            }
        }
    }

    // MARK: - Apple Sign In

    /// Generate a cryptographically secure nonce for Apple Sign In
    func generateNonce() -> String {
        // Standard 32-byte random nonce, SHA256 hashed
        let nonce = randomNonceString()
        currentNonce = nonce
        return sha256(nonce)
    }

    /// Handle the Apple Sign In credential after user completes the flow
    func signInWithApple(credential: ASAuthorizationAppleIDCredential, completion: @escaping (Bool, Error?) -> Void) {
        guard let nonce = currentNonce else {
            completion(false, NSError(domain: "AuthService", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid nonce"]))
            return
        }

        guard let appleIDToken = credential.identityToken,
              let idTokenString = String(data: appleIDToken, encoding: .utf8) else {
            completion(false, NSError(domain: "AuthService", code: -1, userInfo: [NSLocalizedDescriptionKey: "Unable to get identity token"]))
            return
        }

        let firebaseCredential = OAuthProvider.appleCredential(
            withIDToken: idTokenString,
            rawNonce: nonce,
            fullName: credential.fullName
        )

        Auth.auth().signIn(with: firebaseCredential) { [weak self] result, error in
            DispatchQueue.main.async {
                if let error {
                    print("❌ Firebase sign in failed: \(error.localizedDescription)")
                    completion(false, error)
                    return
                }

                if let user = result?.user {
                    print("✅ Signed in as: \(user.email ?? "no email")")
                    self?.userEmail = user.email
                    self?.displayName = user.displayName

                    // Store email in AppSettings for Stripe
                    AppSettings.shared.userEmail = user.email

                    completion(true, nil)
                }
            }
        }
    }

    func signOut() {
        do {
            try Auth.auth().signOut()
            AppSettings.shared.userEmail = nil
        } catch {
            print("❌ Sign out failed: \(error.localizedDescription)")
        }
    }

    // MARK: - Nonce Helpers (standard Apple Sign In implementation)

    private func randomNonceString(length: Int = 32) -> String {
        precondition(length > 0)
        var randomBytes = [UInt8](repeating: 0, count: length)
        let errorCode = SecRandomCopyBytes(kSecRandomDefault, randomBytes.count, &randomBytes)
        if errorCode != errSecSuccess {
            fatalError("Unable to generate nonce. SecRandomCopyBytes failed with OSStatus \(errorCode)")
        }
        let charset: [Character] = Array("0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._")
        return String(randomBytes.map { charset[Int($0) % charset.count] })
    }

    private func sha256(_ input: String) -> String {
        let inputData = Data(input.utf8)
        let hashedData = SHA256.hash(data: inputData)
        return hashedData.compactMap { String(format: "%02x", $0) }.joined()
    }
}
```

### 3. Add `userEmail` to AppSettings.swift

Add a new published property to `AppSettings.swift` for storing the authenticated user's email:

```swift
// Add after the stripeCardLast4 property (~line 89):
@Published var userEmail: String? {
    didSet {
        guard !isHydrating else { return }
        defaults.set(userEmail, forKey: Self.userEmailKey)
        print("💾 User email saved: \(userEmail ?? "nil")")
    }
}

// Add to the static keys section (~line 116):
private static let userEmailKey = "userEmail"

// Add to init() defaults (~line 128, after hasPaymentSetup = false):
userEmail = nil

// Add to reloadFromDefaults() (~line 155, after hasPaymentSetup line):
userEmail = defaults.string(forKey: Self.userEmailKey)

// Add to resetOnboardingStateForDebug() (~line 214):
userEmail = nil
```

### 4. Create AppleSignInButton.swift Component

Create: `DoomForGood/DoomForGood/Views/Components/AppleSignInButton.swift`

A reusable SwiftUI view that wraps Apple's `SignInWithAppleButton`:

```swift
import SwiftUI
import AuthenticationServices

struct AppleSignInButton: View {
    let onSuccess: () -> Void
    let onError: (Error) -> Void

    @StateObject private var authService = AuthenticationService.shared

    var body: some View {
        SignInWithAppleButton(.signIn) { request in
            let hashedNonce = authService.generateNonce()
            request.requestedScopes = [.email, .fullName]
            request.nonce = hashedNonce
        } onCompletion: { result in
            switch result {
            case .success(let authorization):
                if let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential {
                    authService.signInWithApple(credential: appleIDCredential) { success, error in
                        if success {
                            onSuccess()
                        } else if let error {
                            onError(error)
                        }
                    }
                }
            case .failure(let error):
                onError(error)
            }
        }
        .signInWithAppleButtonStyle(.white)
        .frame(height: 50)
        .cornerRadius(12)
    }
}
```

### 5. Create GoogleSignInButton.swift Component

Create: `DoomForGood/DoomForGood/Views/Components/GoogleSignInButton.swift`

```swift
import SwiftUI
import GoogleSignIn

struct GoogleSignInButton: View {
    let onSuccess: () -> Void
    let onError: (Error) -> Void

    var body: some View {
        Button(action: {
            guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let rootVC = windowScene.windows.first?.rootViewController else {
                return
            }

            AuthenticationService.shared.signInWithGoogle(presenting: rootVC) { success, error in
                if success {
                    onSuccess()
                } else if let error {
                    onError(error)
                }
            }
        }) {
            HStack(spacing: 12) {
                Image(systemName: "g.circle.fill")
                    .font(.system(size: 20))
                Text("Sign in with Google")
                    .font(.system(size: 16, weight: .medium))
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Color.white)
            .foregroundColor(.black)
            .cornerRadius(12)
        }
    }
}
```

### 6. Add Sign In to Onboarding Flow

Both Apple and Google Sign In buttons should appear in the onboarding flow BEFORE the charity picker step. Apple Sign In button MUST appear first (Apple requirement when offering multiple sign-in options).

Create: `DoomForGood/DoomForGood/Views/Onboarding/SignInStepView.swift`

```swift
import SwiftUI

struct SignInStepView: View {
    let onContinue: () -> Void

    @State private var showError = false
    @State private var errorMessage = ""

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            NeonText(text: "IDENTIFY YOURSELF", size: 28)

            Text("Sign in so the troll knows where to send your tax receipt.")
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(DoomTheme.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)

            VStack(spacing: 12) {
                AppleSignInButton(
                    onSuccess: { onContinue() },
                    onError: { error in
                        errorMessage = error.localizedDescription
                        showError = true
                    }
                )

                GoogleSignInButton(
                    onSuccess: { onContinue() },
                    onError: { error in
                        errorMessage = error.localizedDescription
                        showError = true
                    }
                )
            }
            .padding(.horizontal, 32)

            if showError {
                Text(errorMessage)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(DoomTheme.hotPink)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Button("SKIP FOR NOW") {
                onContinue()
            }
            .font(.system(size: 12, weight: .bold, design: .monospaced))
            .foregroundColor(DoomTheme.textSecondary)

            Spacer()
        }
        .background(DoomTheme.background.ignoresSafeArea())
    }
}
```

**Integration point:** In `OnboardingFlowView.swift`, insert this step after the welcome/intro and before charity selection. The exact integration depends on how the onboarding flow is structured — look for the step management logic and add this as a new step.

### 6. Wire Email to Stripe Customer Creation

In `FirstTimePaymentSheet.swift` at line 150, replace the hardcoded email:

**Before:**
```swift
StripeService.shared.createCustomer(email: "mortal@doomforgood.app") { customerId, error in
```

**After:**
```swift
let userEmail = AppSettings.shared.userEmail ?? "anonymous@doomforgood.app"
StripeService.shared.createCustomer(email: userEmail) { customerId, error in
```

Do the same in any other file that calls `createCustomer(email:)` — search the entire project for `"mortal@doomforgood.app"` and replace all instances.

### 7. Add Sign In with Apple Capability in Xcode

This is a manual step but document it as a comment in the code:

In Xcode → DoomForGood target → Signing & Capabilities → + Capability → **Sign In with Apple**

This adds the entitlement. Without it, the Apple Sign In button will crash at runtime.

### 8. Show Email in Settings

In `SettingsView.swift`, add a section showing the authenticated user's email (or a sign-in prompt if not authenticated):

```swift
// Add in the settings list, near the top:
if let email = AuthenticationService.shared.userEmail {
    HStack {
        Image(systemName: "person.circle.fill")
            .foregroundColor(DoomTheme.neonGreen)
        VStack(alignment: .leading) {
            Text("Signed in as")
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(DoomTheme.textSecondary)
            Text(email)
                .font(.system(size: 14, weight: .bold, design: .monospaced))
                .foregroundColor(.white)
        }
        Spacer()
        Button("Sign Out") {
            AuthenticationService.shared.signOut()
        }
        .font(.system(size: 11, weight: .bold))
        .foregroundColor(DoomTheme.hotPink)
    }
    .padding(12)
    .background(DoomTheme.backgroundDeep)
    .clipShape(RoundedRectangle(cornerRadius: 12))
} else {
    VStack(spacing: 8) {
        AppleSignInButton(
            onSuccess: { },
            onError: { _ in }
        )
        GoogleSignInButton(
            onSuccess: { },
            onError: { _ in }
        )
    }
    .padding(.horizontal)
}
```

### 9. Update DonationConfirmationView.swift

In `DonationConfirmationView.swift`, the "Tax receipt sent by Every.org to your email" messaging should only show if the user actually has an email on file:

```swift
// Replace the static tax receipt text with:
if let email = AppSettings.shared.userEmail {
    Text("Tax receipt from Every.org will be sent to \(email)")
} else {
    Text("Sign in to receive your tax receipt")
}
```

## SPM Dependencies to Add
- If not already present, add **GoogleSignIn** package: `https://github.com/google/GoogleSignIn-iOS` (add `GoogleSignIn` and `GoogleSignInSwift` products to the DoomForGood target)

## URL Scheme Required for Google Sign In
In `DoomForGoodApp.swift`, add a handler for the Google Sign In callback URL. In the project's Info.plist (or Xcode target → Info → URL Types), add a URL scheme using the `REVERSED_CLIENT_ID` value from `GoogleService-Info.plist`. Codex should read the plist to get this value and configure it.

Also add this to `DoomForGoodApp.swift` inside the `onOpenURL` handler:
```swift
.onOpenURL { url in
    // Handle Google Sign In callback
    GIDSignIn.sharedInstance.handle(url)
    // Existing URL handling
    handleURL(url)
}
```

## Files to Create
1. `DoomForGood/DoomForGood/Services/AuthenticationService.swift`
2. `DoomForGood/DoomForGood/Views/Components/AppleSignInButton.swift`
3. `DoomForGood/DoomForGood/Views/Components/GoogleSignInButton.swift`
4. `DoomForGood/DoomForGood/Views/Onboarding/SignInStepView.swift`

## Files to Modify
1. `DoomForGoodApp.swift` — Add `import FirebaseCore` + `FirebaseApp.configure()` in existing init
2. `AppSettings.swift` — Add `userEmail` property + key + hydration + reset
3. `FirstTimePaymentSheet.swift` — Replace hardcoded `"mortal@doomforgood.app"` with `AppSettings.shared.userEmail`
4. `SettingsView.swift` — Add signed-in user display + sign out button
5. `DonationConfirmationView.swift` — Conditional tax receipt messaging based on email availability
6. `OnboardingFlowView.swift` — Insert sign-in step into onboarding flow

## Do NOT Change
- The existing Stripe payment flow logic
- Shield cycle state machine
- Screen time monitoring
- Extension targets (they don't need Firebase)
- The `GoogleService-Info.plist` (already configured)

## Manual Steps Required (Not Codex)
- In Xcode: Add **Sign In with Apple** capability to DoomForGood target
- In Apple Developer Portal: Enable Sign In with Apple for the App ID
- In Firebase Console: Verify Apple sign-in provider is enabled (already done)

## Testing
After implementation, verify:
1. App launches without crash (Firebase configured correctly)
2. Apple Sign In button appears in onboarding (MUST be first/above Google button)
3. Google Sign In button appears below Apple button
4. Completing either sign-in stores email in AppSettings
5. Email appears in SettingsView
6. Stripe customer creation uses the real email
7. Skipping sign-in still allows the app to function (graceful degradation)
8. Sign out clears the email and shows sign-in buttons in Settings
9. Google Sign In callback URL scheme is registered and works
