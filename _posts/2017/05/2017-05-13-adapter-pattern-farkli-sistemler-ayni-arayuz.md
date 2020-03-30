---
layout: post
title:  "Adapter Pattern: Farklı Sistemler, Aynı Arayüz"
date:   2017-05-13 04:03:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /adapter-pattern-farkli-sistemler-ayni-arayuz/
comments: true
post_identifier: adapter-pattern-farkli-sistemler-ayni-arayuz
featured_image: /assets/posts/blog-uml-300x174.png
---

Bir sistem geliştirirsiniz ve bu sistemin işlevini görebilmesi için başka sistemlere entegre olması gerekir. 
Bazen o kadar eski teknolojiler ile geliştirilmiş sistemlere entegre olmak zorundasınızdır ki, 
bu amaç için yazdığınız kod geliştirmekte olduğunuz projeye hiç yakışmaz, 
sürekli gözünüzü tırmalar. 
Özetle, elinizde başka bir sisteme ait bir interface vardır 
ve bu interface'in yapısı sizin projenizin yapısına uygun değildir.

<!--more-->

Aşağıdaki görsel durumu gerçek hayatta karşılaştığımız temel bir problemle özetlemektedir. 
Amerika'dan bir laptop aldınız ve Avrupa'da bir ülkeye gittiniz. 
Elinizde sağdaki nesne, duvarda ise soldaki interface var. 
Bu durumda bilgisayarınızı şarj edebilmek için ortadaki adaptöre ihtiyaç duyarsınız. 
Adapter pattern'ın ismi de aslında gerçek hayattaki adaptörlerden geliyor.

![/assets/posts/blog-realworld-adapters-300x138.jpg](/assets/posts/blog-realworld-adapters-300x138.jpg){:width="400px"}

### Kullanım Amaçları

* Birbirine uyumlu olmayan iki farklı interface'in birlikte çalışmasının sağlanması.
* Varolan bir interface'in yeni bir interface'e çevirilmesi.
* Eski bir interface'in yeni bir sisteme entegre edilmesi.
* Benzer işlevli farklı sistemlerin aynı interface ile kullanılabilmesi.

Kodlarını inceleyeceğimiz örneğe gelmeden önce birkaç gerçek hayat örneği vereyim.

Mobil cihazlara bildirim göndermek istediğinizde, 
Android cihazlar için Google Cloud Messaging (veya artık Firebase) kullanırken, 
iOS cihazlar için Apple Push Notification Service (apns) kullanmanız gerekmektedir. 
Microsoft cihazlar için de vardı bir servis birkaç sene önce kullanmıştım, şimdi hatırlayamadım. 
Bu durumda `PushNotificationAdapter` gibi bir interface tasarlayıp, 
bu interface'den `FirebasePushNotificationAdapter`, `ApplePushNotificationAdapter` 
ve `MicrosoftPushNotificationAdapter` gibi 3 farklı sınıf oluşturabilirsiniz. 
Hatta sadece test ortamınızda veya kendi bilgisayarınızda çalışacak `DummyPushNotificationAdapter` 
gibi bir sınıf tasarlayıp sistemin göndermeye çalıştığı bildirimleri 
bambaşka bir yere (log dosyası, veritabanı, vb.) gönderebilirsiniz.

Ücretlendirme yapmak için `PaymentAdapter` interface'ini tanımlayıp, 
farklı ödeme yöntemleri için `PaypalPaymentAdapter`, `VisaPaymentAdapter`, `MasterCardPaymentAdapter` 
veya `MobilePaymentAdapter` gibi sınıflar oluşturabilirsiniz.

### Sosyal Medya'da Paylaşım Yapmak

Bu yazıda aynı içeriği farklı sosyal medya platformlarında 
paylaşmak için adapter pattern kullanarak bir çözüm geliştireceğiz.

