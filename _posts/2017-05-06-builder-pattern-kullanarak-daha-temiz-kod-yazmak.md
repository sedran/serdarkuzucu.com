---
layout: post
title:  "Builder Pattern Kullanarak Daha Temiz Kod Yazmak"
date:   2017-05-06 23:18:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /builder-pattern-kullanarak-daha-temiz-kod-yazmak
comments: true
post_identifier: builder-pattern-kullanarak-daha-temiz-kod-yazmak
featured_image: /assets/posts/builder-minion.jpg
---

[builder-pattern-wiki]: https://en.wikipedia.org/wiki/Builder_pattern
[jayways-blog]: http://blog.jayway.com/
[jayways-post]: https://blog.jayway.com/2012/02/07/builder-pattern-with-a-twist/

Yazılım geliştirirken sık sık onlarca parametre alan metodlar geliştirmek zorunda kalmışsınızdır. 
Eğer temiz kod yazma konusunda özen sahibiyseniz bu tarz metodlar yazmak sizi oldukça rahatsız etmiş 
ve zamanla çeşitli alternatif çözüm yolları edinmişsinizdir.

Bu yazıda bu soruna "[Builder Pattern][builder-pattern-wiki]" kullanarak bir çözüm bulmaya çalışacağız. 
Bu yazıyı yazarken *Uzi Landsmann*'ın [blogunda][jayways-blog] yazdığı 
["Builder pattern with a twist"][jayways-post] yazısından esinlendim. 
İngilizce ile aranız iyiyse o yazıyı da okumanızı tavsiye ederim.

<!--more-->

Diyelim ki ücretli servisleriniz olan bir sistemde müşterilere aylık/haftalık abonelikler yaratıyorsunuz 
ve bu abonelikleri aşağıdaki `Subscription` sınıfı ile temsil ediyorsunuz.

```java
package com.asosyalbebe.blog.builderpattern;

import java.util.Date;

public class Subscription {
  private Long id;
  private Long serviceId;
  private Long customerId;
  private Date createDate;
  private Date startDate;
  private Date endDate;
  private Date lastRenewalDate;
  private Date nextRenewalDate;
  private Integer renewalCount;
  private SubscriptionStatus status;

  /* Getters and Setters */

  public enum SubscriptionStatus {
    ACTIVE, INACTIVE, SUSPENDED;
  }
}
```

Abonelikleri yarattınız, sistem tıkır tıkır işliyor. 
Derken pazarlama ekibinden bir arkadaş geldi ve her zamanki gibi "benim rapor almam lazım" diyerek 
aşağıdaki tasarıma uygun bir sayfa yapmanızı, abonelikleri belirtilen kriterlere uygun olarak listelemenizi 
ve sayfa başına 20 abonelik göstermenizi istedi.

![Builder Pattern](/assets/posts/builder-blog-image-1.png)

Pazarlama ekipleri genellikle bundan daha fazlasını isterler 
ama biz de bununla idare edin deriz. 
Hatta şu alana göre rapor almak istiyorum bu alana göre rapor almak istiyorum diye 
tüm alanları ekrana koydururlar ve herşeyi ekranda görünce de 
bu çok karışık biz bunu anlamıyoruz derler. :)

Bu sayfayı beslemek için, bu ekrandaki tüm parametreleri alan bir metoda ihtiyacımız var. 
Parametreler iki üç tane olsaydı aşağıdaki gibi hepsini bir metoda doldurabilirdik.

```java
package com.asosyalbebe.blog.builderpattern;

import java.util.Date;
import java.util.Set;

import com.asosyalbebe.blog.builderpattern.Subscription.SubscriptionStatus;

public interface SubscriptionService {
  SearchResult<Subscription> searchSubscriptions(
      Long id, Long serviceId, Long customerId, Date createDateAfter, Date createDateBefore,
      Date endDateBefore, Date lastRenewalDateAfter, Date lastRenewalDateBefore, Date nextRenewalDateAfter,
      Date nextRenewalDateBefore, Integer renewedMoreThan, Set<SubscriptionStatus> status, 
      int offset, int limit);
}
```

Ama malesef burada tamı tamına 14 tane parametre var. 
Bu methodu çağırana da yazık, ileride metodu refactor edip yeni parametre ekleyecek olana da yazık. 
Özellikle metoda ileride yeni bir parametre ekleneceğinde, 
birisinin bu metodu çağıran tüm sınıfları dolaşıp her yere 
o parametreyi de eklemesi gerekecek ve ofiste ortalık kan gölüne dönecek.

