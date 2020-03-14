---
layout: post
title:  "Slf4j: MDC Kullanarak Log Takibini Kolaylaştırma"
date:   2019-02-14 01:49:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /slf4j-mdc-kullanarak-log-takibini-kolaylastirma
---

Bu yazıda birden fazla sınıfın log yazdığı bir log dosyasında spesifik bir HTTP isteğine ait logları nasıl buluruz sorusuna kolay uygulanabilir bir cevap paylaşacağım. <!--more-->

Problemi doğuran şey sistemdeki aynı methodlara aynı anda birden fazla istek geldiğinde logların birbirine karışması ve hangi logun hangi isteğe ait olduğunun anlaşılamaması.

Çözüm; sisteme gelen her HTTP isteği için unique bir string oluşturacağız ve bu değerin bu istek boyunca tüm loglarda görünmesini sağlayacağız. Bunu amele gibi elimizle her log statement'a eklemek yerine SLF4J'nin MDC (Mapped Diagnostic Context) yöntemini kullanacağız.

> Dilerseniz bu yazıdaki örnek uygulamaya aşağıdaki github adresimden ulaşabilirsiniz:
>
> [Github: Slf4j MDC Kullanarak Log Takibini Kolaylaştırma][post-github-link]

[post-github-link]: https://github.com/sedran/mdc-log-track-id-demo

## Demo Uygulamanın Oluşturulması

Öncelikle bu yazı için ufak bir Spring Boot demo uygulaması geliştirdim.
Intellij Idea'da projeyi yaratırken Gradle seçmeyi unuttuğum için Maven projesi olarak yaratıldı. 
O sebeple <code>pom.xml</code> dosyasını paylaşıyorum: 

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.2.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.serdarkuzucu</groupId>
    <artifactId>mdc-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>mdc-demo</name>
    <description>MDC Demo Project</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### MdcDemoApplication.java

Spring Boot uygulamasını ayağa kaldıran main methodu içeren sınıf.

```java
package com.serdarkuzucu.mdcdemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MdcDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(MdcDemoApplication.class, args);
    }
}
```

### RandomNumberService.java

Random sayı üreten ve bir miktar log üreten bir sınıf.

```java
package com.serdarkuzucu.mdcdemo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Random;

/**
 * @author Serdar Kuzucu
 */
@Service
public class RandomNumberService {
    private static final Logger LOG = LoggerFactory.getLogger(RandomNumberService.class);

    public Number generateRandomNumber() {
        final int randomNumber = new Random().nextInt();
        LOG.info("generated random number is {}", randomNumber);
        return randomNumber;
    }
}
```

### RandomNumberController.java

<code>/random-number</code> URL'ine gelen istekleri cevaplayacak olan controller. Bir miktar log üretecek, <code>RandomNumberService</code> sınıfına çağrı yapacak. Bu sayede istek attığımızda iki farklı sınıfın log yazmasını göreceğiz.

```java
package com.serdarkuzucu.mdcdemo.controller;

import com.serdarkuzucu.mdcdemo.service.RandomNumberService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Serdar Kuzucu
 */
@RestController
public class RandomNumberController {
    private static final Logger LOG = LoggerFactory.getLogger(RandomNumberController.class);

    private final RandomNumberService randomNumberService;

    @Autowired
    public RandomNumberController(RandomNumberService randomNumberService) {
        this.randomNumberService = randomNumberService;
    }

    @GetMapping("random-number")
    public Map<String, Number> getRandomNumber() {
        LOG.info("RandomNumberController.getRandomNumber invoked");

        final Number randomNumber = randomNumberService.generateRandomNumber();
        LOG.info("randomNumber={}", randomNumber);

        final Map<String, Number> responseBody = new HashMap<>();
        responseBody.put("value", randomNumber);

        LOG.info("RandomNumberController.getRandomNumber result={}", responseBody);
        return responseBody;
    }
}
```

### application.properties

Bu dosyada <code>logging.pattern.console</code> property'sini ezerek 
Spring Boot'un varsayılan log pattern'ını değiştiriyoruz. 
Demo için gerek olmayabilir fakat bence böyle loglar daha güzel görünüyor.

```properties
logging.pattern.console=%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){faint} |\
  %clr(%5p) | \
  %clr(%logger{0}){cyan} \
  %clr(:){faint} \
  %m%n
```

Uygulamayı çalıştırıp tarayıcımızda <code>http://localhost:8080/random-number</code> 
URL'ini açarsak, loglarda şunların çıktığını göreceğiz:

```text
2019-02-13 01:17:36.582 | INFO | RandomNumberController : RandomNumberController.getRandomNumber invoked
2019-02-13 01:17:36.582 | INFO | RandomNumberService : generated random number is 773800082
2019-02-13 01:17:36.583 | INFO | RandomNumberController : randomNumber=773800082
2019-02-13 01:17:36.583 | INFO | RandomNumberController : RandomNumberController.getRandomNumber result={value=773800082}
```

Aynı anda bu satırlardan yüzlerce karışık sırada log dosyasında olduğunu düşünelim. 
Birbirinden ayırt etmekte zorlanırdık.

## MDC Yönteminin Uygulanması

Öncelikle bu işe bir isim verelim. 
Biz ürettiğimiz bu unique string'e şirkette <b>log takip kodu</b> diyoruz. 
Kodun içerisinde <code>logTrackId</code> olarak kullanacağım. 
Şimdi <code>logTrackId</code> üreten <code>LogTrackIdGenerator</code> arayüzünü ve 
<code>UUIDLogTrackIdGenerator</code> sınıfını yazalım:

### LogTrackIdGenerator.java

"Program to interfaces, not implementations" paradigmasına bağlı kalarak 
<code>logTrackId</code> üreten bir interface tasarlıyoruz:

