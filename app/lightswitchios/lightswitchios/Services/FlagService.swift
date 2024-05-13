//
//  FlagService.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/9/24.
//

import Foundation
import Combine

struct FlagService {
    
    func getFlags() -> AnyPublisher<BaseResponse<Flags>, Error> {
        let path: String = "api/v1/flag"
        
        return APIService.request(path: path, method: HTTPMethod.GET)
    }
    
    func switchFlag(flagId: Int32, switchRequest: SwitchRequest) -> AnyPublisher<BaseResponse<Int64>, Error> {
        let path: String = "api/v1/flag/\(flagId)"
        
        return APIService.request(path: path, method: HTTPMethod.PATCH, body: switchRequest)
    }
}