Bu gibi durumlarda çözüm olarak genellikle böyle metodlara 
tüm bu alanları kapsayan bir nesnenin parametre olarak geçilmesi yöntemi kullanılıyor. 
Yani önce aşağıdaki gibi bir sınıf tanımlanıyor:

```java
package com.asosyalbebe.blog.builderpattern;

import java.util.Date;
import java.util.Set;

import com.asosyalbebe.blog.builderpattern.Subscription.SubscriptionStatus;

public class SubscriptionSearchQuery {
    private Long id;
    private Long serviceId;
    private Long customerId;
    private Date createDateAfter;
    private Date createDateBefore;
    private Date endDateBefore;
    private Date lastRenewalDateAfter;
    private Date lastRenewalDateBefore;
    private Date nextRenewalDateAfter;
    private Date nextRenewalDateBefore;
    private Integer renewedMoreThan;
    private Set<SubscriptionStatus> status;
    private int offset;
    private int limit;

    /* Getters and Setters */
}
```

Daha sonra sorguyu yapacak olan metoda parametre olarak bu sınıfın bir nesnesi geçiliyor:

```java
package com.asosyalbebe.blog.builderpattern;

public interface SubscriptionService {
    SearchResult<Subscription> searchSubscriptions(SubscriptionSearchQuery query);
}
```

Gördüğünüz gibi metodun imzası nasıl da rahatladı, nasıl da küçüldü. 
Sıradaki problem, `SubscriptionSearchQuery` sınıfından bir nesne nasıl yaratılacak 
ve üzerindeki bu 14 alan nasıl doldurulacak? 
Aşağıda (bana göre) kötüden iyiye bu tarz durumlarda uygulanan çeşitli yöntemleri sıralamış bulundum.

### 1. Tüm Parametreleri `constructor` ile Almak

Bildiğim en kötü yöntem bu. 
14 parametreli bir `constructor` yazmanın, listeleme yapan metodun 14 parametreye sahip olmasından hiçbir farkı yok. 
Aşağıda gözünüzü tırmalaması için örneğini de utanmadan gösteriyorum.

```java
SubscriptionSearchQuery query = new SubscriptionSearchQuery(123312L, 3178236L, 572734L,
    createDateAfter, createDateBefore, endDateBefore, lastRenewalDateAfter,
    lastRenewalDateBefore, nextRenewalDateAfter, nextRenewalDateBefore, 12,
    Sets.newHashSet(SubscriptionStatus.ACTIVE, SubscriptionStatus.SUSPENDED), 0, 20);

SearchResult<Subscription> subscriptions = subscriptionService
    .searchSubscriptions(query);
```

Yazarken parmaklarım ağladı vallahi.

### 2. Tüm Parametreleri `Setter` ile Doldurmak

Yukarıdakine göre nispeten daha çok kullanılan bir yöntem. 
Nesne türetilirken `constructor` hiç parametre almaz. 
Nesne türetildikten sonra tüm alanlar `setter` metodlar kullanılarak doldurulur. 
Bu yöntemin kötü tarafı basit bir nesneyi oluşturup doldurmak için 15 satır kod yazıyor olmak bence. 
Yazılım geliştirme esnasında böyle bir kod bloğu ile karşılaştığımda genellikle 
durup bu durumu nasıl düzeltebileceğimi düşünürüm. 
Düzeltmek çok efor gerektiriyorsa, kodu ilk yazanın arkasından okkalı bir küfür edip geçerim.

```java
SubscriptionSearchQuery query = new SubscriptionSearchQuery();
query.setId(123312L);
query.setCustomerId(3178236L);
query.setServiceId(572734L);
query.setCreateDateAfter(new Date());
query.setCreateDateBefore(new Date());
query.setEndDateBefore(new Date());
query.setLastRenewalDateAfter(new Date());
query.setLastRenewalDateBefore(new Date());
query.setNextRenewalDateAfter(new Date());
query.setNextRenewalDateBefore(new Date());
query.setRenewedMoreThan(12);
query.setStatus(Sets.newHashSet(SubscriptionStatus.ACTIVE, SubscriptionStatus.SUSPENDED));
query.setOffset(0);
query.setLimit(20);

SearchResult<Subscription> subscriptions = subscriptionService
    .searchSubscriptions(query);
```

### 3. Zorunlu Parametreleri `constructor` ile Almak ve Gerisini `Setter` ile Doldurmak

