---
layout: post
title: "Unit Test 04: Kaliteli Unit Test Nasıl Yazılır?"
date: 2021-05-18 23:10:00 +0300
categories: [Java, Programlama, Unit Test]
author: Serdar Kuzucu
permalink: /2021/05/18/kaliteli-unit-test-nasil-yazilir/
comments: true
post_identifier: kaliteli-unit-test-nasil-yazilir
featured_image: /assets/category/unit-test.png
series: "Unit Test"
references:
  - url: "https://medium.com/@pjbgf/title-testing-code-ocd-and-the-aaa-pattern-df453975ab80"
    title: "Unit Testing and the Arrange, Act and Assert (AAA) Pattern"
    author: "Paulo Gomes"

  - url: "https://betterprogramming.pub/13-tips-for-writing-useful-unit-tests-ca20706b5368"
    title: "13 Tips for Writing Useful Unit Tests"
    author: "Nick Hodges"

  - url: "https://dzone.com/articles/10-tips-to-writing-good-unit-tests"
    title: "10 Tips to Writing Good Unit Tests"
    author: "Grzegorz Ziemoński"

  - url: "https://stackify.com/unit-testing-basics-best-practices/"
    title: "You Still Don’t Know How to Do Unit Testing (and Your Secret is Safe with Me)"
    author: "Erik Dietrich"

  - url: "https://www.petrikainulainen.net/programming/testing/writing-clean-tests-naming-matters/"
    title: "Writing Clean Tests – Naming Matters"
    author: "Petri Kainulainen"

  - url: "https://dzone.com/articles/7-popular-unit-test-naming"
    title: "7 Popular Unit Test Naming Conventions"
    author: "Ajitesh Kumar"

  - url: "https://www.martinfowler.com/bliki/TestDouble.html"
    title: "TestDouble"
    author: "Martin Fowler"
---

"Unit Test" yazı dizisinin bir önceki yazısında neden unit test yazarız
sorusuna cevaplar arayıp unit testlerin faydalarına değinmiştik.
İkna olduysak artık test yazmaya başlayabiliriz.
Peki unit test nasıl yazılmalı? 
Unit test yazarken nelere dikkat etmeliyiz?
Unit testlerimizin kaliteli, faydalı ve amaca yönelik olması için 
takip etmemiz gereken kurallar nelerdir?
Bu yazıda da konunun bu boyutunu ele alıyor olacağız.

<!--more-->

#### Küçük Testler Yazalım

Unit testler olabildiğince küçük kod parçaları olmalılar.
Hata veren bir unit test çok hızlı bir şekilde okunabilmeli,
testteki veri mi yoksa test edilen kod mu sıkıntılı çabucak anlaşılabilir olmalıdır.

Ayrıca uzun test fonksiyonları küçük değişikliklerden daha sık etkilenirler
ve bu test kodlarında sonradan değişiklik yapmak da zorlaşır.
Bu da kodun bakım maliyetinin yanında testlerin de bakım maliyetlerini arttırır.


#### Bağımlılıklardan İzole Edelim

Unit testi "unit" yapan şey sadece ve sadece test ettiği kodu test ediyor oluşudur.
Test edilen kodun herhangi bir bağımlılığı varsa test sırasında bu bağımlılık izole edilir.
Yani bağımlı olan sınıfın belirli bir davranışı sergilediği varsayılır, simüle edilir.
Buna mocking denir ve birçok dilde bunu yapmamızı sağlayan kütüphaneler vardır.

