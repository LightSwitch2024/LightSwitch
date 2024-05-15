//
//  LoginService.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/9/24.
//

import Foundation
import Combine

struct LoginService {
    
    func login(loginRequest: LoginRequest) -> AnyPublisher<BaseResponse<LoginResponse>, Error> {
        let path: String = "api/v1/member/login"
        
        return APIService.request(path: path, method: HTTPMethod.POST, body: loginRequest)
    }
}