Diyelim ki kullandığımız veritabanının limitasyonları nedeniyle 
aboneliklerin oluşturma tarihini sorgularda mutlaka kullanmamız gerekiyor. 
Bu durumda sayfa tasarımında da bu alanları zorunlu yaptık, 
sayfayı kullananlar bu alanları doldurmadan abonelik listeleyemiyorlar. 
Bu alanları `SubscriptionSearchQuery` sınıfımızda da zorunlu alan yapabiliriz 
ve bunun için `constructor` kullanabiliriz. 
Ayrıca sayfalama için kullandığımız `offset` ve `limit` parametrelerini de 
zorunlu alan varsayıp `constructor`'a koyabiliriz. 
Geri kalan tüm alanları da zorunlu olmadıkları için `setter` metodlar yardımıyla doldururuz. 
Aşağıdaki gibi bir kod ortaya çıkar. 
Ard arda bu kadar çok `setter` çağrısı görmek, 
birçok kişinin kodu okurken kodun yaptığı esas işe odaklanmasını zorlaştıracaktır.

```java
SubscriptionSearchQuery query = new SubscriptionSearchQuery(0, 20, createDateBegin, createDateEnd);
query.setId(123312L);
query.setCustomerId(3178236L);
query.setServiceId(572734L);
query.setEndDateBefore(new Date());
query.setLastRenewalDateAfter(new Date());
query.setLastRenewalDateBefore(new Date());
query.setNextRenewalDateAfter(new Date());
query.setNextRenewalDateBefore(new Date());
query.setRenewedMoreThan(12);
query.setStatus(Sets.newHashSet(SubscriptionStatus.ACTIVE, SubscriptionStatus.SUSPENDED));

SearchResult<Subscription> subscriptions = subscriptionService
    .searchSubscriptions(query);
```

### 4. `Builder Pattern` Kullanarak Nesneyi Oluşturmak

`Builder Pattern`, builder adında ikinci bir sınıf tanımlayarak esas nesnenin oluşturulma işini bu sınıfa bırakmaktır. 
Builder sınıfları genellikle `Method Chaining` kurgusuna uygun tasarlanmaktadır. 
Yani builder sınıfındaki bir setter method çağırıldığında, bu method üzerinde bulunduğu builder nesnesini döner. 
Böylelikle setter metodları ard arda dizebiliriz. 
Böylece hiçbir zaman builder sınıfının türünde bir değişken tutmak zorunda kalmıyoruz.

Konumuzdan bağımsız olarak, kodun güzel görünecek olmasının yanında, 
builder design pattern kullanmanın önemli avantajlarından bir tanesi de oluşturmaya çalıştığımız objenin 
oluşturma süreci tamamlanıncaya kadar elimizde olmamasıdır. 
Yani Builder sınıfının nesnesi ile işimiz bitinceye kadar alanları henüz tamamlanmamış, 
yarım yamalak bir objeye asla sahip olmuyoruz.

`SubscriptionSearchQuery` sınıfı için bir builder sınıfı nasıl tanımlanmış, 
aşağıdaki kodda hep birlikte inceleyelim.

