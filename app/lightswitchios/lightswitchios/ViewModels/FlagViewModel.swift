//
//  FlagViewModel.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/9/24.
//

import Foundation
import Combine

class FlagViewModel: ObservableObject {
    var contentViewModel: ContentViewModel
    @Published var flags: Flags = []
    @Published var error: Error?
    @Published var isLoading: Bool = false
    
    init(contentViewModel: ContentViewModel) {
        self.contentViewModel = contentViewModel
    }
    
    private var cancellables: Set<AnyCancellable> = []
    
    func getFlags() {
        self.isLoading = true
        FlagService().getFlags()
            .receive(on: DispatchQueue.main)
            .sink { completion in
                switch completion {
                case .finished:
                    self.isLoading = false
                    print("플래그 가져오기 완료")
                    break
                case .failure(let error):
                    self.isLoading = false
                    self.error = error
                }
            } receiveValue: { response in
                if let data = response.data {
                    self.flags = data
                } else {
                    print("플래그 가져오기 실패")
                }
            }
            .store(in: &cancellables)
    }
    
    func logout() {
        self.contentViewModel.removeLoginResponse()
    }
    
    @MainActor func test() {
        if flags.isEmpty {
            getFlags()
        } else {
            self.flags = []
        }
    }
    
    func switchFlag(flagId: Int32, active: Bool) {
        let switchRequest = SwitchRequest(active: active)
        
        FlagService().switchFlag(flagId: flagId, switchRequest: switchRequest)
            .receive(on: DispatchQueue.main)
            .sink { completion in
                switch completion {
                case .finished:
                    print("플래그 스위치 완료")
                    break
                case .failure(let error):
                    self.error = error
                }
            } receiveValue: { response in
                if let data = response.data {
                    print("flagId: \(data)")
                } else {
                    print("플래그 스위치 실패")
                }
            }
            .store(in: &cancellables)
    }
}