```java
package com.serdarkuzucu.mdcdemo.util;

/**
 * @author Serdar Kuzucu
 */
public interface LogTrackIdGenerator {
    String generate();
}
```

### UUIDLogTrackIdGenerator.java

<code>LogTrackIdGenerator</code> interface'i için UUID üretip içindeki tire (-) 
karakterini silen bir implementasyon yazıyoruz.

```java
package com.serdarkuzucu.mdcdemo.util;

import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Generates a random UUID without hyphens
 *
 * @author Serdar Kuzucu
 */
@Component
public class UUIDLogTrackIdGenerator implements LogTrackIdGenerator {
    @Override
    public String generate() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}
```

### LogTrackIdGeneratingFilter.java

Bir adet <code>javax.servlet.Filter</code> implementasyonu yazıyoruz 
ve üzerine <code>@Component</code> annotation'ını ekliyoruz. 
Bu şekilde annotate ettiğimiz sınıflar Spring Boot tarafından 
otomatik olarak taranıp bean olarak ayağa kaldırılır. 
Üstüne üstlük Filter türünde olduğu için Spring Boot bu bean'i 
tüm HTTP isteklerinin önüne filtre olarak yerleştirir. 
Yani sunucuya gelen tüm istekler <code>doFilter</code> methodundan geçer.

```java
package com.serdarkuzucu.mdcdemo.filter;

import com.serdarkuzucu.mdcdemo.util.LogTrackIdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import java.io.IOException;

/**
 * @author Serdar Kuzucu
 */
@Component
public class LogTrackIdGeneratingFilter implements Filter {
    private static final Logger LOG = LoggerFactory.getLogger(LogTrackIdGeneratingFilter.class);
    private static final String LOG_TRACK_ID_MDC_KEY = "logTrackId";

    private final LogTrackIdGenerator logTrackIdGenerator;

    @Autowired
    public LogTrackIdGeneratingFilter(LogTrackIdGenerator logTrackIdGenerator) {
        this.logTrackIdGenerator = logTrackIdGenerator;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        final String logTrackId = logTrackIdGenerator.generate();
        MDC.put(LOG_TRACK_ID_MDC_KEY, logTrackId);

        LOG.debug("Log track id {} generated", logTrackId);

        try {
            filterChain.doFilter(servletRequest, servletResponse);
        } finally {
            MDC.remove(LOG_TRACK_ID_MDC_KEY);
        }
    }
}
```

<code>doFilter</code> methodunun içerisinde <code>LogTrackIdGenerator</code> aracılığıyla 
ürettiğimiz log takip kodunu <code>org.slf4j.MDC</code> sınıfının statik bir methodu olan
<code>put</code> methoduna verdik. 
MDC, <code>ThreadLocal</code> üzerinde duran bir Map gibi çalışır. 
Yani bu veri yapısına bir bilgi girerken bir key kullanırız. 
Log takip kodu için <code>logTrackId</code> keyini kullandım. 
Daha sonra <code>application.properties</code> dosyasında log pattern'ine bu keyi gireceğiz.

<code>filterChain.doFilter</code> çağırarak HTTP isteğini bizden sonra çalışacak olan 
filtreler varsa onlara veya doğrudan isteği karşılayacak olan Servlet'e gönderiyoruz. 
Bu esnada geliştirdiğimiz <code>RandomNumberController</code> da tetiklenmiş oluyor. 
Daha sonra ThreadLocal içerisine attığımız MDC değeri Thread'in üzerinde kalmasın diye 
<code>MDC.remove(key)</code> çağırıyoruz.

### application.properties

<code>logTrackId</code> keyi ile MDC üzerine yerleştirdiğimiz veriyi 
log pattern'ine eklemek için, 
<b>application.properties</b> dosyasında herhangi bir yere 
<code>%X{logTrackId:-none}</code> ekliyoruz. 
<code>:-none</code> kısmı isteğe bağlı olarak eklenmeyebilir de. 
MDC'nin içinde log takip kodu olmadığı zamanlarda loga "none" yazmasını sağlıyor. 
Benim <b>application.properties</b> dosyam aşağıdaki gibi:

```properties
logging.pattern.console=%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){faint} |\
  %clr(%5p) | \
  %clr(%X{logTrackId:-none}) | \
  %clr(%logger{0}){cyan} \
  %clr(:){faint} \
  %m%n
```

Uygulamayı çalıştırıp tarayıcımızda <code>http://localhost:8080/random-number</code> 
URL’ini açarsak, loglarda şunların çıktığını göreceğiz:

```text
2019-02-13 01:37:55.357 | INFO | 95e3e1b5dea0427197e7ef78cf42e416 | RandomNumberController : RandomNumberController.getRandomNumber invoked
2019-02-13 01:37:55.357 | INFO | 95e3e1b5dea0427197e7ef78cf42e416 | RandomNumberService : generated random number is -916135574
2019-02-13 01:37:55.357 | INFO | 95e3e1b5dea0427197e7ef78cf42e416 | RandomNumberController : randomNumber=-916135574
2019-02-13 01:37:55.357 | INFO | 95e3e1b5dea0427197e7ef78cf42e416 | RandomNumberController : RandomNumberController.getRandomNumber result={value=-916135574}
```

Gördüğünüz gibi <code>logTrackId=95e3e1b5dea0427197e7ef78cf42e416</code> değeri üretildi 
ve bu işleme ait tüm log satırlarında yazdığı görüldü.

MDC ile ilgili anlatmak istediklerim bunlar. 
Sorularınız olursa aşağıdaki yorum formunu dilediğiniz gibi doldurabilirsiniz. 
Sizin de MDC ile ilgili farklı kullanım senaryolarınız varsa duymak isterim.