```java
package com.asosyalbebe.blog.builderpattern;

import com.asosyalbebe.blog.builderpattern.Subscription.SubscriptionStatus;

import java.util.Date;
import java.util.Set;

public class SubscriptionSearchQuery {
    private Long id;
    private Long serviceId;
    private Long customerId;
    private Date createDateAfter;
    private Date createDateBefore;
    private Date endDateBefore;
    private Date lastRenewalDateAfter;
    private Date lastRenewalDateBefore;
    private Date nextRenewalDateAfter;
    private Date nextRenewalDateBefore;
    private Integer renewedMoreThan;
    private Set<SubscriptionStatus> status;
    private int offset;
    private int limit;

    private SubscriptionSearchQuery(Builder builder) {
        this.id = builder.id;
        this.serviceId = builder.serviceId;
        this.customerId = builder.customerId;
        this.createDateAfter = builder.createDateAfter;
        this.createDateBefore = builder.createDateBefore;
        this.endDateBefore = builder.endDateBefore;
        this.lastRenewalDateAfter = builder.lastRenewalDateAfter;
        this.lastRenewalDateBefore = builder.lastRenewalDateBefore;
        this.nextRenewalDateAfter = builder.nextRenewalDateAfter;
        this.nextRenewalDateBefore = builder.nextRenewalDateBefore;
        this.renewedMoreThan = builder.renewedMoreThan;
        this.status = builder.status;
        this.offset = builder.offset;
        this.limit = builder.limit;
    }

    public static Builder builder() {
        return new Builder();
    }

    /* Getters */

    public static class Builder {
        private Long id;
        private Long serviceId;
        private Long customerId;
        private Date createDateAfter;
        private Date createDateBefore;
        private Date endDateBefore;
        private Date lastRenewalDateAfter;
        private Date lastRenewalDateBefore;
        private Date nextRenewalDateAfter;
        private Date nextRenewalDateBefore;
        private Integer renewedMoreThan;
        private Set<SubscriptionStatus> status;
        private int offset;
        private int limit;

        private Builder() {
            // Hide constructor from outside of SubscriptionSearchQuery
        }

        public Builder subscriptionId(Long id) {
            this.id = id;
            return this;
        }

        public Builder serviceId(Long serviceId) {
            this.serviceId = serviceId;
            return this;
        }

        public Builder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public Builder createDateAfter(Date createDateAfter) {
            this.createDateAfter = createDateAfter;
            return this;
        }

        public Builder createDateBefore(Date createDateBefore) {
            this.createDateBefore = createDateBefore;
            return this;
        }

        public Builder endDateBefore(Date endDateBefore) {
            this.endDateBefore = endDateBefore;
            return this;
        }

        public Builder lastRenewalDateAfter(Date lastRenewalDateAfter) {
            this.lastRenewalDateAfter = lastRenewalDateAfter;
            return this;
        }

        public Builder lastRenewalDateBefore(Date lastRenewalDateBefore) {
            this.lastRenewalDateBefore = lastRenewalDateBefore;
            return this;
        }

        public Builder nextRenewalDateAfter(Date nextRenewalDateAfter) {
            this.nextRenewalDateAfter = nextRenewalDateAfter;
            return this;
        }

        public Builder nextRenewalDateBefore(Date nextRenewalDateBefore) {
            this.nextRenewalDateBefore = nextRenewalDateBefore;
            return this;
        }

        public Builder renewedMoreThan(Integer renewedMoreThan) {
            this.renewedMoreThan = renewedMoreThan;
            return this;
        }

        public Builder status(Set<SubscriptionStatus> status) {
            this.status = status;
            return this;
        }

        public Builder offset(int offset) {
            this.offset = offset;
            return this;
        }

        public Builder limit(int limit) {
            this.limit = limit;
            return this;
        }

        public SubscriptionSearchQuery build() {
            return new SubscriptionSearchQuery(this);
        }
    }
}
```

Öncelikle `SubscriptionSearchQuery` sınıfının içerisinde `static` bir `Builder` sınıfı tanımladık 
ve `SubscriptionSearchQuery` sınıfındaki tüm alanları bu sınıfın içerisine de yazdık. 
Tüm alanları kopyalama işlemi sizi rahatsız ettiyse normal. 
İlerleyen kısımlarda bu kısımları da refactor edeceğiz.

`Builder` sınıfında ilk dikkatinizi çekmesi gereken nokta, `private constructor` sahibi olması. 
Yani `SubscriptionSearchQuery` sınıfının dışından `new` anahtar kelimesi ile bu sınıfın nesnesi türetilemez. 
Onun yerine, `SubscriptionSearchQuery` içerisindeki `builder()` `static` metodu ile 
istenilen yerden bir `Builder` nesnesi alabileceğiz.

İkinci önemli nokta ise `Builder` sınıfının tüm setter metodlarının dönüş tipinin `Builder` olması 
ve her metodun `Builder` nesnesi dönmesi. 
Bu da `Builder`'ı kullanarak `SubscriptionSearchQuery` nesnesi üretmeye çalışan kişinin çok işine yarayacak.

Üçüncü önemli nokta, `Builder` sınıfının içindeki `build()` metodu. 
Bu metod artık `Builder` sınıfı ile işimiz bittiğinde 
ve `SubscriptionSearchQuery` nesnesini oluşturmak istediğimizde çağıracağımız metod.

Son önemli nokta da `SubscriptionSearchQuery` sınıfındaki `constructor`'ı `private` yapmış olmamız. 
Böylece `Builder` sınıfının `build()` metodu dışında kimse `SubscriptionSearchQuery` nesnesi türetemeyecek. 
Bu `constructor` kısaca bir `Builder` nesnesini parametre olarak alıyor 
ve üzerindeki tüm alanları kendisine kopyalıyor.

Aşağıdaki kod bu `Builder` sınıfının nasıl kullanıldığını göstermektedir.

