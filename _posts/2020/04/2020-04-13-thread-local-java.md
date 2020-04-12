---
layout: post
title:  "Thread Local Nedir?"
date:   2020-04-13 00:50:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /2020/04/13/thread-local-nedir-java/
comments: true
post_identifier: thread-local-nedir-java
featured_image: /assets/category/java.png
---

Bu yazıda Java dünyasında sıkça kullanıldığına 
veya bahsedildiğine şahit olduğumuz `ThreadLocal` sınıfını inceleyeceğiz.
`ThreadLocal` sınıfı belirlediğimiz nesnelerin sadece aynı thread tarafından erişilebilir olmasını sağlar.
Bu sayede **thread safe** olmayan nesneleri **thread safe** kullanmış oluruz.
Bir `ThreadLocal` nesnesi içerisine yazdığımız nesne, 
`ThreadLocal`'e yazan thread tarafından çalıştırılan tüm methodlar tarafından okunabilir olacaktır.
Gelin bu güçlü aracı avantajları ve dezavantajları ile inceleyelim.

<!--more-->

İlk olarak `ThreadLocal` teknik olarak nedir ona bakalım.
Java'da her yaratılan `Thread` nesnesi içerisinde 
o *Thread*'e ait *ThreadLocal*'lerin tutulduğu bir map bulunmaktadır.
İki farklı thread aynı *ThreadLocal* nesnesine eriştikleri zaman,
ThreadLocal nesnesi değerini o an kendisine erişen thread'in içerisindeki *Map*'den okur veya yazar.
Bu sayede iki farklı *Thread* aynı ThreadLocal nesnesi üzerinden farklı değerlere ulaşırlar. 

### Nasıl Tanımlanmalı?

`new` anahtar kelimesi ile yarattığımız her bir yeni *ThreadLocal* nesnesi 
*Thread* içerisindeki Map'de farklı bir key olarak tutulmaktadır.
Bu sebeple belirli bir amaç için kullanacağımız `ThreadLocal` nesnesinin 
sadece tek bir instance'ının olduğundan emin olmalıyız.

Bunun en kolay yolu da `static final` olarak tanımlamaktır.
Bu sayede oluşturacağımız `ThreadLocal` nesnesinin aynı `ClassLoader` içerisinde 
sadece tek bir instance'ının olacağını garanti etmiş oluruz.

### Nasıl Kullanılır?

Bu kısımda `ThreadLocal` üzerindeki method ve constructor'ları inceleyelim.

#### Boş ThreadLocal Oluşturma

İçinde herhangi bir değer taşımayan (null value) bir ThreadLocal, doğrudan boş constructor kullanılarak üretilebilir. 
Bu ThreadLocal nesnesine erişen her bir Thread `get` methodundan `null` değerini alacaktır.

Bu yazıdaki örneklerde çoğunlukla Java'da thread-safe olmayan 
[SimpleDateFormat](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html) sınıfını
`ThreadLocal` içerisinde kullanacağım.

```java
private final static ThreadLocal<SimpleDateFormat> DATE_FORMAT_THREAD_LOCAL = new ThreadLocal<>();
```

#### ThreadLocal Değerini Atamak

Boş veya dolu fark etmeksizin bir ThreadLocal nesnesine `set` methodunu kullanarak yeni bir değer atayabilirsiniz.
Atadığınız değer sadece o değeri atadığınız Thread için geçerli olacaktır.
Diğer Thread'lerin atayacakları veya okuyacakları değerler tamamen mevcut Thread'inkinden bağımsız olacaktır.

```java
@Test
void shouldSetValueToThreadLocal() {
    final ThreadLocal<SimpleDateFormat> threadLocal = new ThreadLocal<>();
    threadLocal.set(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
}
```

#### ThreadLocal Değerini Okumak

Bir ThreadLocal üzerinde mevcut Thread için tutulmakta olan değeri almak için `get` methodu kullanılır.
Mevcut Thread tarafından değer atanmamış veya başlangıç değeri bulunmayan bir ThreadLocal üzerindeki 
`get` methodunu çağırmak `null` değerini dönecektir.

