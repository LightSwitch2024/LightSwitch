//
//  FlagView.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/9/24.
//

import SwiftUI

struct FlagView: View {
    @StateObject var flagViewModel: FlagViewModel
    
    var body: some View {
        VStack {
            if flagViewModel.isLoading {
                FlagProgressView()
            } 
            else {
                FlagContentView(flagViewModel: flagViewModel)
            }
        }
        .onAppear() {
            flagViewModel.getFlags()
        }
    }
}

struct FlagProgressView: View {
    var body: some View {
        VStack {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle())
                .scaleEffect(2)
        }
    }
}

struct FlagContentView: View {
    @StateObject var flagViewModel: FlagViewModel
    
    var body: some View {
        VStack {
            Text("플래그 관리")
                .font(.title3)
                .padding(.top, 16)
            
            HStack {
                Spacer()
                
                Button(action: {
                    flagViewModel.logout()
                }) {
                    Text("로그아웃")
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.loginBtn)
                        .cornerRadius(8)
                }
                .padding()
            }
        }
        
        ScrollView {
            VStack (spacing: 16) {
                ForEach(flagViewModel.flags, id: \.self) { flag in
                    FlagCardView(flag: flag, isOn: flag.active, flagViewModel: flagViewModel)
                }
            }
            .padding()
        }
    }
}

struct FlagCardView: View {
    var flag: Flag
    @State var isOn: Bool
    @StateObject var flagViewModel: FlagViewModel
    @State private var isTapped = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            VStack() {
                HStack {
                    Text(flag.title)
                        .font(.title2)
                    
                    Spacer()
                    
                    
                    HStack {
                        Image(systemName: "person.circle")
                            .resizable()
                            .frame(width: 25, height: 25)
                            .mask(Circle())
                            .padding(.leading, 8)
                        
                        Text(flag.maintainerName)
                            .font(.body)
                            .padding(.trailing, 8)
                    }
                    .padding(.vertical, 4)
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(Color.black, lineWidth: 1)
                    )
                }
                
                HStack {
                    Text(flag.description)
                        .font(.body)
                        .lineLimit(isTapped ? nil : 1)
                        .truncationMode(.tail)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                
                if !isTapped {
                    HStack() {
                        Spacer()
                        
                        ZStack {
                            Circle() // 테두리를 그립니다.
                                .stroke(isOn ? Color.loginBtn : .gray, lineWidth: 2)
                                .frame(width: 23, height: 23) // 테두리의 크기를 조절합니다.
                
                            Circle() // 내부의 원을 그립니다.
                                .fill(isOn ? Color.loginBtn : .gray) // 내부 원의 색상을 설정합니다.
                                .frame(width: 15, height: 15) // 내부 원의 크기를 조절합니다.
                        }
                        
                        Text(isOn ? "ON" : "OFF")
                            .font(.body)
                            .foregroundColor(isOn ? Color.loginBtn : .gray)
                    }
                }
            }
            
            VStack() {
                if isTapped {
                    HStack() {
                        Toggle(isOn: $isOn) {}
                        .onChange(of: self.isOn) {
                            flagViewModel.switchFlag(flagId: flag.flagId, active: !$0)
                            isOn = $0
                        }
                        .toggleStyle(SwitchToggleStyle(tint: self.isOn ? Color.loginBtn : .red))
                    }
                }
            }
            .onTapGesture {
                return
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(8)
        .shadow(color: Color.gray.opacity(0.3), radius: 4, x: 0, y: 2)
        .onTapGesture {
            isTapped.toggle()
        }
    }
}

#Preview {
    FlagView(flagViewModel: FlagViewModel(contentViewModel: ContentViewModel()))
}