```java
SubscriptionSearchQuery query = SubscriptionSearchQuery.builder()
        .subscriptionId(1231231L).serviceId(123123L).customerId(123123L)
        .createDateAfter(new Date()).createDateBefore(new Date())
        .endDateBefore(new Date())
        .lastRenewalDateAfter(new Date()).lastRenewalDateBefore(new Date())
        .nextRenewalDateAfter(new Date()).nextRenewalDateBefore(new Date())
        .renewedMoreThan(12)
        .status(Sets.newHashSet(SubscriptionStatus.ACTIVE, SubscriptionStatus.SUSPENDED))
        .offset(0).limit(20)
        .build();

SearchResult<Subscription> subscriptions = subscriptionService.searchSubscriptions(query);
```

Önce `SubscriptionSearchQuery` sınıfının `static` bir metodu olan 
`builder()` metodunu çağırarak bir `Builder` nesnesi türettik. 
Daha sonra `Builder` nesnesi üzerindeki tüm setter metodları çağırdık 
ve en sonunda da `Builder` sınıfının `build()` metodunu çağırarak verdiğimiz değerler ile 
`SubscriptionSearchQuery` nesnesi oluşmasını sağladık.

### 5. `Builder Pattern` ile Zorunlu Parametrelerin Ayrılması

Yukarıdaki çirkin örneklerden birisinde kurguladığımız zorunlu parametreler senaryosunu düşünelim. 
Örneğin `offset`, `limit`, `createDateAfter` ve `createDateBefore` parametreleri yine zorunlu olsun. 
Yani bu alanlara ait setter metodlar `Builder` nesnesi üzerinde çağırılmak zorunda. 
Bunu basitçe `SubscriptionSearchQuery.builder()` metoduna bu parametreleri yazarak yapabiliriz 
ama böyle yapmak istemiyoruz. 
Setter metodlarımız olsun ama çağırılmadıklarında build metodundan `Exception` fırlatalım? 
Bu da güzel bir karar değil. 
Yazının girişinde referans verdiğim `"Builder pattern with a twist"` yazısı 
tam olarak içine düştüğümüz bu duruma değiniyor.

Önce `SubscriptionSearchQuery` sınıfını nasıl değiştirdiğimizi bir görelim. 
Sonra kodu birlikte inceleyelim.

