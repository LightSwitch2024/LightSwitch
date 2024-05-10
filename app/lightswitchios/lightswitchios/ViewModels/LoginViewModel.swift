//
//  LoginViewModel.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/8/24.
//

import Foundation
import Combine

class LoginViewModel: ObservableObject {
    @Published var contentViewModel: ContentViewModel
    @Published var loginResponse: LoginResponse? = nil
    
    var cancellables = Set<AnyCancellable>()
    
    private let loginService: LoginService
    
    init(contentViewModel: ContentViewModel) {
        self.contentViewModel = contentViewModel
        self.loginService = LoginService()
    }
    
    func login(email: String, password: String) {
        let loginRequest = LoginRequest(email: email, password: password)
        
        loginService.login(loginRequest: loginRequest)
            .sink(receiveCompletion: { completion in
                switch completion {
                case .finished:
                    break
                case .failure(let error):
                    print("Error: \(error.localizedDescription)")
                }
            }, receiveValue: { response in
                DispatchQueue.main.async {
                    if let data = response.data {
                        self.loginResponse = data
                        self.contentViewModel.saveLoginResponse(loginResponse: data)
                        print("loginResponse: \(data)")
                    } else {
                        print("로그인 실패")
                    }
                }
            })
            .store(in: &cancellables)
    }
}