```java
@Test
void shouldSetAndGetThreadLocalValue() {
    final ThreadLocal<SimpleDateFormat> threadLocal = new ThreadLocal<>();

    SimpleDateFormat currentValue = threadLocal.get();
    assertNull(currentValue);

    final SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    threadLocal.set(simpleDateFormat);

    currentValue = threadLocal.get();
    assertNotNull(currentValue);
    assertSame(simpleDateFormat, currentValue);
}
```

#### Başlangıç Değeri ile Oluşturma

ThreadLocal nesneleri bir başlangıç değerine sahip olabilir. 
Bu durumda `set` çağırmadan `get` methodunu ilk kez çağıran her bir Thread belirlenen initialValue değerini alırlar.
Bu ilk değer her Thread için farklı olabileceği gibi aynı değer de verilebilir.
Bu kısım tamamen kullanıcıya kalmış.
Aşağıda başlangıç değeri ile bir ThreadLocal nesnesi oluşturmanın iki farklı yolunu görelim.

##### initialValue Methodunun Override Edilmesi

ThreadLocal sınıfı üzerinde bulunan `initialValue` methodunun görevi 
bir ThreadLocal nesnesi için ilk değerin üretilmesidir.
Bu method ThreadLocal sınıfı içerisinde `return null` şeklinde yazılmıştır.

Aşağıdaki şekilde `initialValue` methodunun override edildiği ThreadLocal'den extend eden
bir anonymous class yazarak kullanacağımız ThreadLocal için bir ilk değer belirleyebiliyoruz.

```java
@Test
void shouldGetInitialValueWhenInitialValueMethodIsOverridden() {
    final ThreadLocal<SimpleDateFormat> threadLocal = new ThreadLocal<SimpleDateFormat>() {
        @Override
        protected SimpleDateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }
    };

    final SimpleDateFormat currentValue = threadLocal.get();
    assertNotNull(currentValue);
    assertEquals("yyyy-MM-dd HH:mm:ss", currentValue.toPattern());
}
```

##### Static `withInitial` Methodu İle Başlangıç Değerinin Verilmesi

Java 8 ile birlikte gelen static `withInitial` methodunu kullanarak 
başlangıç değeri olan bir ThreadLocal nesnesi yaratabiliriz.

`initialValue` methodunu override ederken anonymous bir sınıf yaratmıştık.
Bu yöntemde ise ThreadLocal içerisinde tanımlı ThreadLocal'den extend eden
`SuppliedThreadLocal` isimli bir private inner class dönülüyor.

Bu method parametre olarak bir `Supplier` alıyor 
ve başlangıç değerine ihtiyacı olan her Thread tarafından bu Supplier çağırılıyor.

```java
@Test
void shouldGetInitialValueWhenThreadLocalIsConstructedUsingWithInitialMethod() {
    final ThreadLocal<SimpleDateFormat> threadLocal = ThreadLocal.withInitial(
            () -> new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));

    final SimpleDateFormat currentValue = threadLocal.get();
    assertNotNull(currentValue);
    assertEquals("yyyy-MM-dd HH:mm:ss", currentValue.toPattern());
}
```

#### ThreadLocal Değerinin Temizlenmesi

Bir ThreadLocal'e bir Thread tarafından atanan değer yine aynı Thread tarafından temizlenebilir.
Bu işlem `remove` methodu kullanılarak yapılır.

`remove` işlemi sonrası `get` methodu `null` dönecektir.

```java
@Test
void shouldRemoveThreadLocalValue() {
    final ThreadLocal<SimpleDateFormat> threadLocal = new ThreadLocal<>();

    final SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    threadLocal.set(simpleDateFormat);

    SimpleDateFormat currentValue = threadLocal.get();
    assertNotNull(currentValue);
    assertSame(simpleDateFormat, currentValue);

    threadLocal.remove();
    currentValue = threadLocal.get();
    assertNull(currentValue);
}
```


#### InheritableThreadLocal Sınıfı

Bu sınıf da bir ThreadLocal çeşidi olmakta olup, özelliği şudur:
Bu türdeki ThreadLocal'in üzerindeki mevcut Thread'e ait değer,
çocuk Thread'lere aktarılır.
Çocuk Thread nedir? Mevcut Thread tarafından oluşturulmuş Thread'ler, mevcut thread'in çocuklarıdır.