```java
package com.asosyalbebe.blog.builderpattern;

import com.asosyalbebe.blog.builderpattern.Subscription.SubscriptionStatus;

import java.util.Date;
import java.util.Set;

public class SubscriptionSearchQuery {
    private Long id;
    private Long serviceId;
    private Long customerId;
    private Date createDateAfter;
    private Date createDateBefore;
    private Date endDateBefore;
    private Date lastRenewalDateAfter;
    private Date lastRenewalDateBefore;
    private Date nextRenewalDateAfter;
    private Date nextRenewalDateBefore;
    private Integer renewedMoreThan;
    private Set<SubscriptionStatus> status;
    private int offset;
    private int limit;

    private SubscriptionSearchQuery(Builder builder) {
        this.id = builder.id;
        this.serviceId = builder.serviceId;
        this.customerId = builder.customerId;
        this.createDateAfter = builder.createDateAfter;
        this.createDateBefore = builder.createDateBefore;
        this.endDateBefore = builder.endDateBefore;
        this.lastRenewalDateAfter = builder.lastRenewalDateAfter;
        this.lastRenewalDateBefore = builder.lastRenewalDateBefore;
        this.nextRenewalDateAfter = builder.nextRenewalDateAfter;
        this.nextRenewalDateBefore = builder.nextRenewalDateBefore;
        this.renewedMoreThan = builder.renewedMoreThan;
        this.status = builder.status;
        this.offset = builder.offset;
        this.limit = builder.limit;
    }

    public static Pagination builder() {
        return new Builder();
    }

    /* Getters */

    public static class Builder implements CreateDateInterval, Pagination, OptionalParameters {
        private Long id;
        private Long serviceId;
        private Long customerId;
        private Date createDateAfter;
        private Date createDateBefore;
        private Date endDateBefore;
        private Date lastRenewalDateAfter;
        private Date lastRenewalDateBefore;
        private Date nextRenewalDateAfter;
        private Date nextRenewalDateBefore;
        private Integer renewedMoreThan;
        private Set<SubscriptionStatus> status;
        private int offset;
        private int limit;

        private Builder() {
            // Hide constructor from outside of SubscriptionSearchQuery
        }

        public OptionalParameters subscriptionId(Long id) {
            this.id = id;
            return this;
        }

        public OptionalParameters serviceId(Long serviceId) {
            this.serviceId = serviceId;
            return this;
        }

        public OptionalParameters customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public OptionalParameters endDateBefore(Date endDateBefore) {
            this.endDateBefore = endDateBefore;
            return this;
        }

        public OptionalParameters lastRenewalDateAfter(Date lastRenewalDateAfter) {
            this.lastRenewalDateAfter = lastRenewalDateAfter;
            return this;
        }

        public OptionalParameters lastRenewalDateBefore(Date lastRenewalDateBefore) {
            this.lastRenewalDateBefore = lastRenewalDateBefore;
            return this;
        }

        public OptionalParameters nextRenewalDateAfter(Date nextRenewalDateAfter) {
            this.nextRenewalDateAfter = nextRenewalDateAfter;
            return this;
        }

        public OptionalParameters nextRenewalDateBefore(Date nextRenewalDateBefore) {
            this.nextRenewalDateBefore = nextRenewalDateBefore;
            return this;
        }

        public OptionalParameters renewedMoreThan(Integer renewedMoreThan) {
            this.renewedMoreThan = renewedMoreThan;
            return this;
        }

        public OptionalParameters status(Set<SubscriptionStatus> status) {
            this.status = status;
            return this;
        }

        public CreateDateInterval pagination(int offset, int limit) {
            this.offset = offset;
            this.limit = limit;
            return this;
        }

        public OptionalParameters createDate(Date after, Date before) {
            this.createDateAfter = after;
            this.createDateBefore = before;
            return this;
        }

        public SubscriptionSearchQuery build() {
            return new SubscriptionSearchQuery(this);
        }
    }

    public interface Pagination {
        CreateDateInterval pagination(int offset, int limit);
    }

    public interface CreateDateInterval {
        OptionalParameters createDate(Date after, Date before);
    }

    public interface OptionalParameters {
        OptionalParameters subscriptionId(Long id);

        OptionalParameters serviceId(Long serviceId);

        OptionalParameters customerId(Long customerId);

        OptionalParameters endDateBefore(Date endDateBefore);

        OptionalParameters lastRenewalDateAfter(Date lastRenewalDateAfter);

        OptionalParameters lastRenewalDateBefore(Date lastRenewalDateBefore);

        OptionalParameters nextRenewalDateAfter(Date nextRenewalDateAfter);

        OptionalParameters nextRenewalDateBefore(Date nextRenewalDateBefore);

        OptionalParameters renewedMoreThan(Integer renewedMoreThan);

        OptionalParameters status(Set<SubscriptionStatus> status);

        SubscriptionSearchQuery build();
    }
}
```

Builder sınıfından sonra `Pagination`, `CreateDateInterval` 
ve `OptionalParameters` adında 3 adet `interface` tanımı yaptık. 
Bu `interface`'lerin hepsi `Builder` sınıfı tarafından `implement` ediliyor.

`SubscriptionSearchQuery.builder()` metodunun dönüş tipini `Pagination` yaptık. 
Aslında yine `Builder` sınıfının bir nesnesini dönüyor 
fakat metodu çağıran kişi kendisine `Pagination` nesnesi gelmiş gibi görüyor. 
Bu sayede method chain yaparken elimize gelen ilk nesnenin üzerinde 
sadece `pagination(int offset, int limit)` metodu bulunuyor. 
Mecburen bu metodu çağırıyoruz, böylece `offset` ve `limiti` belirtmiş oluyoruz. 
`pagination(int, int)` metodunun dönüş tipi ise `CreateDateInterval`. 
Yani `offset` ve `limiti` belirttikten sonra bize dönen nesnede 
sadece `createDate(Date after, Date before)` metodu var, 
yani sadece aboneliğin oluşturulma tarih aralığını girebiliyoruz. 
Bu `createDate(Date, Date)` metodunun dönüş tipi ise `OptionalParameters`. 
Bu `interface` üzerindeki tüm metodlar `OptionalParameters` türünde dönüş yapıyor ta ki `build()` metoduna kadar.

Kurduğumuz bu yapı sayesinde `Builder` üzerinde önce `offset` ve `limit`'in, 
sonra da `createDateAfter` ve `createDateBefore` parametrelerinin doldurulmasını sağlamış olduk. 
Zorunlu olmayan parametrelerden ise istenildiği kadarı doldurulabilir.

Bu yapının da kullanımı aşağıdaki gibi:

