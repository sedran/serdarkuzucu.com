---
layout: post
title: "Unit Test 01: Unit Test Nedir?"
date: 2021-05-18 02:51:25 +0300
categories: [Java, Programlama, Unit Test]
author: Serdar Kuzucu
permalink: /2021/05/18/unit-test-nedir/
comments: true
post_identifier: unit-test-nedir
featured_image: /assets/category/unit-test.png
series: "Unit Test"
references:
  - url: "https://medium.com/@pjbgf/title-testing-code-ocd-and-the-aaa-pattern-df453975ab80"
    title: "Unit Testing and the Arrange, Act and Assert (AAA) Pattern"
    author: "Paulo Gomes"
    
  - url: "https://www.toptal.com/qa/how-to-write-testable-code-and-why-it-matters"
    title: "Unit Tests, How to Write Testable Code and Why it Matters"
    author: "Sergey Kolodiy"
    
  - url: "https://en.wikipedia.org/wiki/Software_testing"
    title: "Software Testing"
    author: "wikipedia"
    
  - url: "https://dzone.com/articles/best-java-unit-testing-frameworks"
    title: "Best Java Unit Testing Frameworks"
    author: "Ranga Karanam"

  - url: "https://www.lambdatest.com/blog/top-10-java-testing-frameworks/"
    title: "Top 10 Java Unit Testing Frameworks for 2021"
    author: "Praveen Mishra"
---

Yazılımcılar ikiye ayrılır. Unit test yazanlar ve unit test yazmayanlar.
Bazen vakit yok deriz, bazen zor gelir, bazen proje/kod test yazmaya uygun değil deriz.
Unit test yazmak istemediğimizde bu saydıklarım gibi çok fazla miktarda bahaneler üretebiliriz
ve üretebileceğimiz bahanelerin de hemen hemen hepsini daha önce başkalarından da duymuşuzdur.
Bu yazı dizisinde unit test konusu ile ilgili birçok soruya cevaplar arayarak 
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

Unit test yazmak üzerine hazırladığım bu yazı dizisini aslında *17 Mayıs 2021* tarihinde
tek bir yazı olarak yayınlamıştım fakat geri bildirim amacıyla ön gösterim olarak paylaştığım 
birkaç iş arkadaşımdan ve eşimden "çok uzun olmuş kimse sonuna kadar okumaz" 
geri bildirimini aldığım için parçalara böldüm. 
Parçalara böldükçe parçalarda girebildiğim detay miktarı da arttı bu sayede.
Umarım siz de okurken benim yazarken aldığım keyfi alırsınız.

Yazı dizimizin bu ilk yazısında "Unit Test Nedir?" sorusunu cevaplayarak hızlı bir giriş yapacağız.
Daha detaylı ve daha keyifli konular sonraki yazılarda bizleri bekliyor olacak.

---

## Unit Test Nedir?
<a id="unit-test-nedir"></a>

Unit test uygulamamızın küçük bir parçasını 
uygulamanın geri kalanından bağımsız bir şekilde çalıştırarak
bu parçanın davranışını doğrulayan bir metoddur.

Unit test yazdığımız kodun davranışını yine kod yazarak doğrulamamızı sağlar.
Yazılan bu test kodları, canlıya çıkacak olan production kodları ile aynı projede farklı bir klasörde tutulur.
Örneğin çoğu Java projesinde genellikle `src/main/java` klasöründe production kodları bulunurken,
`src/test/java` klasöründe ise unit test kodları bulunur.

Unit testler production build sırasında kullandığımız **maven**, **gradle**, vb. build araçları tarafından
varsayılan olarak çalıştırılırlar.
Testlerde oluşacak herhangi bir hatada build işlemi hata verir ve tamamlanmaz.
Build tamamlandıktan sonra üretilmiş olan son çıktıda ise test kodu bulunmaz.
Yani canlı ortama (production) test kodu çıkmamış olur.