Aşağıdaki örnekte oluşturulan yeni Thread'de parent Thread'in ThreadLocal değerinin aktarıldığını görebiliyoruz.

```java
@Test
void inheritableThreadLocalShouldInheritValuesToChild() throws InterruptedException {
    final ThreadLocal<String> threadLocal = new InheritableThreadLocal<>();
    threadLocal.set("Demo Value");

    final AtomicReference<String> valueInThread = new AtomicReference<>();

    final Thread thread = new Thread(() -> {
        valueInThread.set(threadLocal.get());
    });

    thread.start();
    thread.join();

    assertEquals("Demo Value", valueInThread.get());
}
```


### Kullanım Alanları

Bir değerin bir Thread içerisinde her yerden ulaşılabilir olmasını isteyebileceğimiz
bir çok durumda ThreadLocal kullanılabilir. 
Gördüğüm birkaç örneği aşağıda paylaşıyorum.
Sizler de bildiğiniz ThreadLocal kullanım alanlarını yorum olarak paylaşabilirseniz
birlikte daha fazla şey öğrenebiliriz.


#### Kullanıcının Tanınması (Authentication)

Bir kullanıcının yaptığı işlem eğer sisteme girişinden çıkışına kadar 
hep aynı Thread içerisinde akışına devam ediyorsa,
kullanıcıya ait giriş bilgileri ThreadLocal üzerinde tutulabilir.

Mesela bir HTTP server uygulamasında 
kullanıcının Cookie'sinde gönderdiği bir bilgi okunup bir cache server 
veya veritabanı üzerinden kullanıcı bilgisi çekiliyorsa,
bu değer ThreadLocal üzerinde tutularak 
çağırılan tüm methodlar tarafından kullanıcı bilgisinin erişilebilir olması sağlanabilir.

Örnek olarak Spring Security bir takım filtreler kullanarak 
gelen HTTP isteğinin hangi kullanıcı tarafından yapıldığını anlar
ve `SecurityContextHolder` içerisine kullanıcı verisini yazar.
Bu sınıf varsayılan olarak ThreadLocal kullanmaktadır.
İstek Controller veya servis katmanlarımıza geldiğinde istersek `SecurityContextHolder` üzerinden
kullanıcı bilgisine static methodlar kullanarak ulaşabiliyoruz.


#### Thread-Safe Olmayan Sınıfların Singleton Gibi Kullanılması

Yeni nesnesinin oluşturulması pahalı olan sınıfları genellikle singleton yapmaya çalışıyoruz.
Fakat kullandığımız sınıf thread-safe değilse orada çuvallayabiliriz.
Birden fazla thread, thread-safe olmayan singleton bir nesneye eriştiğinde
bu nesnenin state'inde bir takım istenmeyen sonuçlar ortaya çıkabilir.

Bu durumda oluşturması maliyetli nesnemizi 
uygulama genelinde tek instance olan bir singleton olarak tanımlamak yerine,
her thread'de bir instance'ı olacak şekilde oluşturabiliriz.

Örnek olarak yukarıdaki örneklerde de kullandığım `SimpleDateFormat` sınıfını verebilirim.
Bu sınıf thread-safe olmadığı için global değişken olarak kullanılamıyor.
Onun yerine bu sınıfın ya her methodda yeni bir nesnesinin oluşturulması gerekiyor
ya da ThreadLocal üzerinde tutulması gerekiyor.


#### Bir İşlemi Başından Sonuna Kadar Takip Edebilmek

Eğer bir işlem başladığında ThreadLocal'e bir değer girersek ve bittiğinde o değeri silersek,
işlem boyunca aynı thread içerisinde olup biten tüm işlemlerde bu değeri görebiliriz.

Bu sayede bir method yapmakta olduğu işi hangi context içerisinde yaptığını bilmek isterse
ThreadLocal'den alabilir.

Örnek olarak logging kütüphanelerindeki MDC yapısı verilebilir.
MDC yapısını kullanarak bir işin başından sonuna kadar loglara aynı değerin yazılmasını sağlayabiliriz.
Örneğin sisteme gelen her istek için unique bir TransactionId üretiyoruz 
ve bu istek sırasında yazılan tüm loglarda bu TransactionId değerini görüyoruz.

