//
//  ContentView.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/10/24.
//

import SwiftUI

struct ContentView: View {
    @ObservedObject var contentViewModel: ContentViewModel
    @ObservedObject var loginViewModel: LoginViewModel
    @ObservedObject var flagViewModel: FlagViewModel
    
    init(contentViewModel: ContentViewModel) {
        self.contentViewModel = contentViewModel
        self.loginViewModel = LoginViewModel(contentViewModel: contentViewModel)
        self.flagViewModel = FlagViewModel(contentViewModel: contentViewModel)
    }
    
    var body: some View {
        NavigationView {
            if contentViewModel.isLoggedIn {
                FlagView(flagViewModel: flagViewModel)
            } else {
                LoginView(loginViewModel: loginViewModel)
            }
        }
    }
}

#Preview {
    ContentView(contentViewModel: ContentViewModel())
}
