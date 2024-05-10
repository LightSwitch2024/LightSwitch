//
//  lightswitchiosApp.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/8/24.
//

import SwiftUI

@main
struct lightswitchiosApp: App {
    var body: some Scene {
        WindowGroup {
//            LoginView(loginViewModel: LoginViewModel())
//            FlagView(flagViewModel: FlagViewModel())
            ContentView(contentViewModel: ContentViewModel())
        }
    }
}