MDC ile log takibi yapmak ile ilgili daha önce yazmış olduğum bir yazı için tıklayın:
[Slf4j: MDC Kullanarak Log Takibini Kolaylaştırma]({% post_url 2019/02/2019-02-13-slf4j-mdc-kullanarak-log-takibini-kolaylastirma %})  


### Dikkat!

Global değişken kullanmanın yazılımın tasarımı açısından kötü olduğu konusunda 
birçok yazılım geliştirici uzun zamandır hemfikir. 
ThreadLocal kavramı da global variable kavramına çok yakın olduğu için zorunlu kalınmadıkça kullanılmamalıdır.
Mümkün olduğunda ThreadLocal kullanmak yerine 
methodlara ilgili değerler parametre geçilebilir, 
cache kütüphaneleri kullanılabilir 
veya çeşitli dependency injection yöntemleri kullanılabilir.

Yazılım geliştirirken fark ettiğim problemlerden birisi de 
ThreadLocal kullanılan sınıfların unit testini yazmanın
dependency injection ile yazılmış sınıfların testini yazmaktan daha zor olduğudur.

Ayrıca ThreadLocal'lerin kullanıldıkları context'lere göre
dikkat edilmesi gereken bazı hususlar ortaya çıkmaktadır.

Bunlardan en yaygınları memory leak'ler 
ve yanlış değerlerin yanlış Thread'lerde bulunması durumlarıdır.

Öncelikle memory leak oluşma durumuna bir bakalım.

#### ClassLoader Leak

Application Server dediğimiz tomcat, weblogic ve jboss gibi uygulamalara 
birden fazla farklı uygulamayı yükleyebiliyoruz.
Application Server'lar kendileri de bir java process'i olduğu için 
bir Application Server'a yüklediğimiz tüm bu uygulamalar tek bir JVM içerisinde çalışıyorlar.

Application Server ise uygulamaların arasındaki ayrımı sağlayabilmek için 
hepsine ayrı ClassLoader nesnesi yaratır. 
Bu uygulamalar ve onların bağımlı olduğu kütüphaneler bu ClassLoader tarafından JVM'e yüklenir.

Belirli bir uygulamayı kapatıp açarken veya yeni bir versiyonunu canlıya alırken
Application Server ilgili uygulamayı kapatır 
ve bağlı olduğu ClassLoader da Garbage Collector tarafından yok edilir.

Application Server'larda gelen HTTP istekleri işlemek için kullandığı bir Thread Pool bulunur.
Bu ThreadPool'daki Thread'ler genellikle Application Server ayakta olduğu sürece yaşarlar.
Eğer Application Server'a yüklü bir uygulama HTTP isteğini yorumlarken ThreadLocal'e bir şey yazarsa 
ve bu isteğe cevap verirken ThreadLocal'e yazdığı değerleri silmezse 
bu değer Application Server'a ait olan Thread'in üzerinde kalır.

Application Server üzerindeki bir uygulamayı kapatırken eğer Application Server'ın ThreadLocal'i üzerinde
kapatılmakta olan uygulanın ClassLoader'ı tarafından JVM'e yüklenmiş bir sınıfa ait bir nesne kaldıysa,
bu nesne tüm ClassLoader'ın Garbage Collector tarafından silinmesini engeller.
Bir ClassLoader belki binlerce sınıfı memory'ye yükleyeceği için Garbage Collect olmaması çok büyük problemdir.
Uygulama Application Server üzerinde tekrar ayağa kaldırılırken yepyeni bir ClassLoader oluşturulur
ve yeniden tüm class'lar load edilir.
Bu şekilde uygulamalar aç/kapa yaptıkça Application Server üzerinde ClassLoader'lar birikecektir
ve nihayetinde `java.lang.OutOfMemoryError: PermGen space` hatası alınacaktır.
Bu noktadan sonra artık Application Server'ın restart edilmesi gerekecektir.

Eğer Application Server Thread'lerinin üzerine bir ThreadLocal yazılıyorsa
bunun iş biterken silindiğinden emin olunması gerekir. 

Bu sebeple ThreadLocal yazıldıktan sonraki işlem `try/finally` bloğu ile yazılmalı.
Ben aşağıdaki gibi yazıyorum genellikle:

