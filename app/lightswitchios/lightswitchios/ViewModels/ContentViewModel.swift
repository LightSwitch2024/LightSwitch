//
//  ContentViewModel.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/10/24.
//

import Foundation

class ContentViewModel: ObservableObject {
    
    @Published var isLoggedIn: Bool = UserDefaults.standard.bool(forKey: "isLoggedIn")
    @Published var count: Int = 0
    
    func test() {
        isLoggedIn = !isLoggedIn
    }
    
    func saveLoginResponse(loginResponse: LoginResponse? = nil) {
        if let loginResponse = loginResponse {
            UserDefaults.standard.set(loginResponse.memberId, forKey: "memberId")
            UserDefaults.standard.set(loginResponse.email, forKey: "email")
            UserDefaults.standard.set(loginResponse.firstName, forKey: "firstName")
            UserDefaults.standard.set(loginResponse.lastName, forKey: "lastName")
            UserDefaults.standard.set(loginResponse.telNumber, forKey: "telNumber")
            UserDefaults.standard.set(true, forKey: "isLoggedIn")
            isLoggedIn = true
            print("isLoggedIn: \(isLoggedIn)")
        }
    }
    
    func removeLoginResponse() {
        UserDefaults.standard.removeObject(forKey: "memberId")
        UserDefaults.standard.removeObject(forKey: "email")
        UserDefaults.standard.removeObject(forKey: "firstName")
        UserDefaults.standard.removeObject(forKey: "lastName")
        UserDefaults.standard.removeObject(forKey: "telNumber")
        UserDefaults.standard.removeObject(forKey: "isLoggedIn")
        isLoggedIn = false
        print("isLoggedIn: \(isLoggedIn)")
    }
}
