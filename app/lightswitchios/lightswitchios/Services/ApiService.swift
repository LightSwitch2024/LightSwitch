//
//  APIService.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/9/24.
//

import Foundation
import Combine

enum HTTPMethod: String {
    case GET
    case POST
    case PUT
    case PATCH
    case DELETE
}

struct APIService {
 
    static let baseURL: URL = URL(string: "http://70.12.246.226:8000/")!
    
    static func request<T: Decodable>(path: String, method: HTTPMethod, headers: [String: String] = [:]) -> AnyPublisher<T, Error> {
        let url = baseURL.appendingPathComponent(path)
        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        request.allHTTPHeaderFields = headers
       
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: T.self, decoder: JSONDecoder())
            .eraseToAnyPublisher()
    }
                               
    static func request<D: Encodable, T: Decodable>(path: String, method: HTTPMethod, body: D? = nil, headers: [String: String] = [:]) -> AnyPublisher<T, Error> {
        let url = baseURL.appendingPathComponent(path)
        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        if let body = body {
            request.httpBody = try? JSONEncoder().encode(body)
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        request.allHTTPHeaderFields = headers
        
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: T.self, decoder: JSONDecoder())
            .eraseToAnyPublisher()
    }
}