```java
public static final ThreadLocal<UserContext> USER_CONTEXT_THREAD_LOCAL = new ThreadLocal<>();

@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
  throws IOException, ServletException {
  
  try {
    final UserContext userContext = new UserContext();
    // do some work to fill userContext...
    // other stuff...
    // things...
    USER_CONTEXT_THREAD_LOCAL.set(userContext);
    chain.doFilter(request, response);
  } finally {
    USER_CONTEXT_THREAD_LOCAL.remove();
  }
}
```


#### ThreadLocal Değerinin İstenmeyen Yerlere Gitmesi

Yukarıdaki ClassLoader leak konusuna çok benziyor. 
Eğer bir ThreadLocal set ediyorsak çok büyük ihtimalle aynı method içerisinde onu silme fırsatımız olacaktır.

Örneğin bir ExecutorService kullanıyorsak ve ona çalıştırması için verdiğimiz Runnable sınıfında ThreadLocal
kullanımı yapıyorsak, aynı Runnable içerisinde bu ThreadLocal'i silmeliyiz.
Yoksa ExecutorService aynı thread'leri kullanarak başka işleri de koşacağı için 
ThreadLocal'e set ettiğimiz değer alakasız başka işler tarafından erişilebilir olacaktır.

Aynı zamanda executorService'e submit ettiğimiz Runnable ayrı bir thread tarafından çalıştırılacağı için,
`executorService.submit()` methodunu çağırdığımız thread'deki ThreadLocal'leri görmeyecektir.

Aşağıdaki kodda executorService'e bir task verilmeden önce oradaki iş parçacığı ile paylaşmak istediğimiz
ThreadLocal değeri önce bir değişkene aktarılıyor.
Daha sonra executorService'in içerisinde işi çalıştıran Thread'in ThreadLocal'ine tekrar set ediliyor.
Daha önemlisi, executorService'deki işimiz bittiğinde `finally` bloğu içerisinde ThreadLocal'i tekrar temizliyoruz.
Bu sayede ExecutorService tarafından yapılan diğer işlere fazladan bilgi vermemiş oluyoruz.

```java
private void executeBatchTask() {
    final UserContext userContext = USER_CONTEXT_THREAD_LOCAL.get();
    
    executorService.submit(() -> {
        try {
            USER_CONTEXT_THREAD_LOCAL.set(userContext);
            // Do work in executor thread 
        } finally {
            USER_CONTEXT_THREAD_LOCAL.remove();
        }
    });
}
```


### Bitiriyoruz

ThreadLocal hakkında söylenebilecek her şey bu kadar değildir elbette.
Elimden geldiğince hakkında bildiklerimi anlatmaya çalıştım.

Her ne kadar hatalı kullandığımız bir ThreadLocal ile production sistemlerinde başımızı belaya sokabilecek olsak da,
meşhur büyüğümüz [Joshua Bloch](https://en.wikipedia.org/wiki/Joshua_Bloch) array ile de bunu yapabilirsiniz demiş :)

Bu sebeple Joshua Bloch'un bu konudaki aşağıdaki meşhur alıntısıyla bitiriyorum: 

> “Can you cause unintended object retention with thread locals? 
> Sure you can. 
> But you can do this with arrays too. 
> That doesn’t mean that thread locals (or arrays) are bad things. 
> Merely that you have to use them with some care. 
> The use of thread pools demands extreme care. 
> Sloppy use of thread pools in combination with sloppy use of thread locals can cause unintended object retention, 
> as has been noted in many places. 
> But placing the blame on thread locals is unwarranted.” 
>     - Joshua Bloch

### Kaynaklar

* <https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadLocal.html>
* <https://docs.oracle.com/javase/8/docs/api/java/lang/InheritableThreadLocal.html>
* <http://tutorials.jenkov.com/java-concurrency/threadlocal.html>
* <https://www.baeldung.com/java-threadlocal>
* <https://stackoverflow.com/questions/40079616/what-is-classloader-leak>
* <https://stackoverflow.com/questions/817856/when-and-how-should-i-use-a-threadlocal-variable>
* <https://stackoverflow.com/questions/17008906/what-is-the-use-and-need-of-thread-local>
* <https://plumbr.io/blog/locked-threads/how-to-shoot-yourself-in-foot-with-threadlocals>
