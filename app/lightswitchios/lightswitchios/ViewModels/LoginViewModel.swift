//
//  LoginViewModel.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/8/24.
//

import Foundation

class LoginViewModel: ObservableObject {
    @Published var isLoggedIn: Bool = false
    @Published var loginResponse: LoginResponse? = nil
    
    func login(email: String, password: String) {
        let loginRequest = LoginRequest(email: email, password: password)
        
        let template : HttpRequest = HttpRequest<LoginRequest, BaseResponse<LoginResponse>>()
        template.request(method: .POST, path: "api/v1/member/login", parameters: loginRequest) { result in
            switch result {
            case .success(let response):
                DispatchQueue.main.async {
                    if let data = response.data {
                        self.isLoggedIn = true
                        self.loginResponse = data
                        print("loginResponse: \(data)")
                    } else {
                        self.isLoggedIn = false
                        print("로그인 실패")
                    }
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    self.isLoggedIn = false
                    print("Error: \(error.localizedDescription)")
                }
            }
        }
    }
}
