//
//  BaseResponse.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/8/24.
//

import Foundation

struct BaseResponse<T: Decodable>: Decodable {
    let code: Int32
    let message: String
    let data: T?
}