**Talep:** Sistemimizin Facebook, Twitter ve Google Plus adındaki 
üç farklı sosyal medya platformunda paylaşım yapabilmesi istenmektedir. 
Paylaşılacak olan içerikler her zaman bir adet metin ve bir adet URL içerecek.

**Sorun:** 3 tane birbirinden farklı sosyal medya platformumuz var. 
Hepsi farklı şirketler tarafından geliştirilmekte, 
hepsinin interface'leri farklı. 
Twitter'ın meşhur bir REST API'ı var 
ve bu API için geliştirilmiş Java kütüphaneleri de açık kaynak kodlu olarak mevcut. 
Facebook bu işler için bize REST tabanlı Graph API sunuyor. 
Google Plus biraz daha ileri gitmiş ve kendileri Java kütüphanesi paylaşmışlar.

Bu sistemlerin hepsi REST de olsa, hepsi Java kütüphanesi de paylaşsa, sorun devam edecekti.

Her sistem için yazacağımız kodlar tamamen birbirinden farklı olmak zorunda 
ve tüm bu kodları yazacak **güzel bir yere ihtiyacımız var**. 
Kodları yazacak güzel bir yer aramaya başlamadan önce, birkaç interface ve enumeration yazalım.

Öncelikle sosyal medya platformlarını belirlemek için `Platform` adında bir `enum` tanımlayalım.


##### Platform

```java
package com.asosyalbebe.blog.adapterpattern;

public enum Platform {
    FACEBOOK, TWITTER, GOOGLE_PLUS;
}
```

Paylaşılacak olan içeriği ve hangi platformda(yada hepsinde) paylaşılacağını gönderdiğimiz 
`SocialMediaShareClient` interface'ini oluşturalım. 
Bu interface'i kullanan kişi, esas işi bunun yaptığını düşünecek.


##### SocialMediaShareClient

```java
package com.asosyalbebe.blog.adapterpattern;

public interface SocialMediaShareClient {
    /**
     * Shares the given text and link on a specified social media platform
     *
     * @param platform social media platform on which the text and link will be shared
     * @param text     text to share on the specified social media platform
     * @param link     link to share on the specified social media platform
     */
    void share(Platform platform, String text, String link);

    /**
     * Shares the given text and link on all social media platform defined in this client
     *
     * @param text text to share on all social media platforms
     * @param link link to share on all social media platforms
     */
    void share(String text, String link);
}
```

En amatör zamanlarımda `interface` bile tanımlamazdım :)
Az amatör zamanlarımda ise bu interface'in implementasyonunda tüm sosyal medya platformları için `if/else` 
veya `switch/case` kullanır, tüm kodu oraya kitle olarak yazardım :)

Böyle bir çirkinlik yapmamamız için birileri çıkmış ve **adapter pattern**'ı icat etmiş.

Çok özendim, önce bir UML diagram çizdim. Hemen şöyle orta yere bırakayım onu:

![Adapter Pattern UML](/assets/posts/blog-uml-adapter-pattern.png)

Diagramı yorumlayalım. Herkes UML bilmek zorunda değil. 
Ben de bildiğimi iddia edemiyorum zaten. 
Mezun olduğumdan beri UML diagram çizmemiştim. 
Hatalı çizgiler falan koyduysam, okların yönü falan ters olduysa kusura bakmayın.

Öncelikle yukarıda kodunu paylaştığım `SocialMediaShareClient` arayüzünden 
`DefaultSocialMediaShareClient` adında bir implementasyon sınıfı yazacağız. 
Arayüzünde iki method olan bu sınıfın görevi verilen belli bir platformda 
veya tüm platformlarda ilgili içeriğin paylaşılması olacak. 
Hangi platformda nasıl paylaşılacağı ile ilgili detayları ise 
`SocialMediaShareAdapter` arayüzünün implementasyonları içeriyor olacak.

Bu sebeple aşağıdaki `SocialMediaShareAdapter` arayüzünü geliştiriyor olacağız:


##### SocialMediaShareAdapter

```java
package com.asosyalbebe.blog.adapterpattern;

public interface SocialMediaShareAdapter {
    /**
     * Share a text and link on the social media platform
     *
     * @param text text to share on the social media platform
     * @param link link to share on the social media platform
     * @return unique identifier of the post returned by the social media platform
     */
    String share(String text, String link);
}
```

Bu arayüz üzerinde bulunan `String share(String text, String link)` methodu, 
ilgili sosyal medyada verilen text ve linkin paylaşılmasını sağlayacak 
ve paylaşılan gönderinin unique id'sini dönecek. 
Her sosyal medya platformu bizden farklı formatta data bekliyor 
ve cevap olarak da farklı formatta data dönüyor. 
Data türleri arasındaki tüm çeviri işlemleri 
`SocialMediaShareAdapter` arayüzünün implementasyonları içerisine gömülecek 
ve böylece adaptörleri kullanan sınıfların (`DefaultSocialMediaShareClient`) 
bu işlemlerden haberi olmayacak.

Bir sonraki aşamada Facebook, Twitter ve Google Plus için üç ayrı adaptörü aşağıdaki gibi tanımlıyoruz.

##### FacebookShareAdapter

```java
package com.asosyalbebe.blog.adapterpattern;

public class FacebookShareAdapter implements SocialMediaShareAdapter {
    @Override
    public String share(String text, String link) {
        // Facebook specific code...
        System.out.printf("Sharing %s %s on facebook\n", text, link);

        // Post item to facebook and get post_id from response
        return "example_post_id";
    }
}
```


##### TwitterShareAdapter

```java
package com.asosyalbebe.blog.adapterpattern;

public class TwitterShareAdapter implements SocialMediaShareAdapter {
    @Override
    public String share(String text, String link) {
        // Twitter specific code here...
        System.out.printf("Sharing %s %s on twitter\n", text, link);

        // Post item to Twitter and get tweet id
        return "example_tweet_id";
    }
}
```


##### GooglePlusShareAdapter

```java
package com.asosyalbebe.blog.adapterpattern;

public class GooglePlusShareAdapter implements SocialMediaShareAdapter {
    @Override
    public String share(String text, String link) {
        // Google Plus related code here...
        System.out.printf("Sharing %s %s on Google+\n", text, link);

        // Post item to Google+ and get post id
        return "example_post_id_g+";
    }
}
```

Bu yazdığım 3 sınıfın içerisine tüm sosyal medya platformu spesifik detayları gizliyoruz. 
**Abstraction**'ın dibine vuruyoruz. 
Daha abstract olsun diye adaptörlerin içine gerçek kodları yazmadım, siz yazdığımı varsayın :)

Son olarak `DefaultSocialMediaShareClient` sınıfını yazıyoruz. 
Bu sınıf hangi platform için hangi adaptörü kullanması gerektiğini bilen sınıf oluyor.


##### DefaultSocialMediaShareClient

```java
package com.asosyalbebe.blog.adapterpattern;

import java.util.HashMap;
import java.util.Map;

public class DefaultSocialMediaShareClient implements SocialMediaShareClient {
    private Map<Platform, SocialMediaShareAdapter> adapters;

    public DefaultSocialMediaShareClient() {
        adapters = new HashMap<>();
        adapters.put(Platform.FACEBOOK, new FacebookShareAdapter());
        adapters.put(Platform.TWITTER, new TwitterShareAdapter());
        adapters.put(Platform.GOOGLE_PLUS, new GooglePlusShareAdapter());
    }

    @Override
    public void share(Platform platform, String text, String link) {
        SocialMediaShareAdapter adapter = adapters.get(platform);
        String postIdentifier = adapter.share(text, link);
        storePost(platform, text, link, postIdentifier);
    }

    @Override
    public void share(String text, String link) {
        adapters.forEach((platform, adapter) -> share(platform, text, link));
    }

    private void storePost(Platform platform, String text, String link, String identifier) {
        System.out.printf("storePost::platform=%s::text=%s::link=%s::identifier=%s\n", platform, text, link, identifier);
    }
}
```

