//
//  Tag.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/9/24.
//

import Foundation

typealias Tags = [Tag]

struct Tag: Decodable, Hashable {
    let colorHex: String
    let content: String
}