```java
SubscriptionSearchQuery query = SubscriptionSearchQuery.builder()
        .pagination(0, 20)
        .createDate(new Date(), new Date())
        .subscriptionId(1231231L).serviceId(123123L).customerId(123123L)
        .endDateBefore(new Date())
        .lastRenewalDateAfter(new Date()).lastRenewalDateBefore(new Date())
        .nextRenewalDateAfter(new Date()).nextRenewalDateBefore(new Date())
        .renewedMoreThan(12)
        .status(Sets.newHashSet(SubscriptionStatus.ACTIVE, SubscriptionStatus.SUSPENDED))
        .build();

SearchResult<Subscription> subscriptions = subscriptionService.searchSubscriptions(query);
```

### 6. Refactoring

`SubscriptionSearchQuery` nesnesi oluşturabilmek için güzele yakın bir arayüz tasarlamış olduk. 
Bu blog yazısının amacı temiz kod yazımının özendirilmesi olduğu için, 
yapılabilecek birkaç geliştirmeyi de es geçmek istemedim.

Mesela zorunlu parametreleri alırken `offset` ve `limit` parametrelerinin 
setter metodlarını bire düşürerek güzel bir iş yaptığımızı düşünüyorum. 
`createDate(Date,Date)` metodunda ise abonelik oluşturma tarihi için 
ayrı ayrı girmekte olduğumuz iki parametreyi birleştirdik. 
Bunu tarih aralığı girilen diğer metodlara da uyarlayabiliriz. 
Böylece `Builder` nesnesi üzerinden de fazladan iki metod atabiliriz.

Ek olarak, her ne kadar `SubscriptionSearchQuery` sınıfı `Set<SubscriptionStatus>` nesnesi tutuyor olsa da, 
`Builder` sınıfının setter metodunda biz kullanıcıdan `Set` nesnesi beklemek zorunda değiliz. 
Java'daki `varargs` yapısını kullanarak bu metodu istenildiği kadar 
`SubscriptionStatus` geçilebilir hale getirebiliriz. 
Metodu çağıran kişiyi de `Set` nesnesi oluşturmaya zorlamamış oluruz.

Ayrıca `Builder` sınıfı üzerinde `SubscriptionSearchQuery` sınıfının 
tüm alanlarının kopyasını tuttuğumuzu hatırlarsınız. 
Bazı sınıfların `Builder`'larını tasarlarken bu şekilde yapmak zorunda kalabilirsiniz 
ama `SubscriptionSearchQuery` çok basit bir sınıf olduğu için, burada `Builder` sınıfımızı da basitleştirebiliriz. 
`Builder` sınıfının içinde `SubscriptionSearchQuery` nesnesi oluşturacağız 
ve setter metodlar onun üzerinde işlem yapacaklar. 
`build()` metodu da içerde tutulan `SubscriptionSearchQuery` nesnesini dönecek. 
Bunun en büyük dezavantajı aynı `Builder` nesnesi ikinci defa kullanıldığında 
yeni bir `SubscriptionSearchQuery` türetmek yerine aynı nesne referansını dönmesi, 
yani aynı özelliklerde farklı nesneler üretmeye çalıştığınızda her seferinde yeniden `Builder` tanımlamanız gerekmesi. 
Eğer bu sizin durumunuzda bir dezavantaj olmayacaksa, 
kodun temiz olması açısından bunu şekilde yazmayı tercih edebilirsiniz.

Anlattığım tüm bu işlemler aşağıdaki kodda mevcuttur.