<div class="alert alert-secondary pb-0" role="alert" markdown="1">
**Not:** Ben bu yazıda birçok farklı izolasyon yöntemine mocking diyorum.
Production için tasarlanmış bir bağımlılığın/nesnenin test amacıyla değiştirilmesi işinin genel adı literatüre
[Test Double](https://www.martinfowler.com/bliki/TestDouble.html){:target="_blank"}
olarak geçmiş ve birçok *Test Double* çeşidi var.
Mocking bu çeşitlerden sadece bir tanesi fakat bizim dilimize malesef böyle yerleşmiş.
Martin Fowler'ın sitesinde yazdığı diğer *Test Double* çeşileri: *Dummy, Fake, Stub ve Spy*
</div>

Bağımlı olduğumuz fonksiyonda bir hata varsa bunu nasıl yakalarız diye soruyorsanız,
onu da bağımlı olduğumuz sınıf/fonksiyon için yazdığımız unit testlerde yakalamamız gerekiyor.

Java'da bu mocking işlemini yapmamızı ve bağımlılıklar varmış gibi davranmamızı sağlayan kütüphanelerin başını
Mockito çekiyor. Aşağıda Mockito kullanarak yazdığım bir örneği anlatacağım.

Aşağıdaki `PersonServiceImpl` isimli sınıfın `createPerson` isimli metodunu test etmek istediğimizi düşünelim.
Bu sınıfın `PersonRepository` isimli bir interface bağımlılığı var.
Bu repository muhtemelen bir veritabanına insert işlemi yapmakta olup, ne yaptığı bizi hiç ama hiç ilgilendirmiyor.

```java
public class PersonServiceImpl implements PersonService {
    private final PersonRepository personRepository;

    public PersonServiceImpl(PersonRepository personRepository) {
        this.personRepository = personRepository;
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

Hatta ben bu sınıf için test yazarken `PersonRepository` arayüzü için bir implementasyon sınıfı bile yazmadım.
Mockito kullanarak `PersonRepository` arayüzünün sahte (mock) bir implementasyonunu hazırladım
ve `savePerson` metodu çağırıldığında ne dönmesini istediğimi aşağıdaki test metodunda belirttim.

```java
@Test
void createPerson_validCreatePersonRequest_returnsSamePersonReturnedFromRepository() {
    // Arrange
    final var personRepository = Mockito.mock(PersonRepository.class);
    final var personService = new PersonServiceImpl(personRepository);
    final var expectedResult = new Person("Serdar", "Kuzucu", "+905554443322");
    Mockito.doReturn(expectedResult)
        .when(personRepository)
        .savePerson(Mockito.any(Person.class));

    // Act
    final var actualResult = personService.createPerson(CreatePersonRequest.builder()
            .firstName("Serdar")
            .lastName("Kuzucu")
            .phone("+905554443322")
            .build());

    // Assert
    assertSame(expectedResult, actualResult);
}
```

Bu test kaynak kodda `PersonRepository` arayüzünün herhangi bir implementasyonu olmasa bile
başarılı bir şekilde geçiyor. Eğer bu izolasyonu sağlamasaydık gerçek bir `PersonRepository` implementasyonuna
ihtiyacımız olacaktı. Bu durumda da bu implementasyon bir veritabanı kullanıyorsa testleri çalıştırabilmek için
bizim de bir veritabanı bağlantısı kurmamız gerekecekti.
Böyle bir test de unit test değil entegrasyon testi olacaktır.


#### Birbirinden Bağımsız Testler Yazalım

Unit testler asla birbirine bağımlı olmamalıdır.
Bir unit testin çalışması için öncesinde başka bir testin başarıyla çalışmış olması gerekmemelidir.
Böyle bir bağımlılık testlerin sıralı çalıştırılmasını zorunlu kılar ve çoğu test suite yazılımı (junit, vb.)
test senaryolarının sıralı çalışacağını garanti etmez.
Lokalimizde bir test sınıfındaki tüm testler doğru sırayla çalışıp başarılı olurken,
CI/CD ortamında farklı sırayla çalışıp hata alabilirler.

Testler arası state paylaşımından olabildiğince kaçınmamız gerekiyor.
Her test kendi state'ini oluşturmalı ve test sonrasında gerekiyorsa temizlemelidir.
Eğer bir test sınıfındaki tüm testlerde başlangıç ve bitiş durumları için aynı kodları yazmak gerekiyorsa
bunu bir testte yapıp diğerlerinin sırayla çalışacağını varsaymak yerine,
kullandığımız test framework'ünün `Setup` ve `TearDown` özelliklerini kullanmalıyız.

Java'da çoğunlukla kullandığımız junit test framework'ünde bu "Setup" ve "TearDown" özellikleri,
kullandığımız junit versiyonuna göre,
`@Before`, `@After`, `@BeforeClass`, `@AfterClass`, `@BeforeEach`, `@AfterEach`, `@BeforeAll` ve `@AfterAll`
gibi anotasyonlar ile sağlanıyor.


#### AAA Tasarım Şablonuna Uyalım

[Yazı dizisinin ilk yazısında](/2021/05/18/unit-test-nedir/) da değindiğim 
Arrange-Act-Assert, kısaca AAA, tasarım şablonunu mümkün olduğunca uygulayalım.
Bu şablon hem dünya çapında genel geçer bir tasarım şablonu
hem de testlerin okunabilirliğini arttıran bir yöntem.
Testin okunabilir olması testin ne amaçla yazıldığını anlamayı kolaylaştırır.
Anlaşılabilir bir test hata verdiğinde testteki veya koddaki hatanın bulunması da daha kolay olur.

Testlerimizi bu 3 aşamayı düşünerek yazdığımızda "ben bu test koduyla neyi test ediyorum"
sorusunu kendi kendimize cevaplamamızı da kolaylaştıracaktır.


#### Bir Testte Sadece Bir Şeyi Test Edelim

Son derece normal bir şekilde test ettiğimiz fonksiyonun birden fazla dalı olabilir.
Farklı girdilerde farklı çıktılar üreten değişik iş akışlarına sahip olabilir.
Hata veren testlerden koddaki hatayı daha hızlı anlayabilmemiz için
bir testin sadece tek bir şeyi test ediyor olması gerekmekte.

Örnek olarak aşağıdaki servis sınıfımızı düşünelim:

```java
public class FrequentlyAskedQuestionServiceImpl implements FrequentlyAskedQuestionService {
    private final FrequentlyAskedQuestionRepository frequentlyAskedQuestionRepository;
    private final EventPublisher eventPublisher;

    public FrequentlyAskedQuestionServiceImpl(FrequentlyAskedQuestionRepository frequentlyAskedQuestionRepository,
                                              EventPublisher eventPublisher) {
        this.frequentlyAskedQuestionRepository = frequentlyAskedQuestionRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public SaveFAQResult saveFaq(String question, String answer) {
        if (frequentlyAskedQuestionRepository.existsByQuestion(question)) {
            return SaveFAQResult.ALREADY_EXISTS;
        }
        final var faq = new FAQ(question, answer);
        final var persistedFaq = frequentlyAskedQuestionRepository.saveFAQ(faq);
        eventPublisher.fireEvent(new FAQSavedEvent(persistedFaq));
        return SaveFAQResult.SUCCESS;
    }
}
```

Burada aşağıdaki gibi 6 farklı senaryoyu test edebiliriz:

* Başarılı işlemde SUCCESS cevabı dönmeli:

```java
@Test
void saveFaq_validQuestionAndAnswer_returnsSuccess() {
    final var question = "How to deorbit a satellite?";
    final var answer = "Lorem ipsum dolor sit amet...";
    final var repository = Mockito.mock(FrequentlyAskedQuestionRepository.class);
    final var eventPublisher = Mockito.mock(EventPublisher.class);
    Mockito.doReturn(false)
            .when(repository)
            .existsByQuestion(question);
    Mockito.doReturn(new FAQ(question, answer))
            .when(repository)
            .saveFAQ(Mockito.any(FAQ.class));
    final var service = new FrequentlyAskedQuestionServiceImpl(repository, eventPublisher);

    final var result = service.saveFaq(question, answer);

    assertEquals(SaveFAQResult.SUCCESS, result);
}
```

* Başarılı işlemlerde `FrequentlyAskedQuestionsRepository` üzerindeki
  `saveFAQ` metodu doğru argümanlar ile tetiklenmeli:

```java
@Test
void saveFaq_validQuestionAndAnswer_callsRepositorySaveMethodWithTheSameQuestionAndAnswerValues() {
    final var question = "How to deorbit a satellite?";
    final var answer = "Lorem ipsum dolor sit amet...";
    final var repository = Mockito.mock(FrequentlyAskedQuestionRepository.class);
    final var eventPublisher = Mockito.mock(EventPublisher.class);
    Mockito.doReturn(false)
            .when(repository)
            .existsByQuestion(question);
    Mockito.doReturn(new FAQ(question, answer))
            .when(repository)
            .saveFAQ(Mockito.any(FAQ.class));
    final var service = new FrequentlyAskedQuestionServiceImpl(repository, eventPublisher);

    service.saveFaq(question, answer);

    final var faqArgumentCaptor = ArgumentCaptor.forClass(FAQ.class);
    Mockito.verify(repository, Mockito.times(1))
            .saveFAQ(faqArgumentCaptor.capture());

    assertEquals(question, faqArgumentCaptor.getValue().getQuestion());
    assertEquals(answer, faqArgumentCaptor.getValue().getAnswer());
}
```

* Başarılı işlemlerde `EventPublisher` üzerindeki `fireEvent` metodu doğru argümanlar ile tetiklenmeli:

```java
@Test
void createFaq_validQuestionAndAnswer_firesFAQSavedEvent() {
    final var question = "How to deorbit a satellite?";
    final var answer = "Lorem ipsum dolor sit amet...";
    final var repository = Mockito.mock(FrequentlyAskedQuestionRepository.class);
    final var eventPublisher = Mockito.mock(EventPublisher.class);
    Mockito.doReturn(false)
            .when(repository)
            .existsByQuestion(question);
    Mockito.doReturn(new FAQ(question, answer))
            .when(repository)
            .saveFAQ(Mockito.any(FAQ.class));
    final var service = new FrequentlyAskedQuestionServiceImpl(repository, eventPublisher);

    service.saveFaq(question, answer);

    final var eventArgumentCaptor = ArgumentCaptor.forClass(FAQSavedEvent.class);
    Mockito.verify(eventPublisher, Mockito.times(1))
            .fireEvent(eventArgumentCaptor.capture());

    assertEquals(question, eventArgumentCaptor.getValue().getQuestion());
    assertEquals(answer, eventArgumentCaptor.getValue().getAnswer());
}
```

* `FrequentlyAskedQuestionRepository` sınıfındaki `existsByQuestion` metodu `true` dönerse
  servis metodumuz `ALREADY_EXISTS` değerini dönmeli.

```java
@Test
void createFaq_alreadyExistingQuestion_returnsAlreadyExists() {
    final var question = "How to deorbit a satellite?";
    final var answer = "Lorem ipsum dolor sit amet...";
    final var repository = Mockito.mock(FrequentlyAskedQuestionRepository.class);
    final var eventPublisher = Mockito.mock(EventPublisher.class);
    Mockito.doReturn(true)
            .when(repository)
            .existsByQuestion(question);
    final var service = new FrequentlyAskedQuestionServiceImpl(repository, eventPublisher);

    final var result = service.saveFaq(question, answer);

    assertEquals(SaveFAQResult.ALREADY_EXISTS, result);
}
```

* `FrequentlyAskedQuestionRepository` sınıfındaki `existsByQuestion` metodu `true` dönerse
  `FrequentlyAskedQuestionRepository` sınıfındaki `saveFAQ` metodu hiç çağırılmamalı.

```java
@Test
void createFaq_alreadyExistingQuestion_doesNotCallSaveFaqMethodOfRepository() {
    final var question = "How to deorbit a satellite?";
    final var answer = "Lorem ipsum dolor sit amet...";
    final var repository = Mockito.mock(FrequentlyAskedQuestionRepository.class);
    final var eventPublisher = Mockito.mock(EventPublisher.class);
    Mockito.doReturn(true)
            .when(repository)
            .existsByQuestion(question);
    final var service = new FrequentlyAskedQuestionServiceImpl(repository, eventPublisher);

    service.saveFaq(question, answer);

    Mockito.verify(repository, Mockito.never()).saveFAQ(Mockito.any());
}
```

* `FrequentlyAskedQuestionRepository` sınıfındaki `existsByQuestion` metodu `true` dönerse
  `EventPublisher` sınıfındaki `fireEvent` metodu hiç çağırılmamalı.

```java
@Test
void createFaq_alreadyExistingQuestion_doesNotPublishAnyEvent() {
    final var question = "How to deorbit a satellite?";
    final var answer = "Lorem ipsum dolor sit amet...";
    final var repository = Mockito.mock(FrequentlyAskedQuestionRepository.class);
    final var eventPublisher = Mockito.mock(EventPublisher.class);
    Mockito.doReturn(true)
            .when(repository)
            .existsByQuestion(question);
    final var service = new FrequentlyAskedQuestionServiceImpl(repository, eventPublisher);

    service.saveFaq(question, answer);

    Mockito.verify(eventPublisher, Mockito.never()).fireEvent(Mockito.any());
}
```

Bu şekilde unit testleri sadece bir şeyi test eder şekilde kurguladığımızda
ileride kodda yapılacak bir değişikliğin tam olarak hangi senaryoyu veya senaryoları etkilediğini aldığımız hatadan
nokta atışı bulabiliriz.

Bu arada bu örnek testleri yazarken yine daha önce yaptığım gibi `FrequentlyAskedQuestionServiceImpl`
dışındaki hiçbir sınıfı doğru düzgün geliştirmedim.
Testlerdeki izolasyon sayesinde buna ihtiyacım kalmadan yazdığım tüm testler başarılı bir şekilde çalıştı.


#### Hızlı Çalışan Testler Yazalım

Unit testleri hızlıca çalıştırılıp sonuç alabileceğimiz şekilde yazmalıyız.
Uzun test çalışma süreleri genellikle geliştiricilerin testleri çalıştırmadan build almasıyla sonuçlanıyor.

Bir zamanlar üzerinde çalıştığım bu şekilde bir proje vardı.
Çalışan testler çok uzun sürüyordu, birçoğu da çalışmıyordu.
Nasıl olsa testler çalışmıyor diye kimse testleri çalıştırarak build almıyordu,
kimse hataları düzeltmeye bile çalışmıyordu.
Problem projedeki tüm testlerin silinmesiyle sonuçlandı.

Yavaş testler, test edilen sınıftaki bağımlılıkların testlerde yeterince izole edilmediğinin
veya test edilen kodun aslında test edilebilir bir kod olmadığının göstergesi olabilir.


#### İlk Olarak En Basit Başarılı Senaryoyu Test Edelim

Test edeceğimiz kodun ne yapması gerekiyor? Asıl varoluş amacı ne?
Bu soruya vereceğimiz en basit ve hızlı cevap için hemen bir test yazalım.

Örneğin bir String'i ters çeviren bir kodu test ediyorsak önce ters çevirilebilir kısa bir metin ile test edelim.

```java
@Test
void reverse_threeLetterString_returnsReversedString() {
    final var text = "abc";
    final var result = StringUtils.reverse(text);
    assertEquals("cba", result);
}
```

Daha sonraki testlerde daha kompleks akışlara, uç senaryolara ve istisna durumlarına geçebiliriz.

```java
@Test
void reverse_nullArgument_returnsNull() {
    final String text = null;
    final var result = StringUtils.reverse(text);
    assertNull(result);
}
```

#### Uç Senaryoların Testlerini Yazalım

Test edilen kodun uç senaryolarını da düşünelim ve mutlaka bu senaryolar için test yazalım.

* Parametre `null` gelirse ne olur?
* DB'den bir sonuç beklerken iki sonuç gelirse ne olmalı? Hiç sonuç gelmezse?
* Bölme işlemi içeren bir fonksiyonda paydaya 0 (sıfır) gelme ihtimali var mı?
* Beklediğimden büyük bir sayı gelirse integer overflow olur mu?
* Kullanıcı adı boş String (`""`) geldiğinde fonksiyon ne yapmalı?
* Javascript kodum `null`, `undefined`, `0`, `false` ve `""` arasındaki farkı ayırt edebiliyor mu?
* ...

Daha aklımıza gelebilecek bir çok senaryoyu buraya ekleyebiliriz ve çoğu kodda da geçerlidir bu durumlar.

Eğer kodumuz sınırlı bir veri aralığı ile ilgiliyse bu sınırların çizgilerini,
sınırın bir miktar dışını, bir miktar içini de testlerimize eklemeliyiz.

Örneğin bir kullanıcının 3 defa şifresini yanlış girme hakkı varsa
bu kontrolü yapan kodu şifrenin doğru girilmesi için test ettiğimiz gibi
mutlaka 2, 3 ve 4 gibi sayılar ile test etmeliyiz.


#### Tüm Yol Ayrımlarını Test Edelim

Test edilen kodda yol ayrımları (if/else, loop, vb.) varsa
mutlaka o yol ayrımlarına giren ve girmeyen testleri *ayrı ayrı* yazmaya özen gösterelim.

Bu hem *coverage* denen testlerin kodun ne kadarını kapsadığı metriğini arttırır
hem de bu tür durumlarda olabilecek hataların erken fark edilmesini sağlar.

Kullanılan dile ait `enum` gibi bazı yapılar da gizli yol ayrımlarına neden olabilirler.
`enum` tipinde bir veri üzerinde çalışan kodların testlerini yazarken
`enum` üzerinde tanımlanmış tüm olası değerler için birer test yazmalıyız.


#### Hata Bulmak İçin Test Yazalım

Eğer kodda belirli bir durumda bir hata oluştuğu iddia ediliyorsa,
kodu okuyup bug-fix geliştirmeden önce bu hatayı oluşturan bir unit test yazalım.

Testi çalıştırdığımızda hata alıyorsa doğru yoldayız demektir.
Sonrasında istersek doğrudan koda dalabiliriz
veya kod okumak için çok karışıksa testi debug modda çalıştırarak debug edebiliriz.

Koddaki düzeltmeyi yaptığımızda yazmış olduğumuz testin başarılı olduğunu görürsek tebrikler!
Hem bir hatayı çözmüş oluruz hem de bu hatanın bir daha ortaya çıkmayacağını garanti altına alan
nur topu gibi bir unit testimiz olur.


#### İsimlendirmelere Dikkat Edelim

Test isimlendirme konusunda çok farklı yazım standartları var
ve birçok farklı standart farklı farklı geliştiriciler tarafından benimsenmiş durumda.
Burada testlerimizi kesin şu şekilde isimlendirmeliyiz diyemiyoruz.

[Şu makalede](https://dzone.com/articles/7-popular-unit-test-naming){:target="_blank"}
7 farklı popüler isimlendirme örneği gösterilmiş.
Hepsinin kendi avantajları ve dezavantajları var.
[Şu makalede](https://www.petrikainulainen.net/programming/testing/writing-clean-tests-naming-matters/){:target="_blank"}
ise test kodundaki isimlendirmelerin öneminden bahsedilmiş.
Böyle konular çok tartışmaya açık konular olduğundan bu tip konularda fikir alışverişi de fazla oluyor.

Burada önerebileceğim en önemli şey şu, test ismine bakıldığında neyin test edildiği anlaşılmalı.
`test01`, `test02` gibi isimlendirmelerden veya fonksiyon ismi + sayı gibi hangi fonksiyonun test edildiği dışında
bir bilgi vermeyen isimlendirmelerden kaçınmalıyız.

Bir diğer önerim de ekip içerisinde popüler bir isimlendirme standartına karar verilip onun uygulanması.
Bir projede farklı diğerinde farklı isimlendirmeler yapılması bir süre sonra kafa karışıklığına yol açıyor
ve devamında aynı projede farklı isimlendirme standartları ortaya çıkmaya başlıyor.

Ben şahsi olarak Java dilinde geliştirme yaparken Java metod isimlendirme kurallarına
mümkün olduğunca uyulmasından yanayım.
Sonuçta test metodu da bir Java kodu.
Bu sebeple metod isimlerine büyük harf ile başlamayı kesinlikle sevmem.
Fakat test metod isminin uzunca bir cümle olabileceğinden dolayı
cümlenin farklı parçalarını `_` ile ayırmayı da severim.
Bu okunabilirliği arttırır.
Unutmayalım bir test hata verdiğinde test isminin ne kadar okunabilir olduğu önemlidir.

Bu sebeple favori test metod ismi yazım stilim olan
`[testEdilenMetodİsmi]_[verilenGirdi|testEdilenDurum]_[beklenenÇıktı|beklenenDavranış]`
stilini kullandım bu yazıdaki örneklerde de.

Bahsettiğim standart ile yazılmış bazı örnekler:

* `registerUser_nullUsername_throwsException`
* `reverseString_emptyString_returnsEmptyString`
* `fireEvent_subscriptionCreatedEvent_writesEventToKafka`

Bazen test edilecek metod herhangi bir state veya input bağımlılığı olmadan çok basit bir işlem yapıyor olabilir.
Bu durumda test ismi yazacağız diye bir şeyler uydurmaya çalışmaya gerek yok.
Bazı kısımları atlayabiliriz.

* `getUsername_returnsUsername`
* `getCurrentTime_returnsCurrentTime`

vb. örnekler çoğaltılabilir.


#### İstisnaları (Exceptions) Test Edelim

Test edilen kodun istisna durumları varsa, Java'da buna Exception deniyor, bunlar için de test yazmalıyız.

> <h5><a href="https://tr.wikipedia.org/wiki/%C3%87ehov%27un_silah%C4%B1"
>   target="_blank" rel="nofollow">Çehov'un silahı</a></h5>
> "Eğer birinci perde açıldığında duvarda bir tüfek asılıysa
> takip eden sahnede tüfek mutlaka patlamalı.
> Aksi takdirde oraya koymayın."
> <footer class="blockquote-footer">
>   <cite title="Bootstrap Grid System">
>     <a href="https://tr.wikipedia.org/wiki/Anton_%C3%87ehov" target="_blank" 
>       rel="nofollow">Anton Çehov</a>
>   </cite>
> </footer>

Test edilen kodda bir yerde bir Exception fırlatıldığını görüyorsak,
bu durumun doğru bir şekilde gerçekleştiğinden de emin olmalıyız.

Eğer unit test ile bile o istisna durumunu sağlayamıyorsak
o koşulu kodumuzdan silebiliriz, büyük ihtimalle gereksizdir ve canlıda da karşımıza çıkmayacaktır.

Java 8 öncesi biraz daha zahmetli olan Exception testi yazma konusu
Java 8 ve Junit 5 kütüphanesinin gelmesiyle aşağıdaki gibi
oldukça kolaylaşmış ve yazması keyifli hale gelmiş durumda.

```java
// Test edilen kod

public void throwIfUserDoesNotHavePrivilege(UserDetails user, String privilege) {
    user.getAuthorities()
            .stream()
            .map(GrantedAuthority::getAuthority)
            .filter(privilege::equals)
            .findFirst()
            .orElseThrow(() -> new AccessDeniedException("Privilege: " + privilege));
}

// Test kodu

@Test
void throwIfUserDoesNotHavePrivilege_userDoesNotHavePrivilege_throwsAccessDeniedException() {
    final var privileges = Set.of(
            new SimpleGrantedAuthority("PRIV_CHANGE_PASSWORD"),
            new SimpleGrantedAuthority("PRIV_VIEW_PROFILE"));
    final var user = new User("username", "password", privileges);

    final var exception = assertThrows(AccessDeniedException.class,
            () -> throwIfUserDoesNotHavePrivilege(user, "PRIV_UPDATE_PROFILE"));

    assertEquals("Privilege: PRIV_UPDATE_PROFILE", exception.getMessage());
}
```


#### Testlerimiz Başarısız Olduğunda Sebebi Belli Olsun

Bir test hata vermeye başladığında test kodunu okumadan önce
hatanın hangi senaryoda ve hangi durumda olduğunu anlayabiliyor olmalıyız.

Bunun için anlamlı test metodu isimleri kullanma başlığında anlattıklarımın dışında
bir de doğru assert kullanımı konusu var.

Eğer elimizde karşılaştırabileceğimiz iki değer varsa `assertEquals` veya `assertSame` kullanmalıyız.
Böyle durumlarda karşılaştırmayı kendimiz yapıp `assertTrue` kullanırsak patlayan testin verdiği hata mesajından
test ettiğimiz kodun ürettiği sonucu göremeyiz.

Örneğin aşağıda aynı hatalı kontrollerin `assertEquals` ve `assertTrue` ile verdiği hata mesajlarını okuyalım:

```java
final int actualResult = 5;

assertTrue(4 == actualResult);
// Hata mesajı: expected: <true> but was: <false>

assertEquals(4, actualResult);
// Hata mesajı: expected: <4> but was: <5>


final String actualResult = "Lorem ipsam";

assertTrue("Lorem ipsum".equals(actualResult));
// Hata mesajı: expected: <true> but was: <false>

assertEquals("Lorem ipsum", actualResult);
// Hata mesajı: expected: <Lorem ipsum> but was: <Lorem ipsam>
```

Tabi ki `boolean` dönen bir metodun testini yazarken mecburen `assertTrue` kullanmamız gerekiyor.
İki elimiz kanda da olsa `assertTrue` kullanmayalım gibi bir durum yok.
O assertion'ın da bir varoluş sebebi var kütüphanede.

Ek olarak test yazarken kendimize sık sık bu soruyu da soralım:
"Bu test bu assert sebebiyle patladığında hata mesajında ne yazar?"
Hata mesajındaki bilginin yetersiz olacağını düşündüğümüz noktada,
kullandığımız test kütüphanesi izin veriyorsa assert mesajına özel bir de bilgi de ekleyebiliriz.

Örneğin aşağıdaki kodda `assertTrue` kullandık fakat hata mesajını özelleştirdik:

```java
final boolean startsWithPriv = privilegeName.startsWith("PRIV_");
assertTrue(startsWithPriv, "Privilege " + privilegeName + " does not start with PRIV_ prefix!");

// Hata mesajı: Privilege PR_AAA does not start with PRIV_ prefix! ==> expected: <true> but was: <false>
```

#### Ortam Bağımsız Çalışsın

Unit testler üzerinde çalıştığı ortamdan bağımsız şekilde her yerde çalışabilecek kadar izole geliştirilmeli.
Yabancı bir blogda unit testler annenizin bilgisayarında bile çalışabilmeli yazmıştı bilgili bir abimiz.

Özellikle platform bağımsız dillerde dil farklı makineleri ve işletim sistemlerini destekliyor olsa bile
yazılımcılar spesifik ortamlara bağımlı kodlar yazabilmektedir.
Test edilen kodun ortam bağımsız olması ile ilgili konuları yazı dizimizin bir sonraki yazısı olan
test edilebilir kod yazmak ile ilgili başlıkta da inceleyeceğiz.

Koddaki veritabanı, disk veya network gibi dış bileşenlerin kullanıldığı kısımları
testlerde mock implementasyonlar kullanarak izole ederek ortam bağımsız hale getirebiliriz.

Linux/Windows arası dosya sistemindeki klasör ayracı (`/`, `\`) değişiyor.
Bu tür şeylere dikkat ederek işletim sistemi ile ilgili problemlerden kurtulabiliriz.

Tarih/Zaman ile çalışan kodlarda tarih/zaman'ın sistemden okunması ile ilgili kısımları koddan izole ederek
farklı zaman + timezone problemlerinden kurtulabiliriz.

Benim en çok karşılaştığım problem timezone oldu bugüne kadar.
CI/CD sunucusu GMT+0 zamanında çalışırken geliştirici ekip olarak biz Türkiye'de GMT+3 zamanında çalışıyoruz.
Test kodunda bir tarihi elle String olarak yazıp formatladığımızda
lokalde çalışan testler CI/CD sunucusunda hata veriyor.
Bununla ilgili kullandığımız çözümü de bir sonraki yazıda paylaşacağım.


#### Sonuç

Unit test yazı dizimizin bu yazısında, 
unit testlerin nasıl daha kaliteli, okunabilir ve işe yarar şekilde geliştirilebileceği konusunu inceledik.

Bir test metodu ile sadece bir şeyi test etmemiz gerekirken, 
test edilen koddaki her bir farklı senaryo için de ayrı bir test yazmamız gerekiyor.

Unit testi diğer test çeşitlerinden ayıran özelliklere gerçekten sahip olabilmemiz için 
bu yazıdaki her bir maddeye özen göstererek testlerimizi geliştirmemiz gerekiyor.

Bu maddelere uyabilmemiz için de test edilebilir, kaliteli bir production koduna ihtiyacımız var.
Yazı dizimizin bir sonraki yazısında da test edilebilir kod nasıl yazılır konusunu inceleyeceğiz.
