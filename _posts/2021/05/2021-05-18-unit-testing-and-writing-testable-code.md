---
layout: post
title: "Unit Test ve Test Edilebilir Kod Yazmak"
date: 2021-05-18 02:51:25 +0300
categories: [Java, Programlama, Unit Test]
author: Serdar Kuzucu
permalink: /2021/05/18/unit-test-ve-test-edilebilir-kod-yazmak/
comments: true
post_identifier: unit-test-ve-test-edilebilir-kod-yazmak
featured_image: /assets/category/unit-test.png
---

Yazılımcılar ikiye ayrılır. Unit test yazanlar ve unit test yazmayanlar.
Bazen vakit yok deriz, bazen zor gelir, bazen proje/kod test yazmaya uygun değil deriz.
Unit test yazmak istemediğimizde bu saydıklarım gibi çok fazla miktarda bahaneler üretebiliriz
ve üretebileceğimiz bahanelerin de hemen hemen hepsini daha önce başkalarından da duymuşuzdur.
Bu yazıda unit test konusu ile ilgili birçok soruya cevaplar arayarak 
kaliteli yazılım geliştirme basamaklarından birkaç tanesini hep birlikte tırmanmaya çalışacağız.

<!--more-->

```java
@Test
void add_twoPlusTwo_returnsFour() {
    final var calculator = new Calculator();
    final var result = calculator.add(2, 2);
    assertEquals(4, result);
}
```

Unit test, dışarıdan bakıldığında yukarıdaki kod örneğinde olduğu gibi basit bir şey
gibi görünse de, içine girildiğinde derya denizdir.
Etkili unit test yazmanın çeşitli zorlukları vardır.
Çoğumuz bu zorlukları aşamayıp test yazmamayı tercih ederiz.
Kimimiz yazdımız testlerin unit test olduğunu zannederiz fakat aslında bambaşka bir test türüdür.
Ben bu sınıflandırmaların hepsinin içinde bizzat kendim de bulundum 
ve bu konuda hala kendimi geliştirebileceğim çok fazla nokta var.
Zaten kaliteli yazılım geliştirme serüveninde <u>ben artık tamamım</u> 
diyebileceğimiz bir nokta bulunmuyor.

Şimdi birbirinden zehirli sorularımızı ortaya atalım ve cevaplarına birlikte bakalım.

