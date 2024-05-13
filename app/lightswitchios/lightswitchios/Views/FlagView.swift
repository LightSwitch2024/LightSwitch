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
            } else {
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
                .font(.title)
            
            Button(action: {
                flagViewModel.logout()
            }) {
                Text("로그아웃")
                    .foregroundColor(.white) // 텍스트 색상 변경
                    .padding() // 버튼 내부 패딩
                    .frame(maxWidth: .infinity) // 버튼 폭을 최대로 늘림
                    .background(Color.loginBtn) // 배경색 변경
                    .cornerRadius(8) // 버튼 모서리 둥글게 처리
            }
            .padding()
        }
        
        ScrollView {
            VStack (spacing: 16) {
                ForEach(flagViewModel.flags, id: \.self) { flag in
                    FlagCardView(flag: flag, flagViewModel: flagViewModel)
                }
            }
            .padding()
        }
    }
}

struct FlagCardView: View {
    var flag: Flag
    @StateObject var flagViewModel: FlagViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(flag.title)
                    .font(.headline)
                
                Spacer()
                
                Text(flag.maintainerName)
                    .font(.body)
            }
            
            HStack {
                Text(flag.description)
                    .font(.body)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            
            HStack() {
                Spacer()
                
                Image(systemName: flag.active ? "circle.fill" : "circle")
                    .font(.title)
                    .foregroundColor(flag.active ? .green : .red)
                
                Text(flag.active ? "ON" : "OFF")
                    .font(.body)
            }
            
            FlagToggleView(active: flag.active, flagId: flag.flagId, flagViewModel: flagViewModel)
        }
        .padding()
        .background(Color.white)
        .cornerRadius(8)
        .shadow(color: Color.gray.opacity(0.3), radius: 4, x: 0, y: 2)
    }
}

struct FlagToggleView: View {
    @Binding var active: Bool
    var flagId: Int32
    
    @State private var offsetX: CGFloat = 0
    private let threshold: CGFloat = 200 // 드래그 전환 임계값
    @StateObject var flagViewModel: FlagViewModel

    var body: some View {
        VStack(alignment: .leading) {
            Rectangle() // 비어있는 직사각형
                .fill(active ? Color.green : Color.red) // 배경색 설정
                .frame(height: 50) // 직사각형 크기 지정
        }
        .gesture(
            DragGesture()
                .onChanged { value in
                    offsetX = value.translation.width // 드래그한 거리에 따라 offsetX 업데이트
                }
                .onEnded { value in
                    if abs(offsetX) > threshold { // 드래그 거리가 임계값을 넘으면
                        flagViewModel.switchFlag(flagId: flagId)
                        active.toggle() // 상태 전환
                    }
                    withAnimation {
                        offsetX = 0 // 드래그 종료 시 offsetX 초기화
                    }
                }
        )
    }
}

#Preview {
    FlagView(flagViewModel: FlagViewModel(contentViewModel: ContentViewModel()))
}
