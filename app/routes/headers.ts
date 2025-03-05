const myHeaders = new Headers();
myHeaders.append("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
myHeaders.append("accept-language", "en-GB,en-US;q=0.9,en;q=0.8");
myHeaders.append("cache-control", "max-age=0");
myHeaders.append("cookie", "OptanonAlertBoxClosed=2025-02-25T13:39:49.240Z; pl_profile=\"eyJzIjogIld6SXNOemN6TnpneE1qaGQ6MXRtdkJlOk9DYTJpd1VvdURIMFNPTksydWlYSzVXSnBjQzNURGxZeHdxRWpZOEpVc1EiLCAidSI6IHsiaWQiOiA3NzM3ODEyOCwgImZuIjogIkNocmlzICYgQXJjaGVyIiwgImxuIjogIlBlcHBlciIsICJmYyI6IDF9fQ==\"; csrftoken=3Rat5rVpiw4hBpc7X2E4h77tgrYCgs54; sessionid=.eJxVyrsKAjEQheF3SS3LzkySSezsBYXFepnciCiLGLcS391sp-U53_9Ws6yvOq8tP-drUnvFTOwAndr9UpB4y8vmj_uw3cP5eOnQpul06PO_rtJqT12BLGDBWkyRovFllMQj6-SYLANqIK8LAWP2EjAktBS8iaX4bMSozxcuNjFx:1tmvBe:t0bDsX4pBVCa9hax8GYVh_MLyfA3GBersYzChWEt3Qc; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Feb+25+2025+13%3A41%3A26+GMT%2B0000+(Greenwich+Mean+Time)&version=202501.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=d52f49ab-39a4-4490-a48f-a6f12b331298&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0&intType=2&geolocation=GB%3BENG&AwaitingReconsent=false; __eoi=ID=d2415b6b06fc1679:T=1740490887:RT=1740490887:S=AA-AfjZtHuJ5fIZZkSPuUpEUrbBe; datadome=sDQwt_1QZ7Eo7bubJqsbo8RZxdVeVOngK1SyK87pQYETwm0gVcDjaC77Bn4fmcCAOT2CW7WMoXRe0XIfKm4YIhBb1eymMPNwegp3XiGslABI3Jry1OEDdQKwZhkR_Qbr");
myHeaders.append("priority", "u=0, i");
myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"");
myHeaders.append("sec-ch-ua-mobile", "?0");
myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
myHeaders.append("sec-fetch-dest", "document");
myHeaders.append("sec-fetch-mode", "navigate");
myHeaders.append("sec-fetch-site", "none");
myHeaders.append("sec-fetch-user", "?1");
myHeaders.append("upgrade-insecure-requests", "1");
myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36");
myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36");
myHeaders.append("Origin", "https://fantasy.premierleague.com");
myHeaders.append("Referer", "");
myHeaders.append("If-None-Match", "\"O0qEMh7+oA1ckgB5O2uwzyYyhiA=\"");
myHeaders.append("If-Modified-Since", "Tue, 01 Jan 1980 00:00:00 GMT");

export const requestOptions:RequestInit  = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

