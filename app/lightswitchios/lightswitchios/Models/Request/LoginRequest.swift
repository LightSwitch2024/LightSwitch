//
//  LoginRequest.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/8/24.
//

import Foundation

struct LoginRequest: Encodable {
    let email: String
    let password: String
}
