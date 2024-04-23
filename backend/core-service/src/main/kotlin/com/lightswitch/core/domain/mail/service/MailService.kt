package com.lightswitch.core.domain.mail.service

import com.lightswitch.core.domain.redis.service.RedisService
import jakarta.mail.internet.MimeMessage
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.ClassPathResource
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.springframework.util.FileCopyUtils
import java.nio.charset.StandardCharsets
import java.util.*


@Service
class MailService(
    private val javaMailSender: JavaMailSender,
    private val redisService: RedisService,
    @Value("\${spring.data.redis.code.signup}")
    val signupCode: String
) {
    fun sendMail(
        to: String,
    ) {

        val message: MimeMessage = javaMailSender.createMimeMessage()
        val helper: MimeMessageHelper = MimeMessageHelper(message, false, "UTF-8")

        //제목, 내용 설정
        helper.setSubject("[LightSwitch] 이메일 인증 번호 발송")
        val htmlFile = ClassPathResource("template/email_template.html")
        val htmlContent = String(FileCopyUtils.copyToByteArray(htmlFile.inputStream), StandardCharsets.UTF_8)

        val authenticationCode = createNumber() // 여기에 실제 인증 번호를 가져와서 설정
        val formattedHtmlContent = String.format(htmlContent, authenticationCode)
        helper.setText(formattedHtmlContent, true)

        // 참조자 설정
//        helper.setCc("lightswitch2024@gmail.com")

        // 발신자 설정(연동된 구글 계정으로 고정)
        helper.setFrom("no-reply@lightswitch.com")
        helper.setTo(to);

        // 로컬 첨부 파일 설정
        /*File file = new File("파일 경로");
        FileItem fileItem = new DiskFileItem("mainFile", Files.probeContentType(file.toPath()), false, file.getName(), (int) file.length(), file.getParentFile());
        InputStream input = new FileInputStream(file);
        OutputStream os = fileItem.getOutputStream();
        IOUtils.copy(input, os);
        MultipartFile multipartFile = new CommonsMultipartFile(fileItem);
        String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
        helper.addAttachment(MimeUtility.encodeText(fileName, "UTF-8", "B"), new ByteArrayResource(IOUtils.toByteArray(multipartFile.getInputStream())));*/

        // AWS S3 첨부 파일 설정
//        File file = new File("loginbg.jpeg");
//        FileUtils.copyURLToFile(new URL("https://s3.ap-northeast-2.amazonaws.com/cloudtechflow.com/image/image/image.jpeg"), file);
//        FileItem fileItem = new DiskFileItem("mainFile", Files.probeContentType(file.toPath()), false, file.getName(), (int) file.length(), file.getParentFile());
//        InputStream input = new FileInputStream(file);
//        OutputStream os = fileItem.getOutputStream();
//        IOUtils.copy(input, os);
//        MultipartFile multipartFile = new CommonsMultipartFile(fileItem);
//        List<MultipartFile> multipartFileList = Arrays.asList(multipartFile);

        //메일 전송(setTo 파라미터에 문자열 리스트를 넘기면 한번에 여러명에게 전송 가능)
        javaMailSender.send(message)
        val redisValue: String? = redisService.find("$signupCode:$to")
        if(redisValue != null) redisService.delete("$signupCode:$to")
        redisService.saveWithExpire("$signupCode:$to", authenticationCode, 60*5L)
    }

    fun createNumber(): String {
        val random: Random = Random()
        val key = StringBuffer()

        for (i in 0..7) { // 총 8자리 인증 번호 생성
            val idx: Int = random.nextInt(3) // 0~2 사이의 값을 랜덤하게 받아와 idx에 집어넣습니다

            when (idx) {
                0 ->                     // 0일 때, a~z 까지 랜덤 생성 후 key에 추가
                    key.append((random.nextInt(26) + 97).toChar())

                1 ->                     // 1일 때, A~Z 까지 랜덤 생성 후 key에 추가
                    key.append((random.nextInt(26) + 65).toChar())

                2 ->                    // 2일 때, 0~9 까지 랜덤 생성 후 key에 추가
                    key.append(random.nextInt(9))
            }
        }
        return key.toString()
    }
}