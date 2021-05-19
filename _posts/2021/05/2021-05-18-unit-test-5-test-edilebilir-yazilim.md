---
layout: post
title: "Unit Test 05: Test Edilebilir Yazılım Nasıl Geliştirilir?"
date: 2021-05-18 23:15:00 +0300
categories: [Java, Programlama, Unit Test]
author: Serdar Kuzucu
permalink: /2021/05/18/unit-test-edilebilir-yazilim-nasil-gelistirilir/
comments: true
post_identifier: unit-test-edilebilir-yazilim-nasil-gelistirilir
featured_image: /assets/category/unit-test.png
series: "Unit Test"
references:
  - url: "https://www.toptal.com/qa/how-to-write-testable-code-and-why-it-matters"
    title: "Unit Tests, How to Write Testable Code and Why it Matters"
    author: "Sergey Kolodiy"

  - url: "https://dashdevs.com/blog/writing-testable-code-main-rules/"
    title: "Core Rules And Principles Of Writing Testable Code"
    author: "Igor Tomych"
---

"Unit Test" yazı dizisinin bir önceki yazısında
kaliteli unit test nasıl yazılır konusunu incelemiştik.
Bu yazıda da test edilebilir yazılımlar nasıl tasarlanır sorusuna cevap arayacağız.

<!--more-->

Unit test yazmaya başlayıncaya kadar oldukça kaliteli kod yazdığımı zannederdim.
Artık yazamadığımı biliyorum.

Bir koda unit test yazamama durumu kodun yeteri kadar kaliteli olmadığını adeta bağıran bir durumdur.
Aşağıda yazılımı unit test yazılması zor veya imkansız hale getirebilecek
birkaç faktöre ve olası çözümlerine değineceğiz.


### Sınıfların / Fonksiyonların Fazla Sorumluluk Yerine Getirmesi

Legacy projelerde bazen yüzden fazla satırdan oluşan metodlar içeren sınıflara test yazmak zorunda kaldığım oluyor.
Test metodu çoğunlukla test edilen metoddan da uzun oluyor.
Böyle sınıflara test yazmak hem çok uzun sürüyor hem de çok fazla veri oluşturmak,
çok fazla bağımlılığı mock olarak tanımlamak,
onlarca farklı koşula belki yüzlerce test yazmak gerekiyor.

Bu tür sınıflar genellikle çok da fazla değişim geçirdiklerinden,
her bir değişiklikte bir anda yüzlerce testin hata vermeye başlaması ve test bakım maliyeti çıkıyor.

