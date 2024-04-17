package com.lunitflag.sdk;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

public class HttpServiceTests {

	protected final HttpService httpService;

	public HttpServiceTests() {
		this.httpService = new HttpService(new OkHttpClient());
	}

	// GET test
	@Test
	public void testGet() {
		// given
		String url = "http://15.165.127.196:8080/test-service/test";
		// when
        try {
            Response response = httpService.getOkHttpClient().newCall(new Request.Builder()
                    .url(url)
                    .get()
                    .build()).execute();
			ResponseBody body = response.body();
			if(body == null) {
				Assert.fail();
			}
			assertThat("fallback").isEqualTo(body.string());
		} catch (IOException e) {
            throw new RuntimeException(e);
        }
	}
}