1. [Unit test nedir?](#unit-test-nedir)
2. [Diğer test çeşitleri nelerdir?](#diger-test-cesitleri-nelerdir)
3. [Unit testi diğer testlerden ayıran özellikler nelerdir?](#unit-test-vs-diger-testler)
4. [Neden unit test yazarız?](#neden-unit-test-yazariz)
5. [Nasıl unit test yazmalıyız?](#nasil-unit-test-yazmaliyiz)
6. [Unit test yazabilmemiz için nasıl yazılımlar tasarlamalıyız?](#test-edilebilir-yazilim)


---

<a id="unit-test-nedir"></a>
## 1. Unit Test Nedir?

Unit test uygulamamızın küçük bir parçasını 
uygulamanın geri kalanından bağımsız bir şekilde çalıştırarak
bu parçanın davranışını doğrulayan bir metoddur.

Unit test yazdığımız kodun davranışını yine kod yazarak doğrulamamızı sağlar.
Tipik bir unit test metodu genellikle üç aşamadan oluşur.
Bu aşamalar yabancı kaynaklarda <u>The AAA(Arrange-Act-Aspect) Pattern</u> olarak geçer.

1. <b>Arrange:</b> Test edilecek koda verilecek olan input parametrelerinin belirlendiği 
   ve test edilecek olan kodun bağımlı olduğu diğer bileşenlerin 
   test anındaki bulunacakları durumlarının tanımlandığı kısımdır.

2. <b>Act:</b> Test edilecek olan kodun çalıştırıldığı aşamadır.
   Bu aşamada test edilecek olan fonksiyonu/metodu tetikleriz.
   
3. <b>Assert:</b> Test sonuçlarının doğrulanması aşamasıdır.
   Tetiklenen fonksiyon doğru sonucu üretiyor mu 
   veya bağımlı olduğu bileşenler üzerinde beklenen aksiyonları tetikliyor mu kontrolünü bu aşamada yaparız.

Bu aşamalar aşağıdaki test kodu üzerinde daha net görebiliriz:

```java
@Test
void findByName_exactMatchWithTwoPersons_returnsBothOfThemInInsertionOrder() {
    // Arrange
    final var phoneBook = new PhoneBook();
    phoneBook.addPerson(new Person("James", "Malkovic", "+905554443321"));
    phoneBook.addPerson(new Person("John", "Doe", "+905554443322"));
    phoneBook.addPerson(new Person("Foo", "Bar", "+905554443323"));
    phoneBook.addPerson(new Person("John", "Baz", "+905554443324"));

    // Act
    final var result = phoneBook.findByName("John");

    // Assert
    assertEquals(2, result.size());
    assertEquals(new Person("John", "Doe", "+905554443322"), result.get(0));
    assertEquals(new Person("John", "Baz", "+905554443324"), result.get(1));
}
```

Burada unit testleri "Assert" fazında doğrulayacağı davranışa göre iki kategoriye ayırmışlar bazı kaynaklarda.

* **state-based**: Test edilen kodun çıktılarının veya sistemde oluşturduğu durum (state) değişikliğinin
  kontrol edilmesi durumunda "state-based" test yazmış oluyoruz.

* **interaction-based**: Test edilen kodun belirli fonksiyonları doğru şekilde tetiklediğini (doğru etkileşim) 
  doğrulayan bir test yazdığımızda "interaction-based" bir test yazmış oluyoruz.

Ben de yazdığım testlerde bu iki kategori arasındaki ayrıma dikkat etmeye çalışıyorum.
Eğer bir kod hem bazı başka bileşenlerle etkileşimde bulunuyorsa hem de bir sonuç dönüyorsa,
ikisini aynı testte yapmak yerine bir tane "state-based" bir tane de "interaction-based" test yazıyorum.

---

<a id="diger-test-cesitleri-nelerdir"></a>
## 2. Diğer Test Çeşitleri Nelerdir?

Kaliteli unit testler yazabilmemiz için unit testin ne olduğunu iyi anlamamız gerekiyor.
Bunu anlayabilmemiz için de diğer test çeşitlerini bilmemiz ve unit testleri diğer testlerden ayırabilmemiz gerekiyor.

"Types of Software Testing" veya "Yazılım Test Çeşitleri" şeklinde araştırmaya başladığımızda 
her biri ayrı bir makale olabilecek kadar çok sayıda test çeşidi olduğunu görüyoruz.
Hem iyi hem de kötü haber; bu test çeşitleri hangisi daha iyi 
veya hangisini kullanmalıyım şeklinde karşılaştırabileceğimiz şeyler değil. 
Hepsinin farklı bir amacı ve yazılım geliştirme ve devreye alma yaşam döngüsünde ayrı bir yeri var.

Birçok kaynakta test çeşitlerinin öncelikle iki kümeye ayırıldığını görmekteyiz.
Ayrıca farklı kaynaklarda test çeşitlerinin ayrıldığı kümeler de değişebilmektedir.

Testleri yapan veya hazırlayan kişinin bakış açısına göre test çeşitleri gruplandığında 
["white-box testing"](https://en.wikipedia.org/wiki/White-box_testing){:target="_blank"} ve 
["black-box testing"](https://en.wikipedia.org/wiki/Black-box_testing){:target="_blank"} 
şeklinde ikiye ayrılmaktadır.

* **White-box Testing:** Yazılımın iç yapısının nasıl kurgulandığının ve nasıl çalıştığının bilindiği
  test türüdür. Yazılımın bütününü oluşturan parçaların doğru girdiler ile doğru çıktıları, davranışları
  veya değişiklikleri üretebildiği test edilir. Unit testler çoğunlukla bu kategoriye dahildir.
  Test ettiğimiz kod bir işlevi gerçekleştirirken diğer kod bileşenleri ile 
  kurduğu etkileşimleri de test etmiş oluruz bu seviyede. 
  Örneğin bir methodu birinci tetiklememizde veritabanına sorgu atması, sonucu cache kütüphanesine de kaydetmesi 
  ve ikinci tetiklememizde veritabanı yerine cache üzerindeki veriyi getirmesini test etmek istediğimizde 
  kodun işlevi kadar kullandığı diğer sınıfları veya fonksiyonları da bilmemiz gerekiyor.

* **Black-box Testing:** Yazılımın nasıl çalıştığı bilinmeden veya önemsenmeden fonksiyonalitesi test edilir.
  Test yapanlar yazılımın iç yapısını bilmeden ve kaynak koda bakmadan, 
  son kullanıcıya beklenilen faydayı üretip üretemediğini doğrularlar.
  Genellikle sistem seviyesi testlerdir fakat unit testlerde de bu yaklaşımın kullanıldığı uygulamalar olabilmektedir.
  Örnek bir blackbox testi uygulama arayüzüne girip bir butona tıklamamız 
  ve sonrasında arayüzde gerçekleşen davranışı veya sonucu kontrol etmemiz olabilir.
  Böyle bir testi yaparken sistemin hangi bileşenlerden oluştuğunu hatta hangi dil ile yazıldığını dahi
  bilmemize gerek yoktur. Sistem bizim için tamamen bir kara kutudur.

Testin konusuna veya testin amacına göre kategorilere ayırdığımızda 
genellikle şu iki kategorinin kullanıldığını görüyoruz:

* **[Fonksiyonel Testler](https://en.wikipedia.org/wiki/Functional_testing){:target="_blank"}:** 
  Fonksiyonel gereksinimler belirli girdilere veya tetikleyicilere karşılık 
  sistemin hangi davranışları veya çıktıları üretmesini beklediğimizi belirler. 
  Fonksiyonel testler sistemin veya sistemdeki parçaların fonksiyonel gereksinimleri 
  doğru şekilde gerçekleştirdiğinin kontrolünün yapılmasını sağlar.
  Duman Testi, (Smoke Testing), Doğruluk Testi (Sanity Testing), Sistem Testi, Entegrasyon Testi, 
  Tekrar veya Regresyon Testi (Regression Testing), vb. birçok test çeşidi bu gruba dahildir.
  Birim test (Unit test) de birçok kaynakta fonksiyonel test olarak kategorilendirilmektedir 
  fakat unit testlerin yazılım geliştirme süreçlerindeki konumu konusunda epey tartışma mevcut.
  Bu konuya ileride tekrar geleceğiz.
  
* **[Fonksiyonel Olmayan Testler](https://en.wikipedia.org/wiki/Non-functional_testing){:target="_blank"}:** 
  Fonksiyonel olmayan gereksinimlerin sağlanıp sağlanmadığının kontrolünü sağlar.
  Yük testi, performans testi, güvenlik testi, vb. birçok test çeşidi fonksiyonel olmayan gereksinimlerin testleridir.

Aşağıda birkaç farklı test çeşidinin tanımlarını örnek olarak yazacağım fakat burada yazdıklarımdan çok daha fazla
test çeşidi olduğunu da önceden belirteyim. 
Daha fazla test çeşidini merak edip öğrenmek isterseniz yazının sonundaki kaynakçadaki linkleri takip edebilirsiniz.

* **Integration Test (Entegrasyon Testi):** Yazılım bileşenleri arasındaki arayüzlerin (interface) 
  ve etkileşimlerin (interaction) test edilmesi amacıyla yapılır. 
  Geliştirilen yazılım tarafından kullanılan veritabanı, cache server, entegre olunan başka uygulamalar, 
  farklı network bileşenleri, dosya sistemi, vb. sistemler ile geliştirilen yazılımın entegrasyonları test edilir.
  Unit test ile çok karıştırılmaktadır ve bazılarımız unit test yazdığımızı sanarken 
  entegrasyon testi yazmışızdır birçok defa.

* **System Test (Sistem Testi):** Tüm sistemin entegre olduğu dış bileşenler ile birlikte 
  gereksinimleri yerine getirip getiremediğinin test edilmesidir.
  Elle manuel olarak koşulacak testler olabileceği gibi yazılım ile otomatize edilmiş test senaryoları da olabilir.

* **Regression Test (Regresyon/Tekrar Testi):** Kodda yapılan bir değişiklik sonrası sistemin geri kalanında bir hata
  olup olmadığını anlamak amacıyla yapılır. Bu hatalar varolan bir özelliğin düzgün çalışmamaya başlaması veya 
  daha önce çözülmüş bir hatanın tekrar hortlaması şeklinde gerçekleşebilir.
  Kodda yapılan değişikliğin veya yeni geliştirilen özelliğin değil, önceden varolan özelliklerin testidir.
  Genellikle önceden yazılmış ve test edilmiş test senaryolarının tekrar çalıştırılmasıyla bu test yapılır.

* **Acceptance Test (Kabul Testi):** Uygulamayı alacak olan müşterinin kabul testidir.
  Müşteri uygulamayı almak için belirlediği kabul kriterlerinin karşılanıp karşılanmadığını test eder.
  Operasyonel kabul testi (Operational acceptance test, OAT), kullanıcı kabul testi (User acceptance test, UAT), 
  son kullanıcı testi (End-user test) gibi birçok çeşidi vardır.

* **Smoke Test (Duman Testi):** Uygulamanın hayati fonksiyonlarının hızlıca test edilerek daha ileri seviye testlere
  hazır olup olmadığını anlamak amacıyla yapılır. Uygulama hatasız şekilde ayağa kalkıyor mu, ana sayfa açılıyor mu,
  login olunabiliyor mu gibi basit senaryolar hızlıca test edilir. Basit senaryolarda hata varsa uygulama teste alınmaz.
  Duman testi isminin elektronik donanım testlerinden geldiği rivayet ediliyor. 
  Bir elektronik devreyi elektriğe bağladığınızda duman çıktığını görürseniz 
  elektriği kesersiniz ve başka test yapmaya ihtiyaç kalmaz mantığı ile böyle bir isim verilmiş.

* **Sanity Test (Doğruluk Testi):** Bu test duman testine benzerlik gösterse de aynı şey değil.
  Doğruluk testinde, daha kapsamlı testlere geçmeden önce uygulamanın en önemli fonksiyonlarının 
  çalışıp çalışmadığı test edilir. Duman testinde uygulamanın kalp atışı gibi hayati fonksiyonlarının testi yapılırken
  doğruluk testinde spesifik özellikler test edilir.
  Bu bakımdan doğruluk testini Inomera'da geliştirdiğimiz uygulamaları müşterinin test ekibine teslim etmeden önce 
  test ekibine yaptığımız demoya benzetiyorum. Test ekibinin hazırladığı detaylı test senaryolarının arasından
  önemli özelliklere ait birkaç tane test senaryosu seçiliyor ve uygulama o testlerden başarıyla geçtikten sonra 
  test ekibi detaylı testlere başlıyor.
  
* **Performance Test (Performans Testi):** Belirli bir iş yükünün altında sistemin nasıl performans gösterdiğinin 
  ölçülmesi işlemidir. Performans testlerinde sistemin yük altında cevap süresinde uzama oluyor mu, 
  bellek, işlemci veya disk gibi kaynak tüketimleri ne seviyelerde artıyor, 
  uygulamanın kullanılabilirliği ne derece etkileniyor, uygulama aynı anda kaç kullanıcıya cevap verebiliyor 
  gibi birçok metrik ölçümlenir. Yazılım yukarı ve aşağı yönde ölçeklenebilir bir yapıdaysa yük arttığında 
  gerçekten instance sayısı artıyor mu veya yük kesildiğinde azalıyor mu kontrolleri yapılır.
  Sık kullanıldığını gördüğüm ve birbirine karıştırılan iki performans testi çeşidi şunlardır:
  
  * **Load Test (Yük Testi):** Belirli bir yükün/trafiğin altında sistemin ölçülmesi.
    Sistemin desteklemek için tasarlandığı ortalama ve/veya maksimum yük miktarı ile yapılmalıdır.

  * **Stress Test (Stres Testi):** 
    Sistemin taşımak için tasarlandığından daha fazla yük altında nasıl davrandığının ölçülmesidir.

* **Security Test (Güvenlik Testi):** En kaba tabiriyle sistemin hacklenmesinin engellenmesi 
  ve yetki gerektiren verinin sadece yetkili kullanıcılar tarafından kullanılabildiğinin görülmesi için yapılır.
  Hassas verilerin yetkisiz kullanıcıların eline geçmeyeceğinin kontrolüdür. 
  Çalıştığım projelerde müşterilerin güvenlik ekipleri tarafından Fortify gibi programlar ile 
  statik kod analizi yapıldığına ve sızma testi (Penetration Test) gibi çeşitli araçlar ile 
  çeşitli güvenlik açıkları arandığına şahit oldum.

Yazılımda daha birçok test çeşidi, kategorisi, yöntemi, vb mevcut. 
Bu yazının konusunun dışına fazla çıkmamak için genel kültür amaçlı yazdığım bu başlığı burada kesiyorum.


---

<a id="unit-test-vs-diger-testler"></a>
## 3. Unit Testi Diğer Testlerden Ayıran Özellikler Nelerdir?

Bazı diğer test çeşitlerini yukarıda liste halinde gördükten sonra unit testlerin bu testlerden farkına bakalım.
Buradaki bazı özellikler aynı zamanda daha sonraki "Nasıl Unit Test Yazmalıyız" gibi başlıklarda da 
karşımıza gereksinim olarak çıkacak.


#### Unit Testlerin Kapsamı Küçüktür

Öncelikle unit testlerin en büyük farkı kapsamlarıdır.
Çok küçük kod parçalarını test ederler.
Bir araba üreticisi olduğumuzu düşünelim. 
Bu arabada kullanılan vidaların uygun bir delik üzerinde dik konumda doğru yönde çevirildiğinde 
deliğe girip girmediğini arabadaki diğer parçalardan bağımsız şekilde test etmemiz bir unit testtir. 
Bu vidanın ters yönde çevirildiğinde delikten çıktığını doğrulamamız da ikinci bir unit testtir.


#### Unit Testleri Çalıştırmak Hızlıdır

Unit testler, her bir ufak kod değişikliğinde geliştiricilerin çok az vakitlerini harcayarak uygulamadaki 
tüm unit testleri baştan sona çalıştırabileceği kadar hızlıdır. Hızlı olmalıdır.

Bir geliştiriciden yeni bir özellik geliştirdiğinde elle tüm uygulama özelliklerini 
arayüz veya API kullanarak test etmesini bekleyemezsiniz fakat tüm birim testleri çalıştırmasını 
bir kural haline getirebilirsiniz.

Bir şirket sunucusuna Jenkins gibi bir continuous integration ortamı kurup her bir kod değişikliğinde
tüm testlerin otomatik olarak çalışmasını ve birisi testleri patlattığında
tüm ekibe e-posta göndermesini sağlayabilirsiniz.


#### Unit Test Kolay Yazılır

Sistem testi veya entegrasyon testi gibi testleri yazmak çok zaman alır ve daha fazla kod gerektirir.
Bu tip testlerde sistemin belirli bir durumda olması simüle edilir ve bunun için veritabanına, diske, cache server'a,
vb. birçok ortama kod ile data üretmek, test sonunda bu datayı temizlemek gibi işlemler yapmak gerekir.

Unit testler ise çok küçük bir kod parçası için yazıldığından çok daha kolay yazılır.
Unit testlerde bağımlı olunan veritabanı veya network katmanı gibi dış faktörler tamamen ortadan kaldırılır.
Bu tür bağımlılıkların davranışları da simüle edilerek sadece test edilen sınıf/metod 
ile ilgili senaryolar test edilmiş olur.


#### Unit Test Bir Test Süreci Değildir

Hatta bu başlığın daha tartışmaya açık hali "Unit test test değildir" şeklinde ve ben de katılıyorum.
Unit test, test değil geliştirmedir. Yazılım geliştirme sürecinin ayrılmaz bir parçasıdır.
Testçi değil geliştirici tarafından yazılır.
Geliştiricinin "ben bu kodu geliştirdim ve bu kod parçasının çalıştığına kefilim" deme şeklidir.
Inomera'da çalıştığım ekipte bir süredir geliştiricilerin bir işi bitirebilmesi için 
unit testlerinin yazılmış olması ön koşulunu uyguluyoruz.
Unit testi yazılmamış geliştirmeyi geliştirilmiş saymıyoruz.


#### Unit Test Sistemin Çalıştığını Göstermez

Tüm unit testler başarıyla çalışsa bile bu bize sistemin doğru şekilde çalışacağını, 
hatta ayağa kalkacağını bile göstermez.
Unit testler sistem seviyesinde bilgi vermezler.
Geliştirdiğimiz ürünün fonksiyonel gereksinimlerinin karşılandığını göstermezler.

Unit test sadece geliştirilen kod parçalarının veya fonksiyonların doğru geliştirildiğini gösterir.
Bu bakımdan her bir satırı unit testler tarafından kapsanmış (coverage) bir kodun 
hala diğer test çeşitlerine ihtiyacı vardır.

Unit testler ile doğruluğu ispatlanmış kod parçaları bir araya geldiğinde entegrasyon sorunları,
iş akışı hataları veya eksik özellikleri olabilir.
Bu sebeple entegrasyon testi, duman testi, doğruluk testi, fonksiyonel testler, 
güvenlik testleri, performans testleri, vb. tüm testler gereklidir
ve unit test yaptık test ekibine ihtiyacımız yok diyemeyiz.


#### Test Piramidi

Hazır bu karşılaştırma işine bulaşmışken test piramidinden de bahsedelim.
Test piramidi epey farklı çeşitleri olan fakat özünde aynı konuyu açıklayan bir görsel.
Piramidin amacı test çeşidine göre yazılması gereken test miktarının 
ve bu çeşitlerdeki testlerin özelliklerinin görselleştirilmesi.

Aşağıdaki görseli *Jessie Leung* 
[The Test Pyramid](https://betterprogramming.pub/the-test-pyramid-80d77535573){:target="_blank"} 
başlıklı blog yazısında paylaşmış.
Piramidin internetteki birçok çeşidi arasından benim en beğendiğim hali bu oldu.

![Test Piramidi](/assets/posts/test-pyramid.png){:width="600px"}

Piramidin altına doğru indikçe genişlemesi yazmamız gereken test miktarının artması gerektiğini göstermekte.
Unit testlerin sayıca diğer testlerden fazla olması gerektiğini buradan anlıyoruz.
Piramitte aşağı indikçe testlerin daha hızlı ve geliştirme maliyetinin daha düşük olması gerektiğini görüyoruz.
Yukarı çıkıldığında ise hem testlerin çalışma süresi, hem de testleri geliştirmek için harcanan süre artıyor.
Bu da testlerin geliştirme maliyetini arttırıyor. Bu aynı zamanda bakım (maintenance) maliyetini de arttırıyor.

Sadece unit test yazmıyorsak, entegrasyon testi ve uçtan uca (end-to-end, e2e) test de yazıyorsak,
bu piramide uymamızda fayda var. Yoksa geliştirme maliyeti, bakım maliyeti 
ve zaman kaybı işin içinden çıkamayacağımız noktalara gelebilir.

Ek olarak bu konuda en önemli nokta bence unit testler ile diğer test çeşitlerini 
her ne kadar kodlayarak geliştiriyor olsak da ayrı yazmamız gerekiyor.
Unit testler ile aynı test suite içerisinde geliştirdiğimiz diğer test çeşitleri 
geliştiricilerin unit testleri çalıştırmasını çok uzun süren bir süreç haline getirerek 
bir süre sonra testleri hiç çalıştırmadan kod yazan geliştiricilerin çoğalmasına sebep olacaktır.

Farklı test çeşitleri gradle ile birbirinden nasıl ayrılır konusu 
tamamen başka bir yazıda anlatılabilecek bir konu fakat merak edenler için *Petri Kainulainen* tarafından yazılmış
"[Getting Started With Gradle: Integration Testing](https://www.petrikainulainen.net/programming/gradle/getting-started-with-gradle-integration-testing/){:target="_blank"}"
başlıklı yazıdan bir fikir edinebilirler.


---

<a id="neden-unit-test-yazariz"></a>
## 4. Neden Unit Test Yazarız?

Şimdi unit test yazmak için bizleri motive edecek birkaç tane sebebi inceleyelim.

#### Hataların Erken Fark Edilmesi

Unit test yazılarak geliştirilen bir kodda yapılabilecek hatalar henüz o kodun geliştirme aşamasında fark edilecektir.
Kendi tecrübelerimden gördüğüm kadarıyla bu şekilde çok farklı şekillerde hatalar bulunabiliyor.
Hata bulma işlemi testleri yazıp çalıştırdığımızda beklenen sonucun gelmemesi sonucunda testin patlaması 
şeklinde gerçekleşebileceği gibi, test yazımı ile kodun geliştirilmesi birlikte ilerlediğinden, test yazarken
koddaki hatayı gözle daha testi çalıştırmadan yakalamamız şeklinde de gerçekleşebiliyor.

![Hatanın Maliyeti](/assets/posts/defect-cost-increase.png){:width="600px"}

Yukarıdaki grafik *Steve McConnell* tarafından yazılmış olan meşhur 
[Code Complete](https://en.wikipedia.org/wiki/Code_Complete){:target="_blank"} 
kitabında yer alıyor. 
Grafiği en basit haliyle şöyle yorumlayabiliriz;
bir hatanın oluşması ile fark edilmesi arasında ne kadar zaman geçerse, hatanın çözülmesi maliyeti o kadar artar.
Grafiğe göre en maliyetli hatalar gereksinim belirleme aşamasında oluşup canlıya alım sonrası ortaya çıkan hatalar.

Unit testler birçok hatanın geliştirme sırasında bulunmasını ve çözülmesini sağladığı için 
hata çözme maliyetimizi minimum seviyeye indirmemizi sağlar.
Yine de geliştirme öncesinde yapılacak olan gereksinim belirleme, analiz, sistem mimarisi çalışmalarının da
minimum hata ile yapılmasının ve bu aşamalarda olabilecek hataların çözümünün geliştirme sürecine kadar gelmemesi
gerektiğinin de altını çizmek gerekiyor.


#### Unit Test Kodun Dökümantasyonudur

Kaliteli kod kendisinin dökümantasyonudur bakış açısına benzer şekilde,
kaliteli testler de test ettiği kodun bir dökümantasyonudur.

Karışık bir algoritma içeren bir fonksiyonu kaynak kodunu okuyarak 
anlamaktan daha kolayı unit testleri okuyarak anlamaktır.
Özellikle benim gibi kod okurken fonksiyonlara soyut seviyelerde bakmayı seviyorsanız,
siz de kodun içeriğine fazla girmeden dışarıdan baktığınızda ne yaptığını anlamak istersiniz. 
Bunun için çoğu durumda fonksiyonların isimlendirmeleri yeterli olsa da 
bazen birkaç tane unit testi okumak daha faydalı ve yeterli olabiliyor.

İyi yazılmış, okunaklı unit testler incelediğimiz fonksiyona veya bileşene hangi girdiler verildiğinde 
hangi çıktıların alınacağını gösteren çok güzel örnekler barındırır.
Test edilen kodun happy path olarak nasıl çalıştığını, uç senaryolarının neler olduğunu örnekler ile görmemizi sağlar.


#### Unit Test Kodu İstenmeyen Değişikliklerden Korur

Burası unit testlerin en sevdiğim kısmı. Geliştirdiğiniz özellikleri unit testler ile koruma altına alabilirsiniz.
Biz veya bir başkası bir gün bu kodda herhangi bir değişiklik yaptığında, eğer beklenmedik bir hataya sebep oluyorsa
bu hata daha önce bu kod için yazmış olduğumuz testler tarafından yakalanacaktır.

Testleri yazılmış bir sınıfa yeni bir özellik eklediğimizde 
genellikle yeni eklediğimiz özelliğin testlerine odaklanırız.
Bu yeni özellik düzgün çalışıyor olsa bile bu sınıfın mevcutta yerine getirebildiği bir özelliği 
yerine getirememesine sebep olabilir.
Varolan bir kodun tüm uç senaryolarını tek tek test etmeyi çoğu zaman atlarız.
Böyle durumlarda varolan özelliklerin önceden yazılmış testlerinin olması istenmeyen hatalardan bizi korur.

Ek olarak bu koruma bize özgüven verir.
Normalde canlıda çalışan ve kritik öneme sahip bir fonksiyonda bir değişiklik yapmak 
en junior geliştiricisinden en senior geliştiricisine kadar herkesi korkutan bir süreçtir 
ve fonksiyonun kritikliğine göre bazen tüm projenin baştan uçtan uca test edilmesine kadar götürebilir.
Unit testlerin varlığı o fonksiyonu değiştirme konusundaki cesaretimizi ve özgüvenimizi arttırır.
Yaptığımız değişikliğin başka bir şeyi bozmadığından emin olmamızı sağlar.


#### Unit Test Kodun Karmaşıklığını Azaltır, Kalitesini Arttırır

Unit test yazabilmek için en küçük yazılım bileşenlerinin bile tasarımında planlı olmamız gerekir.
Karmaşık, kompleks bir kodun testi de o kadar karmaşık ve yazması maliyetli olacaktır.
Bu maliyet bizi daha test edilebilir, daha ufak sınıflar/fonksiyonlar yazmaya zorlar.
Bu zorunda kalmışlık kodun daha okunabilir, daha az kompleks ve sonunda daha kaliteli olmasını sağlar.

Test edilebilir kod yazmaya çalışmak başlangıçta zor gibi gelse de zamanla iyi bir alışkanlığa dönüşüyor.
Farkında olarak veya olmayarak 
[SOLID](https://en.wikipedia.org/wiki/SOLID), 
[KISS](https://en.wikipedia.org/wiki/KISS_principle), 
[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), 
[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), 
vb. bazı temel yazılım geliştirme prensiplerine uymamızı sağlar.
Testini yazdığımız bileşenleri bağımlı olduğu diğer kod parçalarından bağımsız, izole bir şekilde test etme gereksinimi
bu bileşenleri soyutlayabilmemizi ve tekrar kullanılabilir (reusable) 
küçük parçalar halinde kodumuzu tasarlayabilmemizi sağlar.

Bu sayede zamanla iki-üç satırlık küçük kodları bile ihtiyaç duyulan yerlere kopyala yapıştır yapmaktan, 
ayrı bir sınıf/fonksiyon şekline çevirerek kullanan bir geliştiriciye doğru evrim geçirdiğimizi fark ederiz.

Burada ayrıca ek bir noktaya da değinmeden geçmeyelim.
Ufak bir kodu kopyala yapıştır usulü yazdığımız her fonksiyonda, 
o kod için tekrar tekrar test yazmamız gerekirken,
ayrı bileşen yolunu tercih edersek o bileşen için bir defa test yazmamız yeterli olur.
O bileşeni kullanan diğer fonksiyonlar, o bileşenin zaten test edildiğini bilerek 
sadece kendi fonksiyonalitelerinin testlerine odaklanırlar.


#### Hata Bulmayı (Debugging) Kolaylaştırır

Yazılımda bir hata olduğunu ve sadece debug ederek bulabileceğiniz bir durum olduğunu düşünün.
Bunun için de tüm sistemi ayağa kaldırıp, arayüz üzerinden test verisi üretmeniz gerektiğini
ve sonra spesifik bir aksiyonu tetikleyip kodun tüm katmanlarında breakpoint'ler 
yardımıyla satır satır debug ettiğinizi düşünün.

Sistemin büyüklüğüne ve geliştiricinin sistem üzerindeki tecrübesine göre 
bu hata arayışı saatlerce hatta tüm gün boyunca da sürebilir.

Bunun yerine aynı şeyi unit testler ile yaptığımızı düşünelim.
Problemli olduğu düşünülen işlemin geçtiği kod bileşenlerine hataya sebep olabilecek test verilerinin 
girdi olarak verildiği ve çıktıların kontrol edildiği bir birim test yazabiliriz.
Bu birim testi IDE üzerinde debug modda çalıştırabiliriz.
Bu esnada sadece o sınıfı debug etmiş oluruz. 
Unit testlerde herhangi bir dış entegrasyon veya bağımlılık olmadığından test daha hızlı sonuçlanır.
Tüm uygulamayı veya tüm sistemi bilgisayarımızda ayağa kaldırmamış oluruz.
Hatayı bulma süreci daha hızlı ve daha az sancılı sonuçlanır.

Hatayı tespit ederken ve çözerken oluşturduğumuz unit test kodu projenin artık bir parçasıdır
ve bu test senaryosu sayesinde aynı hatanın artık tekrarlanmayacağını da biliriz.

<div class="alert alert-secondary pb-0" role="alert" markdown="1">
**Not:** Bir projenin kendi bilgisayarımızda ayağa kaldırılarak debug edilmesi 
senaryosunu neden abarttığım anlaşılmıyor olabilir.
Çalıştığım bir mikro servis projesinde böyle bir debug yapabilmek için bazen bilgisayarımda 
3-4 tane farklı mikro servisi, bu mikro servislerin kullandığı Oracle DB, Cassandra gibi iki farklı veritabanını,
Kafka ile Zookeeper'ı ve Hazelcast uygulamasını ayağa kaldırmam gerekebiliyor.
Böyle bir ortamı, düşük sistem özelliklerine sahip bir bilgisayarda ayağa kaldıran geliştirici arkadaşların
bilgisayarlarında genellikle kod yazacak kadar bellek kalmıyor.
</div>


#### Önemli Bir CI (Continuous Integration, Sürekli Entegrasyon) Adımıdır

Sürekli Entegrasyon, veya İngilizcesi Continuous Integration, önemli bir yazılım geliştirme aracıdır.
Yazılımdaki her bir değişiklikte tüm sistemin build edilmesi 
ve herhangi bir şeyin bozulmadığının kontrol edilmesi amacıyla yapılır.
Bu işlem genellikle Jenkins gibi araçlar ile otomatize şekilde gerçekleştirilir.

![CI CD Pipeline](/assets/posts/cicd_pipeline_infograph.png){:width="800px"}

Unit testleri olmayan projelerde CI işlemi sadece projenin build olabildiğini, 
derleyici hatası içermediğini garanti edebilir.
Unit testleri olan projelerde ise derleme sonrasında test kodu otomatik olarak çalışacağından
aynı zamanda varolan fonksiyonalitenin bozulmadığı da anlaşılmış olur.

Biz ne kadar yazdığımız kod sonrası tüm testleri çalıştırıp kontrol ediyor olsak da,
kalabalık geliştirici ekiplerinde mutlaka bu kontrolü yapmadan 
doğrudan repository'ye kodu gönderecek olan arkadaşlar çıkacaktır.
Aynı şeyi baskı altında kaldığımda, acilen bir fix göndermem gerektiğinde, 
yoğun olduğumda vb. benim de yaptığım oluyor.
Bu gibi durumlarda daha ürünü paketleyip müşteriye teslim edemeden 
Jenkins'den gelen bir "Build Failed" e-postası ile yaptığımız değişikliğin bozduğu testleri görüyoruz. 


---

<a id="nasil-unit-test-yazmaliyiz"></a>
## 5. Nasıl Unit Test Yazmalıyız?

Bu bölümde unit testlerimizin kaliteli ve faydalı olması için takip etmemiz gereken birkaç kuralı birlikte inceleyelim.


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

Yazının başında da değindiğim Arrange-Act-Assert, kısaca AAA, tasarım şablonunu mümkün olduğunca uygulayalım.
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
* Javascript kodum `null`, `undefined`, `0`, `false` ve `""` arasındaki farkı ayırt edebliyor mu?
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
Test edilen kodun ortam bağımsız olması ile ilgili konuları aşağıda 
test edilebilir kod yazmak ile ilgili kısımda da inceleyeceğiz.

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
Bununla ilgili kullandığımız çözümü de ileriki başlıkta paylaşacağım.

---


<a id="test-edilebilir-yazilim"></a>
## 6. Unit Test Yazabilmek İçin Nasıl Yazılım Tasarlamalıyız?

Unit test yazmaya başlayıncaya kadar oldukça kaliteli kod yazdığımı zannederdim.
Artık yazamadığımı biliyorum.

Bir koda unit test yazamama durumu kodun yeteri kadar kaliteli olmadığını adeta bağıran bir durumdur.
Bu başlıkta yazılımı unit test yazılması zor veya imkansız hale getirebilecek 
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

Yazı bitti ama ben de bittim :)
Bu yazıdaki esas amacım unit test yazmak ile kaliteli kod yazmak arasında ne kadar çok bağlantı olduğunu göstermekti.
Umarım amacına ulaşır.

Bu konular kesin doğrusu olmayan ve tartışmaya çok açık konular olduğu için, ben de tartışma sevdiğim için,
fikir ayrılıklarına düştüğümüz noktalarda ya da hemfikir olduğumuz noktalarda lütfen yorumlarınızı esirgemeyin.

## Kaynaklar

Bu tür yazılar yazarken çok fazla başka yazı okurum genellikle.
Herkesten bir şeyler öğrenmeye çalışan birisiyim.
Bu sebeple iş yerinde gereksiz görülen konularda tartışmalar çıkartan bir yapım var.
Farklı görüşlerde olan insanların düşüncelerini dinlemeyi okumayı da severim.

Aşağıda bu yazıyı yazarken okuduğum diğer yazıların da linklerini paylaşıyorum.
Bizim sektörde bu tür tartışmaya açık, kesin doğrusu ve yanlışı olmayan bilgileri 
tek bir kaynaktan okuyarak öğrenmek doğru değil.
Vakit buldukça bu tür yazılar okumanızı tavsiye ederim.

1. [Unit Testing and the Arrange, Act and Assert (AAA) Pattern](https://medium.com/@pjbgf/title-testing-code-ocd-and-the-aaa-pattern-df453975ab80) - Paulo Gomes
1. [Unit Tests Aren't Tests](https://www.hillelwayne.com/unit-tests-are-not-tests/) - Hillel Wayne
1. [Smoke (Duman) Testi vs Sanity (Doğruluk) Testi](https://www.benimuhendisim.com/smoke-duman-testi-vs-sanity-dogruluk-testi/) - benimuhendisim
1. [Software Testing](https://en.wikipedia.org/wiki/Software_testing) - wikipedia
1. [Unit Tests, How to Write Testable Code and Why it Matters](https://www.toptal.com/qa/how-to-write-testable-code-and-why-it-matters) - Sergey Kolodiy
1. [Tests Granularity](https://www.innoq.com/en/blog/tests-granularity/) - Jacek Bilski & Torsten Mandry
1. [The Test Pyramid](https://betterprogramming.pub/the-test-pyramid-80d77535573) - Jessie Leung
1. [Getting Started With Gradle: Integration Testing](https://www.petrikainulainen.net/programming/gradle/getting-started-with-gradle-integration-testing/) - Petri Kainulainen
1. [The importance of unit testing, or how bugs found in time will save you money](https://fortegrp.com/the-importance-of-unit-testing/) - Oksana Mikhalchuk
1. [8 Benefits of Unit Testing](https://dzone.com/articles/top-8-benefits-of-unit-testing) - Ekaterina Novoseltseva
1. [Unit Testing Vs Functional Testing: A Guide On Why, What & How](https://www.zealousweb.com/unit-testing-vs-functional-testing-a-guide-on-why-what-how/) - Hiral Jadav
1. [10 Reasons Why Unit Testing Matters](https://www.codemag.com/Article/1901071/10-Reasons-Why-Unit-Testing-Matters) - John V. Petersen
1. [13 Tips for Writing Useful Unit Tests](https://betterprogramming.pub/13-tips-for-writing-useful-unit-tests-ca20706b5368) - Nick Hodges
1. [10 Tips to Writing Good Unit Tests](https://dzone.com/articles/10-tips-to-writing-good-unit-tests) - Grzegorz Ziemoński
1. [You Still Don’t Know How to Do Unit Testing (and Your Secret is Safe with Me)](https://stackify.com/unit-testing-basics-best-practices/) - Erik Dietrich
1. [Writing Clean Tests – Naming Matters](https://www.petrikainulainen.net/programming/testing/writing-clean-tests-naming-matters/) - Petri Kainulainen
1. [7 Popular Unit Test Naming Conventions](https://dzone.com/articles/7-popular-unit-test-naming) - Ajitesh Kumar
1. [TestDouble](https://www.martinfowler.com/bliki/TestDouble.html) - Martin Fowler