Sınıflarımızı [SOLID](https://en.wikipedia.org/wiki/SOLID)
prensiplerini göz önünde bulundurarak tasarlamamız gerekiyor.
Özellikle de **SOLID**'in **S**'sine, yani "Single-responsibility" prensibine dikkat etmemiz gerekiyor:

> Bir sınıfın sadece bir sorumluluğu olmalı, bir sınıfın değişmek için sadece bir sebebi olmalı.

Bunu başarabilmek için de sınıflarımızı tasarlarken tüm kodu bir dosyaya yazmak yerine
tekrar kullanılabilir parçalar halinde tasarlamamız gerekiyor.
Böylece testlerde bazı parçaları test edip bazı parçaları sahte/mock implementasyonlar ile izole edebiliriz.

Tekrar kullanılabilir yazılım bileşenleri üretebilmenin en şık yolu da
genellikle doğru tasarım şablonlarını
([Design Patterns](https://en.wikipedia.org/wiki/Software_design_pattern#Classification_and_list){:target="_blank"})
bulup kullanmaktan geçiyor.
Yazılımcıların tasarım şablonlarına hakim olması kaliteli yazılım geliştirmede önemli bir basamak.


### Gereğinden Fazla Statik Kod Kullanımı

Statik kod zehirlidir. Birazı kafa yapar, fazlası projeyi öldürür.
Pek kıymetli [Akın Kaldıroğlu](https://www.linkedin.com/in/akinkaldiroglu/){:target="_blank"}
hocamın da söylediği gibi
"[Statik kullanımı bulaşıcıdır](http://www.javaturk.org/statik-metotlu-sinif-mi-yoksa-singleton-mi-ii/){:target="_blank"}".

Bu statik kodların gereksiz yerlerde kullanılmaya başlanması
veya dozunun ayarlanamaması projede
[IoC (Inversion of Control)](https://en.wikipedia.org/wiki/Inversion_of_control){:target="_blank"}
prensibi kullanımını minimuma düşürür.

Bir API isteğini aldıktan sonra servis katmanı, iş mantığı, cache yapısı ve DAO (veritabanı) katmanının
tamamen statik metodlar üzerinden yapıldığı bir projeye denk geldim yakın zamanda.
Bu tip bir projede unit test yazmaya kalkarsanız kanser olabilirsiniz.
Neredeyse hiçbir katman bir diğerini tamamen çalıştırmadan test edilemiyor.

Statik metod kullanımını yukarıda bahsettiğim gibi projede
asıl işin yapıldığı sınıflarda tavsiye etmiyorum, kullanmamalıyız.
Utility fonksiyon dediğimiz apache commons kütüphanelerindeki
`StringUtils`, `NumberUtils`, `CollectionUtils`, vb. sınıfların statik metodlarını kullanabiliriz
veya bunlara benzer metodları kendimiz projelerde statik olarak yazabiliriz.
Bu tip fonksiyonlara *pure* (saf) fonksiyon deniyor.
Yani herhangi bir çevresel faktöre bağlı olmayan, aynı girdilerle her zaman aynı çıktıyı veren fonksiyonlar.

Ortama bağımlı, kararsız, sağı solu belli olmayan,
sistemde global state değişikliği yapan, yan etkileri olan
statik metodlardan uzak durmalıyız.

<div class="alert alert-secondary pb-0" role="alert" markdown="1">
**Not:** Statik metodların da mocklanabilmesi için Java'da "Power Mock" isimli bir kütüphane mevcut.
Fakat bir gün statik bir metodu mocklama ihtiyacı hissedersek projeye "Power Mock" eklemeden önce
kodu iyileştirerek bu ihtiyacı ortadan kaldırmaya çalışmalıyız.
</div>

### Bağımlı Olunan Nesnelerin Sınıf İçinde Oluşturulması

Kodda her `new` anahtar kelimesi gördüğümüzde <u>ufak</u> bir şüphe duymalıyız.

Her sınıflar arası etkileşimi sahte/mock implementasyon olarak izole etmemeliyiz
fakat aşağıda birkaç örnek verebileceğim bazı bağımlılıklar sahte/mock şekilde izole edilmelidir.

Öncelikle "unit test" kavramını herkes farklı tanımladığı için burada çok büyük anlaşmazlıklar ortaya çıkıyor.
Benim görüşümde sadece bir sınıfın/metodun davranışını diğer sınıflardan izole bir şekilde test edebilmek unit testtir.
Eğer kompleks sınıflar arası etkileşimleri/entegrasyonları test ediyorsam buna entegrasyon testi derim.
Bu kapsamda unit test yazarken aşağıdaki durumlardaki sınıfları mock olarak kullanmayı tercih ederim:

* Kompleks business logic içeren veya kendisi de başka sınıflara bağımlı olan sınıflar
* Veritabanı, disk, network, API, vb. ortama ve başka sistemlere bağımlı olan sınıflar
* Birbirinden farklı mantıksal katmanlardaki sınıflar (Misal Controller -> Servis veya Servis -> DAO etkileşimi)
* Global state üzerinde değişiklik yapan sınıflar
* Kararsız, tutarsız veya saf olmayan fonksiyonlar içeren sınıflar

Bunların dışında basit DTO, JPA Entity, String, Calendar, Date, vb. sınıflarda
mümkün olduğunca gerçek sınıfları kullanmaya çalışırım.

Gereğinden fazla mock kullanımı testleri hem kırılgan hem okuması zor bir hale getirebilir.
Burada dengeyi iyi kurmamız gerekiyor.
Test yazdıkça bu dengenin yazılımcıda içgüdüsel olarak geliştiğini düşünüyorum.

Bu bağlamda düşündüğümüzde eğer sahte/mock olarak kullanmak istediğimiz bir sınıf varsa
ve bu sınıfı test edeceğimiz kod `new` anahtar kelimesi ile kendi içerisinde oluşturuyorsa,
bu bağımlılıkları sahteleri ile değiştirmek oldukça zorlaşır.
Daha önce statik metodlarda kullanıldığından bahsettiğim "Power Mock" kütüphanesi gibi bir kütüphane ile
bu sınıfların constructor'larını mock'lamak gibi saçma işlere girişmemiz gerekir.

Bunun önüne geçebilmek için de testlerde sahtesi ile değiştirilmesi gereken bağımlılıkları
`constructor` ile test edilecek olan sınıfa parametre olarak almamız gerekiyor.
Eğer OOP yerine fonksiyonel programlama yapıyorsanız da
test edilen fonksiyona bu bağımlılıklar parametre olarak geçilebilir.

Örneğin yukarıdaki başlıklarda verdiğim `FrequentlyAskedQuestionServiceImpl` ve `PersonServiceImpl`
sınıflarının ikisinde de dışarıdan alınan bağımlılıklar constructor parametresi olarak geçilmiş durumda.
`PersonServiceImpl` sınıfının metod içerisinde oluşturduğu `Person` nesnesi ise
sahtesi ile değiştirmeye gerek duymadığım basit bir DTO/JPA Entity sınıfı,
ya da data sınıfı diyebiliriz bu tür sınıflara.

Eğer `PersonServiceImpl` veritabanına erişimde kullandığı `PersonRepository` arayüzünün
bir implementasyonunu aşağıdaki koddaki gibi constructor içerisinde kendisi oluştursaydı,
sahtesi ile değiştirmek için test kodunda taklalar atmamız gerekirdi.

```java
public class PersonServiceImpl implements PersonService {
    private final PersonRepository personRepository;

    public PersonServiceImpl() {
        final var mongoClient = MongoClients.create();
        this.personRepository = new PersonRepositoryImpl(mongoClient);
    }

    @Override
    public Person createPerson(CreatePersonRequest createPersonRequest) {
        final var firstName = Objects.requireNonNull(createPersonRequest.getFirstName(), "firstName cannot be null");
        final var lastName = Objects.requireNonNull(createPersonRequest.getLastName(), "lastName cannot be null");
        final var phone = Objects.requireNonNull(createPersonRequest.getPhone(), "phone cannot be null");
        final var person = new Person(firstName, lastName, phone);
        return personRepository.savePerson(person);
    }
}
```

Test yazılamamasının yanında kaliteli kod yazım standartlarına da ters düşen bir yanı var,
`PersonServiceImpl` sınıfı concrete bir `PersonRepository` implementasyonuna ihtiyaç duyuyor.
Interface'ler üzerinden etkileşim kurma özelliğini kaybediyoruz.

Ayrıca `PersonServiceImpl` sınıfının `PersonRepositoryImpl` sınıfının nasıl
oluşturulacağı bilgisine de gereksiz yere sahip olmuş oluyor.

Bu kodun mock olmadan yazılan testinin çalışması için gerçekten bir mongodb veritabanını ayağa kaldırmamız gerekiyor.
Bu da yazacağımız testi unit değil entegrasyon testi yapar.


### Saf Olmayan Methodların Kullanılması

Eğer saf olmayan veya kararsız da diyebileceğimiz metodlar test etmeye çalıştığımız kod tarafından kullanılıyorsa
testlerimiz zaman ve ortam bağımlı hale gelebilir.
Bu tür testler de çoğu zaman çalışırken ara sıra sebebini anlamak için vakit kaybedeceğimiz hatalar verebilirler.

Bu konuda Java'da kullanmayı en sevmediğim metodlar arasında şu tarih/zaman fonksiyonları başı çekiyor:

* `new Date()`
* `Calendar.getInstance()`
* `System.currentTimeMillis()`

Bu tip sistemin o anki zamanını dönen metodları kullanan kodların testlerinde yazacağımız assertion'lar,
genellikle testin hızlı çalışmasına bağlı olarak başarılı bitebilse de,
testlerin çalışması sırasındaki birkaç milisaniyelik gecikme ile patlayabilirler.

Örneğin aşağıdaki 1000 iterasyonluk RepeatedTest metodu 1000 iterasyonun 33 defasında hata verdi:

```java
public Date getCurrentDate() {
    System.out.println("getCurrentDate called");
    final var date = new Date();
    System.out.println("getCurrentDate result=" + date);
    return date;
}

@RepeatedTest(1000)
void getCurrentDate_returnsCurrentDate() {
    final var actual = getCurrentDate();
    final var expected = new Date();
    assertEquals(expected, actual);
}
```

Verdiği hatalardan bir tanesi de şu şekilde:

    expected: java.util.Date@96901dd<Tue May 18 00:53:54 EET 2021> but was: java.util.Date@1cccaa86<Tue May 18 00:53:54 EET 2021>

Görüldüğü gibi expected ve actual Date nesneleri logda saniyesine kadar aynı görünüyor,
o bir iki milisaniyelik farkı hata mesajından anlayamıyoruz bile.

Bu gibi durumlar için sistem zamanını bize dönen bir sınıf oluşturuyor
ve bu sınıfı testlerde sahte bağımlılık olarak kullanıyoruz.
Biz önceden bu iş için kendi `Clock` sınıfımızı yazarken Java 8 sonrası `java.time.Clock` sınıfını kullanmaya başladık.

Şimdi aşağıdaki gibi constructor argümanı olarak `Clock` alan bir sınıf yazalım:

```java
public class DateRangeValidator {
    private final Clock clock;

    public DateRangeValidator(Clock clock) {
        this.clock = clock;
    }

    public void validateDateRange(Date startDate, Date endDate) {
        final var now = new Date(clock.millis());

        if (startDate.after(now)) {
            throw new IllegalArgumentException("startDate cannot be after current date");
        }

        if (endDate.before(now)) {
            throw new IllegalArgumentException("endDate cannot be before current date");
        }
    }
}
```

Bu sınıf için yazdığımız testlerde tarihler arası farkları aşağıdaki gibi birer milisaniye bile yapsak
1000 iterasyondan hiçbirinde hata vermemekte.
Hem test ettiğimiz kod, hem de yazdığımız test ortam bağımsız şekilde aynı girdilerde hep aynı sonucu üretmekte.

```java
@RepeatedTest(1000)
void validateDateRange_systemDateIsBetweenStartAndEndDates_doesNotThrowException() {
    final var startDate = 1621289298097L;
    final var now = startDate + 1;
    final var endDate = now + 1;
    final var clock = Clock.fixed(Instant.ofEpochMilli(now), ZoneId.systemDefault());
    final var validator = new DateRangeValidator(clock);

    validator.validateDateRange(new Date(startDate), new Date(endDate));
}
```


### Global Değişiklik Yapan Yöntemlerin Tercih Edilmesi

Bu da gereksiz statik metod kullanımına benzer bir kötü pratiktir
fakat bu kötü pratiğin sonuçları test edilemez bir kod yazmış olmaktan ziyade şöyle ortaya çıkıyor:
Yazılan testler rastgele bir şekilde bazen başarılı olup bazen hata veriyor.

Örneğin kodda global bir değişken (static) tanımladık ve bir metod bu değişkenin değerini değiştiriyor.
Bu değeri değiştirirken de varolan değer üzerinden bir hesaplama yapıyor.
Bu metodun 10-12 tane testini yazdık.
Her test bu global değişkende farklı bir durum değişikliğine neden olursa bir süre sonra işin ucu kaçar.
Testlerin de hangi sırayla çalışacağının garantisi olmadığından,
hangi test çalıştığında global değişken hangi değeri tutuyor gibi bilgileri kontrol etmek oldukça zorlaşır.

Global statik mutable değişken kullanmaktan ve bu değişkenler üzerinde değişiklik yapan metodlar yazmaktan
mümkün olduğunca uzak durmalıyız.

Bu tip global state üzerinden iş yapan kodlar testleri ayrı thread'ler ile paralel koşmanın da önüne engel koyuyor.
Aynı anda iki thread global state'e değişiklik yapabilir ve bu sebeple kodda bir hata meydana gelmese bile
test kodundaki assertion'a yazdığımız expected result tutmayabilir.

Örneğin global bir AtomicInteger tuttuğumuzu ve bu sayıyı arttıran metodları iki farklı testin tetiklediğini düşünelim.
Birinci test değeri 1 iken bir arttırıp 2 olduğunu assert ediyor fakat testler paralel koştuğu için o sırada
ikinci test de değeri arttırdığından değer 3 geliyor.
Böyle senaryolarda kodun çalışması tamamen doğru olduğu halde testler hata verebilir.

Biz ekipçe genellikle statik global state tutmadığımız için global state konusunda
en çok karşılaştığım problemleri genelde `ThreadLocal` kullanımı sebebiyle yaşamışızdır.
**[Thread Local](/2020/04/13/thread-local-nedir-java/)**
Thread üzerinde global veri tutulması ve farklı thread'lerin bu veriyi görememesi için tasarlanmış bir nesne
fakat fazla/hatalı kullanımında o da test yazılması zor kodlara sebep olabilmekte.
Burada da testleri paralel koşmadığımızda hepsinin aynı thread tarafından çalıştırıldığını unutmayalım.
Yani `ThreadLocal` bir nevi tüm test suite için global bir değişken haline geliyor.

## Bitiş

Unit test yazı dizimizin bu yazısında test edilebilir yazılım nasıl geliştirilir
konusunu inceledik.

Yazı dizisinin bu noktaya kadar olan yazılarıyla birlikte düşündüğümüzde,
etkili unit testler yazdığımızda projenin yazılım kalitesinin nasıl artabileceğini
artık daha iyi anlıyoruz.
Kaliteli unit testler yazmaya çabaladığımızda sadece testlerin değil
production kodunun da kalitesinin artmaya başladığını fark edeceğiz.
Unit test yazacağını bilerek kod yazan geliştirici ya yazılımı baştan test edilebilir
şekilde tasarlar ya da test yazamadığı noktada yazılımı test edilebilir hale
dönüştürmeye çalışır.

Bu konular kesin doğrusu olmayan ve tartışmaya çok açık konular olduğu için, 
ben de bu konular üzerinde tartışmayı sevdiğim için,
fikir ayrılıklarına düştüğümüz noktalarda ya da hemfikir olduğumuz noktalarda 
lütfen yorumlarınızı esirgemeyin.