```java
package com.asosyalbebe.blog.builderpattern;

import com.asosyalbebe.blog.builderpattern.Subscription.SubscriptionStatus;
import com.google.common.collect.Sets;

import java.util.Date;
import java.util.Set;

public class SubscriptionSearchQuery {
    private Long id;
    private Long serviceId;
    private Long customerId;
    private Date createDateAfter;
    private Date createDateBefore;
    private Date endDateBefore;
    private Date lastRenewalDateAfter;
    private Date lastRenewalDateBefore;
    private Date nextRenewalDateAfter;
    private Date nextRenewalDateBefore;
    private Integer renewedMoreThan;
    private Set<SubscriptionStatus> status;
    private int offset;
    private int limit;

    private SubscriptionSearchQuery() {
        // Prevent constructing without builder
    }

    public static Pagination builder() {
        return new Builder();
    }

    /* Getters */

    public static class Builder implements CreateDateInterval, Pagination, OptionalParameters {
        private SubscriptionSearchQuery delegate;

        private Builder() {
            // Hide constructor from outside of SubscriptionSearchQuery
        }

        public OptionalParameters subscriptionId(Long id) {
            delegate.id = id;
            return this;
        }

        public OptionalParameters serviceId(Long serviceId) {
            delegate.serviceId = serviceId;
            return this;
        }

        public OptionalParameters customerId(Long customerId) {
            delegate.customerId = customerId;
            return this;
        }

        public OptionalParameters endDateBefore(Date endDateBefore) {
            delegate.endDateBefore = endDateBefore;
            return this;
        }

        public OptionalParameters lastRenewalDate(Date lastRenewalDateAfter, Date lastRenewalDateBefore) {
            delegate.lastRenewalDateAfter = lastRenewalDateAfter;
            delegate.lastRenewalDateBefore = lastRenewalDateBefore;
            return this;
        }

        public OptionalParameters nextRenewalDate(Date nextRenewalDateAfter, Date nextRenewalDateBefore) {
            delegate.nextRenewalDateAfter = nextRenewalDateAfter;
            delegate.nextRenewalDateBefore = nextRenewalDateBefore;
            return this;
        }

        public OptionalParameters renewedMoreThan(Integer renewedMoreThan) {
            delegate.renewedMoreThan = renewedMoreThan;
            return this;
        }

        public OptionalParameters status(SubscriptionStatus... statuses) {
            delegate.status = Sets.newHashSet(statuses);
            return this;
        }

        public CreateDateInterval pagination(int offset, int limit) {
            delegate.offset = offset;
            delegate.limit = limit;
            return this;
        }

        public OptionalParameters createDate(Date after, Date before) {
            delegate.createDateAfter = after;
            delegate.createDateBefore = before;
            return this;
        }

        public SubscriptionSearchQuery build() {
            return this.delegate;
        }
    }

    public interface Pagination {
        CreateDateInterval pagination(int offset, int limit);
    }

    public interface CreateDateInterval {
        OptionalParameters createDate(Date after, Date before);
    }

    public interface OptionalParameters {
        OptionalParameters subscriptionId(Long id);

        OptionalParameters serviceId(Long serviceId);

        OptionalParameters customerId(Long customerId);

        OptionalParameters endDateBefore(Date endDateBefore);

        OptionalParameters lastRenewalDate(Date lastRenewalDateAfter, Date lastRenewalDateBefore);

        OptionalParameters nextRenewalDate(Date nextRenewalDateAfter, Date nextRenewalDateBefore);

        OptionalParameters renewedMoreThan(Integer renewedMoreThan);

        OptionalParameters status(SubscriptionStatus... status);

        SubscriptionSearchQuery build();
    }
}
```

Refactor edilmiş `SubscriptionSearchQuery` sınıfının nesnesi de aşağıdaki gibi oluşturuluyor:

```java
SubscriptionSearchQuery query = SubscriptionSearchQuery.builder()
        .pagination(0, 20)
        .createDate(new Date(), new Date())
        .subscriptionId(1231231L).serviceId(123123L).customerId(123123L)
        .endDateBefore(new Date())
        .lastRenewalDate(new Date(), new Date())
        .nextRenewalDate(new Date(), new Date())
        .renewedMoreThan(12)
        .status(SubscriptionStatus.ACTIVE, SubscriptionStatus.SUSPENDED)
        .build();

SearchResult<Subscription> subscriptions = subscriptionService.searchSubscriptions(query);
```

### Kapanış

2015 yılının Temmuz ayından beri bloga yazmadığımı farkettim ve sebebi düşününce belli. 
Nişan ve evlilik sürecindeyim o vakitten beridir kendimi anca toparlayabildim. 
Eskiden sene atladığım hiç olmamıştı fakat 2016 yılında hiçbir şey yazmayarak bir ilki başarmışım :)

Bu yazıda birçok kod gördük birçok elementi tanıdık. 
Hatamız olduysa affola. 
Kelime/terim hatalarım varsa her zaman yorum yaparak beni düzeltebilirsiniz, lütfen düzeltin.

İş hayatına başladığım 2012 yılından bu zamana geçirdiğim değişimlerden birisi de 
artık temiz kod yazmaya çalışma takıntım var. 
Bu sebeple artık benden bu tarz blog yazıları da görebilirsiniz ama bunun da sözünü veremiyorum, 
yine 1 senelik bir ara vermek durumunda kalırsam, 1 sene sonraya kim öle kim kala :)

Bir sonraki yazıma kadar kodlarınızı temiz yazın gözünüzü seveyim.

