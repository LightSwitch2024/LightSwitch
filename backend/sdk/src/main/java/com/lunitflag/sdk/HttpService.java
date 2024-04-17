package com.lunitflag.sdk;

import okhttp3.OkHttpClient;

public class HttpService {

    private final OkHttpClient okHttpClient;


    public HttpService(OkHttpClient okHttpClient) {
        this.okHttpClient = okHttpClient;
    }

    public OkHttpClient getOkHttpClient() {
        return okHttpClient;
    }

    public void close() {
        okHttpClient.dispatcher().executorService().shutdown();
        okHttpClient.connectionPool().evictAll();
    }




}