Bu şekilde sistemimizin mimari tasarımını tamamlamış oluyoruz. 
Yukarıdaki kodda gördüğünüz `storePost` methodunun işlevinin 
paylaşılan içerikler ile ilgili kayıtların veritabanına yazılması olduğunu varsayabilirsiniz. 
Böylece hangi sosyal medya platformuna giderse gitsin 
bir içeriği düzgün şekilde paylaşabilen 
ve platformdan cevap olarak dönen ID'yi veritabanında saklayabilen 
bir yapıyı gayet temiz bir şekilde kurmuş olduk. 
Bu arayüzü kullanan bir main method ile yazımızı taçlandıralım:


##### AdapterTutorialMain

```java
package com.asosyalbebe.blog.adapterpattern;

public class AdapterTutorialMain {
    public static void main(String[] args) {
        SocialMediaShareClient socialMediaShareClient = new DefaultSocialMediaShareClient();

        // Share on all social media platforms
        String text = "Have you read my latest blog post about builder pattern?";
        String link = "http://blog.asosyalbebe.com/2017/05/builder-pattern-temiz-kod-yazmak.html";
        socialMediaShareClient.share(text, link);

        // Only share on Facebook
        text = "Last night, we had lots of fun!";
        link = "https://www.youtube.com/watch?v=Sv6dMFF_yts";
        socialMediaShareClient.share(Platform.FACEBOOK, text, link);

        // Only share on Twitter
        text = "My current mode #happy #happiness";
        link = "https://www.youtube.com/watch?v=Sv6dMFF_yts";
        socialMediaShareClient.share(Platform.TWITTER, text, link);

        // Only share on Google Plus
        text = "My current mode #happy #happiness";
        link = "https://www.youtube.com/watch?v=Sv6dMFF_yts";
        socialMediaShareClient.share(Platform.GOOGLE_PLUS, text, link);
    }
}
```

### Kapanış

Bu yazıda Design Pattern'larından Adapter Pattern'a değinmeye çalıştım dilim döndüğünce. 
Yapısı sistemimizin yapısından oldukça farklı olan 
başka bir sistemle entegre olmanın getirdiği iğrenç detayları 
bu sayede çeşitli adaptörlerin içine gizleyebiliyoruz. 
Hoşumuza gitmeyen bir arayüzü hoşumuza giden 
ve projemiz için daha uygun bir arayüze çevirebiliyoruz.

Aynı zamanda nesne tabanlı programlamanın en önemli bileşenlerinden olan **Polymorphism**, 
**Inheritance** ve **Abstraction** gibi baba konseptleri de çok güzel uygulamış oluyor, 
kodumuzu bizden sonra okuyanlardan tam puan alıyoruz.

Bir önceki yazımda temiz ve kaliteli yazılım geliştirme konusundaki takıntılarımı dile getirmiştim. 
Bu gibi hassasiyetlerimiz olmasa biz yazılımcılar için mesleğimiz 
internetten çalışan bir kodu kopyalayıp projenin orta yerine yapıştırmaktan ibaret oluyor çoğu zaman. 
Çeşitli Design Pattern'ları öğrenmek ve bunları doğru yerlerde uygulamayı amaç edinmek de 
kaliteli kod yazma sürecinin olmazsa olmazlarından.

Hatasız kul olmaz. 
Benim de bu yazıda yaptığım hatalar olmuştur elbet. 
Eğer görürsen, lütfen yorum yap sayın okuyucum. 
Bu vesileyle yazımı şu güzel cümle ile kapatayım:

> Yazılım ustalığı (Software Craftsmanship) ulaşılacak bir varış noktası değil, 
> insanın sürekli kendisini geliştirdiği bir yolculuktur.
