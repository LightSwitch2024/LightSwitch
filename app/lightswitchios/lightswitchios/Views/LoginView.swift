//
//  LoginView.swift
//  lightswitchios
//
//  Created by 김동훈 on 5/8/24.
//

import SwiftUI

struct LoginView: View {
    @ObservedObject var loginViewModel: LoginViewModel
    
    @State private var email: String = ""
    @State private var password: String = ""
    
    var body: some View {
        VStack (spacing: 16) {
            Image("LoginImg")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .padding(.horizontal, 16.0)
            
            TextField("Email", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal, 16.0)
            
            SecureField("Password", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal, 16.0)
            
            Button(action: {
                loginViewModel.login(email: email, password: password)
            }) {
                Text("로그인")
                    .foregroundColor(.white) // 텍스트 색상 변경
                    .padding() // 버튼 내부 패딩
                    .frame(maxWidth: .infinity) // 버튼 폭을 최대로 늘림
                    .background(Color.loginBtn) // 배경색 변경
                    .cornerRadius(8) // 버튼 모서리 둥글게 처리
            }
            .padding()
        }
        .padding()
        
        if(loginViewModel.isLoggedIn) {
            Text("멤버 아이디: ${loginViewModel.loginResponse?.memberId}")
                .padding()
            Text("멤버 이름: ${loginViewModel.loginResponse?.lastName}${loginViewModel.loginResponse?.firstName}")
                .padding()
        }
    
        Spacer()
    }
}

#Preview {
    LoginView(loginViewModel: LoginViewModel())
}
