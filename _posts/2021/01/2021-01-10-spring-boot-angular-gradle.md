---
layout: post
title:  "Gradle: Spring Boot & Angular Uygulamalarını Birlikte Build Edelim"
date:   2021-01-10 17:04:26 +0300
categories: [Java, Programlama, Spring Boot, Angular, Gradle]
author: Serdar Kuzucu
permalink: /2021/01/10/gradle-spring-boot-angular-birlikte-build-etmek/
comments: true
post_identifier: gradle-spring-boot-angular-birlikte-build-etmek
featured_image: /assets/posts/2021-01-10-spring-boot-angular-gradle/00-post-logo.png
---

Yeni bir projeye başlamanın en sıkıcı maddelerinden birisi de projeyi oluşturup 
her projede kullandığımız basmakalıp (boilerplate) kodları yazmaktır.
Build aracını (maven, gradle, vs) seçmek, bağımlılıkları build aracına eklemek,
kullanılan frameworklerin (spring, angular, vs) konfigürasyonlarının yapılması gibi
her projede tekrar tekrar yaptığımız işler vardır 
ve bir kişi o işi yapıp projeyi repository'ye atmazsa 
ekibin geri kalanı projede yazılım geliştirmeye başlayamaz.
Genellikle bu işlem varolan bir projeyi kopyalayıp içinde yeni projeye lazım olmayan
ne var ne yok silmek şeklinde yapılsa da 
bazen yeni bir proje yapısını gerektiren durumlar oluşabilir.
2018 yılında backend için Spring Boot ve frontend için Angular framework'lerini
kullanmaya karar verdiğimizde ekip için bu yeni bir proje yapısıydı 
ve biraz araştırıp bu iki arkadaşı bir arada kullanmanın proje için 
en uygun yolunu bulmam gerekmişti. 
O günden beri ekip olarak birçok projede kullandığımız bu proje yapısını 
sıfırdan bir proje oluşturarak anlatmaya çalışacağım.

<!--more-->

<div class="alert alert-info">
Tüm yazıyı okumak istemeyen arkadaşlar doğrudan şu linke tıklayarak 
bu yazıyı yazarken geliştirdiğim örnek uygulamayı Github hesabımda inceleyebilirsiniz:
<a href="https://github.com/sedran/spring-boot-angular-gradle-example">sedran/spring-boot-angular-gradle-example</a> 
</div>

Aşağıda adım adım projeyi sıfırdan nasıl oluşturduğumu anlatıyor olacağım.
Ben bu projeyi oluştururken IDE olarak Intellij IDEA kullanıyorum.
Başka bir IDE kullanarak denemek istiyorsanız anlatacaklarımın o IDE'deki
karşılıklarını bilmeniz veya bir şekilde bulmanız gerekecektir.

Ek olarak projeyi build edebilmek ve bazı adımları tamamlayabilmek için
bilgisayarınızda "npm" ve "ng" (Angular CLI) araçlarının da yüklü olması gerekmektedir.

## Adım 1: Gradle Projesi Oluşturalım

Öncelikle Intellij IDEA menüsünden `File > New > Project` 
yolunu takip ederek yeni proje oluşturma diyaloğunu açıyoruz 
ve bu diyalogda sol tarafta "Gradle" seçeneğini işaretliyoruz.
Sağ tarafta ise hiçbir seçeneği işaretlemeden Next butonuna basıyoruz.

<a href="/assets/posts/2021-01-10-spring-boot-angular-gradle/01-new-gradle-project.png" target="_blank">
  <img border="0" height="600" src="/assets/posts/2021-01-10-spring-boot-angular-gradle/01-new-gradle-project.png" />
</a>

Sonraki adımda proje ile ilgili bazı temel bilgiler soruluyor. 
Bunları keyfimize göre doldurup proje oluşturmayı tamamlıyoruz.

