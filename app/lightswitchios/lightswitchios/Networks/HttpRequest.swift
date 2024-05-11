//
//  HttpRequest.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/8/24.
//

import Foundation

enum HTTPMethod: String {
    case GET
    case POST
    case PUT
    case PATCH
    case DELETE
}

class HttpRequest<RequestParams: Codable, ResonseData: Codable> {
    let baseURL: URL
    
    init() {
        self.baseURL = URL(string: "http://70.12.246.226:8000/")!
    }
    
    func request(method: HTTPMethod, path: String, parameters: RequestParams?, completion: @escaping (Result<ResonseData, Error>) -> Void) {
        let url = baseURL.appendingPathComponent(path)
        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        
        if let parameters = parameters {
            request.httpBody = try? JSONEncoder().encode(parameters)
//            request.httpBody = try? JSON..data(withJSONObject: parameters)
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        
        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "Data is nil", code: -1, userInfo: nil)))
                return
            }
            
            do {
                let decodedData = try JSONDecoder().decode(ResonseData.self, from: data)
                completion(.success(decodedData))
            } catch {
                completion(.failure(error))
            }
        }
        task.resume()
    }
}
