//
//  FlagResponse.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/9/24.
//

import Foundation

typealias Flags = [Flag]

struct Flag: Decodable, Hashable {
    let active: Bool
    let description: String
    let flagId: Int32
    let maintainerName: String
    let tags: Tags
    let title: String
}