Test kodları genellikle bir test framework aracılığıyla çalıştırılır.
Hangi test framework'ünün kullanılacağı projedeki önemli bir karardır.
Yazılan test kodları bu test framework'ünün sağladığı özelliklere oldukça bağımlıdır.
Okuduğum çoğu yazıda en popüler unit test framework listesinde 
[JUnit](https://junit.org/){:target="_blank"} ve [TestNG](https://testng.org/){:target="_blank"} başı çekmekte.
Ben de bu yazıdaki örneklerde (ve kişisel hayatım ile iş hayatımda) **JUnit** kullanıyor olacağım.

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

Aşağıdaki gibi pencere ve ışık kaynaklarından oluşan bir oda (Room) sınıfı hayal edelim:

```java
public class Room {
    private final List<Window> windows;
    private final List<LightSource> lightSources;

    public Room(List<Window> windows, List<LightSource> lightSources) {
        this.windows = windows;
        this.lightSources = lightSources;
    }

    public boolean toggleLightSource(int switchNo) {
        if (switchNo < 0 || switchNo >= lightSources.size()) {
            throw new IllegalArgumentException("Invalid switch no: " + switchNo
                    + ", number of light sources: " + lightSources.size());
        }
        final var lightSource = lightSources.get(switchNo);
        return lightSource.toggle();
    }

    public int getOpenWindowCount() {
        return (int) windows.stream()
                .filter(Window::isOpen)
                .count();
    }
}
```

Bu sınıfın `getOpenWindowCount` metodu için basit bir 
state-based unit test örneği yazmak istersek aşağıdaki gibi bir örnek olabilir:

```java
@Test
void getOpenWindowCount_twoWindowsAreOpen_returnsTwo() {
    final var window1 = Mockito.mock(Window.class);
    final var window2 = Mockito.mock(Window.class);
    final var window3 = Mockito.mock(Window.class);
    final var lightSource = Mockito.mock(LightSource.class);
    Mockito.doReturn(true).when(window1).isOpen();
    Mockito.doReturn(false).when(window2).isOpen();
    Mockito.doReturn(true).when(window3).isOpen();
    final var room = new Room(List.of(window1, window2, window3), List.of(lightSource));

    final var openWindowCount = room.getOpenWindowCount();

    assertEquals(2, openWindowCount);
}
```

Bu metodda asıl önemli olan yaptığı hesaplama ve döndüğü değer olduğu için 
happy-path testinde bu şekilde ilerlemek doğru görünüyor.

Bu sınıftaki `toggleLightSource` metodunda ise odadaki spesifik bir ışığı yakmayı hedefliyoruz. 
Işığın yanmasına dair asıl sorumluluk ise `LightSource` sınıfında olduğundan, 
esas test etmek istediğimiz doğru `LightSource` nesnesinin üzerindeki `toggle` methodunun tetiklendiğini görmek.
Burada `Room` ile `LightSource` sınıfları arasındaki etkileşimi test etmeye çalışıyoruz.
Bu da bir interaction-based unit test olacaktır ve aşağıdaki gibi bir örnek verebiliriz:

```java
@Test
void toggleLightSource_validSwitchNo_callsToggleMethod() {
    final var window = Mockito.mock(Window.class);
    final var firstLightSource = Mockito.mock(LightSource.class);
    final var secondLightSource = Mockito.mock(LightSource.class);
    final var room = new Room(List.of(window), List.of(firstLightSource, secondLightSource));
    Mockito.doReturn(true).when(secondLightSource).toggle();

    room.toggleLightSource(1);

    Mockito.verify(secondLightSource, Mockito.times(1)).toggle();
}
```


## Sonuç

Bu yazımızda unit test nedir basit bir giriş yapmış olduk.
Unit test ile ilgili yazı dizisinin ilerleyen başlıklarında daha konuşacak birçok konumuz olacak.

Bir sonraki yazıda diğer test çeşitlerinden ve unit testi diğerlerinden ayıran özellikleri inceleyeceğiz.