<a href="/assets/posts/2021-01-10-spring-boot-angular-gradle/02-new-gradle-project.png" target="_blank">
  <img border="0" height="600" src="/assets/posts/2021-01-10-spring-boot-angular-gradle/02-new-gradle-project.png" />
</a>



## Adım 2: Angular Uygulaması Oluşturalım

Bu adımda frontend tarafı olan angular uygulamasını yaratacağız.
Bir terminal açıp projenin olduğu dizine gidelim 
ve Angular CLI aracılığıyla frontend isimli projemizi oluşturalım.

```bash
cd ~/path-to-project
ng new frontend
```

Komutu çalıştırdığımızda Angular CLI bir takım sorular soracak.
Bu soruları tercihimize göre cevaplıyoruz.
Uygulama oluşturma tamamlandığında frontend isimli bir klasör
ve içerisinde boş bir Angular hello world uygulamasının oluştuğunu göreceğiz.

Ana projemizi zaten versiyon kontrol sisteminde tutacağımız için frontend klasöründe
otomatik olarak oluşturulan git repository'sine ihtiyacımız yok.
`frontend/.git` klasörünü hiç düşünmeden silebiliriz.

```bash
cd frontend
rm -rf .git
```

Terminalde frontend klasörünün içerisinde `ng serve` komutunu yazdığımızda
projenin "Angular Live Development Server" üzerinde ayağa kalktığını ve
[http://localhost:4200/](http://localhost:4200/) adresinden otomatik olarak üretilmiş
Welcome sayfasına ulaşabildiğimizi görüyoruz. 

Angular projeleri npm paket yöneticisini kullanır ve Angular CLI denen
nodejs ile çalışan bir araç tarafından build edilirler.
Biz "frontend" projesini de gradle ile build etmek istediğimiz için
frontend klasörünün içerisinde aşağıdaki gibi bir `build.gradle` dosyası oluşturuyoruz.

```gradle
def frontendProjectDir = "${rootProject.projectDir}/frontend"

// Bu dosyalar değişmediği sürece gradle up-to-date check sayesinde 
// ng build komutu tetiklenmeyecek. Ön yüz tarafında değişiklik olmadığı
// build'lerde build süresini oldukça kısaltacaktır.
def angularFiles = project.fileTree(dir: frontendProjectDir, includes: [
  "src/**/*.ts",
  "src/**/*.html",
  "src/**/*.json",
  "src/**/*.css",
  "src/**/*.scss",
  "package.json",
  "package-lock.json",
  "angular.json",
  "tsconfig.json",
  "src/assets/**",
  "node_modules/**"
])

task buildAngular(type: Exec) {
  inputs.files(angularFiles)
  outputs.dir("${frontendProjectDir}/dist")

  // installAngular should be run prior to this task
  dependsOn "npmInstall"
  workingDir "${frontendProjectDir}"
  // Add task to the standard build group
  group = BasePlugin.BUILD_GROUP
  // ng doesn't exist as a file in windows -> ng.cmd
  if (System.getProperty("os.name").toUpperCase(Locale.ROOT).contains("WINDOWS")) {
    commandLine "npm.cmd", "run", "buildProd"
  } else {
    commandLine "npm", "run", "buildProd"
  }
}

task npmInstall(type: Exec) {
  inputs.files("${frontendProjectDir}/package.json")
  outputs.dir("${frontendProjectDir}/node_modules")

  workingDir "${frontendProjectDir}"
  group = BasePlugin.BUILD_GROUP
  if (System.getProperty("os.name").toUpperCase(Locale.ROOT).contains("WINDOWS")) {
    commandLine "npm.cmd", "install"
  } else {
    commandLine "npm", "install"
  }
}

task build {
  dependsOn "buildAngular"
}
```

"frontend" klasöründeki `package.json` dosyasında `scripts` anahtarının içerisine
aşağıdaki gibi `buildProd` komutunu ekliyoruz. 
Dosyayı aşağıdaki gibi değiştirmeyin komple, sadece bir kısmını yazdım.

```json
{
  "name": "frontend",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "buildProd": "ng build --prod",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  }
}
```

"package.json" dosyasına eklediğimiz `ng build --prod` komutu build.gradle
dosyasındaki `buildAngular` gradle taskı tarafından tetikleniyor.
Asıl build işini sistemimize daha önceden kurduğumuz "Angular CLI" aracı yapıyor.
Gradle burada sadece bir tetikleyici durumunda fakat backend projesi gradle
tarafından build edileceği için ikisini birbirine bağlamamızda 
bu konfigürasyonun oldukça faydası olacak.

"frontend" projesinin bir gradle projesi olarak ana proje tarafından görülmesi için
ana proje klasöründeki `settings.gradle` dosyasını da şu şekilde düzenliyoruz:

```gradle
rootProject.name = 'springangulardemo'
include ':frontend'
```

En sonunda ana proje dizininde `./gradlew build` komutunu çalıştırdığımızda 
aşağıdaki gibi bir çıktı verince angular projemizin gradle ile build olduğunu
görmüş oluyoruz.

```text
> Task :frontend:npmInstall
audited 1460 packages in 5.331s

67 packages are looking for funding
  run `npm fund` for details

found 2 low severity vulnerabilities
  run `npm audit fix` to fix them, or `npm audit` for details

> Task :frontend:buildAngular

> frontend@0.0.0 buildProd /Users/serdarkuzucu/projects/personal/blog/springangulardemo/frontend
> ng build --prod

Generating ES5 bundles for differential loading...
ES5 bundle generation complete.

chunk {0} runtime-es2015.0dae8cbc97194c7caed4.js (runtime) 1.45 kB [entry] [rendered]
chunk {0} runtime-es5.0dae8cbc97194c7caed4.js (runtime) 1.45 kB [entry] [rendered]
chunk {2} polyfills-es2015.f332a089ad1600448873.js (polyfills) 36.1 kB [initial] [rendered]
chunk {3} polyfills-es5.177e85a9724683782539.js (polyfills-es5) 129 kB [initial] [rendered]
chunk {1} main-es2015.05e26c45cc5c75825871.js (main) 217 kB [initial] [rendered]
chunk {1} main-es5.05e26c45cc5c75825871.js (main) 259 kB [initial] [rendered]
chunk {4} styles.09e2c710755c8867a460.css (styles) 0 bytes [initial] [rendered]
Date: 2021-01-10T17:21:55.929Z - Hash: 1d60d39f7d1df34a5244 - Time: 32218ms

BUILD SUCCESSFUL in 47s
2 actionable tasks: 2 executed
```

Angular kısmı bu kadar. 
Sonraki adıma geçebiliriz.

## Adım 3: Spring Boot Uygulaması Oluşturalım

Yeni bir Spring Boot uygulaması oluştururken yaptığım şey genellikle çoğu insan gibi
https://start.spring.io/ adresine girip ihtiyacım olan bağımlılıkları seçip 
projeyi zip olarak indirmek. 
Bu sefer onun yerine ihtiyacım olan bağımlılıkları seçip sadece `build.gradle`
dosyasını kopyalayacağım.

Spring Boot projesini aşağıdaki gibi starter arayüzünden konfigüre ettim:

<a href="/assets/posts/2021-01-10-spring-boot-angular-gradle/03-start-spring-io.png" target="_blank">
  <img border="0" height="500" src="/assets/posts/2021-01-10-spring-boot-angular-gradle/03-start-spring-io.png" />
</a> 

Daha sonra sayfanın altında bulunan "EXPLORE" butonuna basarak 
`build.gradle` dosyasının içeriğini kopyalıyoruz.

Ana projenin içerisinde "frontend" klasörüne komşu olacak şekilde 
"backend" isminde bir klasör oluşturuyoruz.
"backend" klasörünün içerisinde `build.gradle` isimli bir dosya oluşturuyoruz
ve Spring Boot starter sitesinden kopyaladığımız "build.gradle" dosya içeriğini
bu yeni dosyanın içerisine yapıştırıyoruz.

Daha sonra bu dosyanın sonuna aşağıdaki satırları da ekliyoruz:

```gradle
bootJar {
    dependsOn ':frontend:buildAngular'

    into('BOOT-INF/classes') {
        from "${project(':frontend').projectDir}/dist"
    }
}
```

"dependsOn" ile backend projesi build edilmeden önce 
frontend projesinin build edilmiş olması gerektiğini gradle'a bildirmiş oluyoruz.
Böylece frontend projesinin backend projesinden önce build edileceğini
garanti altına almış oluyoruz.

Angular projesi build olduğunda ortaya "dist" isimli bir klasör çıkar.
Bu klasör Angular projesindeki tüm dosyaların build + uglify edilmiş halini içerir.

"build.gradle" dosyasına `into(` ile başlayan satırda yaptığımız ilave 
ile "dist" klasörünü Spring Boot uygulamasının ürettiği jar'ın içerisine
JVM'in classpath'inde olacak şekilde eklemiş oluyoruz.
"BOOT-INF/classes" klasörü spring uygulamasının classpath'inin root dizinidir.

Ayrıca Spring Boot starter sitesinde yine otomatik olarak üretilmiş olan 
main sınıfı da projede uygun klasör yapısını oluşturup projeye eklemeyi ihmal etmeyelim.

```bash
# Proje ana dizininde çalıştıralım:
mkdir -p backend/src/main/java/com/serdarkuzucu/springangulardemo
```

Yukarıda oluşturduğumuz klasöre SpringAngularDemoApplication.java isminde
aşağıdaki içerikte bir dosya oluşturalım.

```java
package com.serdarkuzucu.springangulardemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringAngularDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringAngularDemoApplication.class, args);
    }
}
```

Son olarak ana projedeki `settings.gradle` dosyasına aşağıdaki gibi
backend projesini de eklememiz gerekiyor:

```gradle
rootProject.name = 'springangulardemo'

include ':frontend'
include ':backend'
```

Bu noktadan sonra `./gradlew build` komutunu çalıştırdığımızda
hata almamamız gerekiyor.

Spring uygulamasını ayağa kaldırmak için de `./gradlew bootRun` 
komutunu çalıştırıyoruz. 
Bu komutta da bir hata almamamız gerekiyor.

İleriki adımlarda test amaçlı kullanılmak üzere projeye 
bir adet örnek REST API ekliyoruz:

```java
package com.serdarkuzucu.springangulardemo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("api/users")
public class UserController {
    @GetMapping("me")
    public HashMap<String, Object> getCurrentUser() {
        final var user = new HashMap<String, Object>();
        user.put("firstName", "Serdar");
        user.put("lastName", "Kuzucu");
        return user;
    }
}
```

## Adım 4: Spring Boot'un Statik Dosya Sunumu Ayarları

Angular uygulamasını Spring Boot'un ayağa kalktığı port üzerinde 
sunmaya başlayabilmek için bazı konfigürasyonları yapmak gerekiyor.

Öncelikle frontend klasörünü bir önceki adımda classpath'e kopyalamıştık.
Angular projesinin "dist" klasörünün içerisinde "frontend" isminde bir klasör
oluşmakta ve biz de o klasörü Spring Boot uygulamasının classpath'ine eklemiş olduk.
Bu sebeple Spring'e ResourceHandler olarak `classpath:/frontend/`
dizinini aşağıdaki gibi ekliyoruz.

```java
package com.serdarkuzucu.springangulardemo.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("classpath:/frontend/");
    }
}
```

Bu şekilde index.html, main.js, styles.css gibi istekler Spring'e ulaştığında
classpath'deki frontend klasörünün içerisinde o dosyaları araması gerektiğini
söylemiş olmaktayız.

Yukarıdaki ResourceHandler [http://localhost:8080/index.html](http://localhost:8080/index.html) 
şeklinde gelen istekleri yakalayıp frontend/index.html dosyasını sunabiliyor fakat 
[http://localhost:8080/](http://localhost:8080/)
şeklinde gelen isteklerde "404 Not Found" hatası dönüyor.

Uygulamamızın root adresini de index.html dosyasına bağlayabilmek için
aşağıdaki gibi bir `IndexController` sınıfı yazmamız yeterli.


```java
package com.serdarkuzucu.springangulardemo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    @GetMapping("/")
    public String getIndex() {
        return "forward:index.html";
    }
}
```

## Adım 5: Angular Proxy Ayarları

Bir geliştirici kendi bilgisayarında projeyi geliştirme amaçlı çalıştığında
Spring Boot jar'ının içerisine gömülmüş Angular projesini çalıştırmamalı.
Geliştiriciler Spring Boot uygulamasını IDE'lerindeki Run Configuration ile main
sınıftan çalıştırmalı veya `./gradlew bootRun` komutuyla ayağa kaldırmalılar.
Angular uygulamasını ise frontend klasöründe `ng serve` komutunu çalıştırarak
`Angular Live Development Server` üzerinde ayağa kaldırmalılar.

Bu durumda frontend 4200, backend ise 8080 portlarında ayağa kalkmış oluyor.
Bu da bazı tarayıcılarda ön yüzden backend uygulamasına atılan isteklerin
CORS politikası sebebiyle bloklanmasına sebep oluyor.

Bu problemi de ortadan kaldırmak için sadece geliştirici (DEV) ortamında çalışan
Angular proxy ayarlarını yapmamız gerekiyor.
Öncelikle ana projemizin altındaki "frontend" klasörünün içerisine 
"proxy.conf.json" isminde bir dosya oluşturuyoruz, dosyanın içeriği şu şekilde:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "logLevel": "debug",
    "secure": false
  }
}
```

Bu konfigürasyon adresi Angular Live Development Server uygulamasına
`http://localhost:4200/api` şeklinde gelecek olan tüm istekleri 
`http://localhost:8080` uygulamasına gönderecek.

Proxy ayarını "frontend" klasöründeki "angular.json" 
dosyasında da şu şekilde yapıyoruz:

```json
{
  ...
  "projects": {
    "frontend": {
      ...
      "architect": {
        ...
        "serve": {
          ...
          "options": {
            ...
            "proxyConfig": "proxy.conf.json"
          },
```

Düzenli bir API standardınızın olması ve proxy ayarlarının temiz kalması için
backend tarafındaki tüm REST API'lere burda yaptığımız gibi `api/**` ön eki ile
veya kendi belirleyeceğiniz başka tek bir ön ek ile başlamanızı tavsiye ederim.
Spring Security konfigürasyonları, custom servlet filtreleri gibi başka işlerde de
oldukça işe yaradığını göreceksiniz ileride.

## Uçtan Uca Testler

Yaptığımız bunca konfigürasyonun çalışıp çalışmadığını uçtan uca test etmek 
için aşağıdaki değişiklikleri yapıyoruz:

`app.module.ts` dosyasında `HttpClientModule` modülünü import edelim:

```ts
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // <-- Bu satır
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

`app.module.ts` dosyası ile aynı dizinde bir adet `user.service.ts` dosyası oluşturalım.
Bu dosyanın içeriği aşağıdaki gibi olsun.
Backend'de açtığımız `api/users/me` REST API'sini çağırsın.

```ts
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get<User>('api/users/me');
  }
}

export interface User {
  firstName: string;
  lastName: string;
}
```

`app.component.ts` dosyasını aşağıdaki şekilde değiştirelim.
`UserService` üzerinden backend'den kullanıcı bilgilerini çeksin.

```ts
import {Component, OnInit} from '@angular/core';
import {User, UserService} from "./user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  user: User = null;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getCurrentUser()
      .subscribe(user => this.user = user);
  }
}
```

`app.component.html` dosyasında da `<span>Welcome</span>` yazan satırı 
aşağıdaki gibi değiştirelim:

```html
<span>Welcome <span *ngIf="user">{{user.firstName}} {{user.lastName}}</span></span>
```

### Geliştirici Ortamı Testleri

Spring Boot ve Angular uygulamalarının ikisini de yeniden başlattıktan sonra 
[http://localhost:4200](http://localhost:4200) adresini açtığımızda önceden
sadece Welcome yazan yerde artık "Welcome Serdar Kuzucu" yazdığını 
(backend tarafından dönen firstName ve lastName değerleri) görüyoruz.

<a href="/assets/posts/2021-01-10-spring-boot-angular-gradle/04-angular-frontend-home.png" target="_blank">
  <img border="0" height="400" src="/assets/posts/2021-01-10-spring-boot-angular-gradle/04-angular-frontend-home.png" />
</a>

Bu şekilde geliştiricilerin frontend ve backend uygulamalarını kendi bilgisayarlarında
ayrı ayrı çalıştırarak iki farklı framework'ün geliştirici ortamı nimetlerinden
faydalanabileceklerini görmüş oluyoruz.


### Production Ortamı Testleri

Production build almak için ana projenin dizininde `./gradlew build` 
komutunu çalıştırmamız yeterli.

Gradle dosyalarındaki versiyonlarda bir değişiklik yapmadıysanız build işlemi
sonrasında proje içerisinde şu isimde bir dosya üreyecektir:
`backend/build/libs/backend-0.0.1-SNAPSHOT.jar`

Bu dosya Spring Boot uygulamasının son çıktısıdır.
Bu dosyanın içerisinde compile olmuş java sınıflarının yanı sıra
Angular projesinin de production build çıktısı yer almaktadır.

Bu dosyayı doğrudan `java -jar` ile aşağıdaki gibi çalıştırabiliriz:

```bash
java -jar backend/build/libs/backend-0.0.1-SNAPSHOT.jar
```

Bu şekilde uygulamayı ayağa kaldırdığımızda
[http://localhost:8080](http://localhost:8080) adresinden
uygulamayı açabiliriz. 

"Geliştirici Ortamı Testleri" başlığında elde ettiğimiz görüntü 
ile aynı görüntüyü elde ediyorsak başarmışız demektir.


## Kaynak Kod

Bu yazıyı yazarken geliştirdiğim örnek uygulamayı Github hesabımdan
siz de inceleyebilirsiniz: 
[sedran/spring-boot-angular-gradle-example](https://github.com/sedran/spring-boot-angular-gradle-example)


## Sonuç

Son 3 yıl içerisinde bu proje yapısını ekipçe 10'dan fazla projede kullandık.
Build sonrasında üretilen jar dosyasını JVM imajından türetilmiş bir docker imajı 
içerisine koyarak uygulamamızı çok rahat dockerize edebiliyoruz.
Bu sayede bu yapı kubernetes/openshift gibi ortamlarda da sıkıntısız çalışıyor.

Birbiri ile sürekli iletişim halinde olan frontend 
ve backend uygulamalarının kaynak kodlarının bu şekilde 
bir arada olması bazı uygulamalar ve ekipler için oldukça faydalı. 
Özellikle bir işin frontend tarafı ile backend tarafını 
aynı geliştiricinin geliştirdiği projelerde/ekiplerde 
bu yöntemin daha iyi olduğunu düşünüyorum.

Bu yöntemle ilgili söyleyebileceğim tek bir negatif düşüncem var,
o da projenin ön yüz kısmı büyüdükçe build sürelerinin aşırı uzaması.

Ona da ekipçe bir çözüm bulduğumuzda blogumda paylaşıyor olurum.
İnşallah bir gün bulabiliriz.
