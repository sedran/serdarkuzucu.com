---
layout: post
title:  "Thread Mantığı, Java Örnekleri"
date:   2011-11-05 08:05:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /thread-mantigi-java-ornekleri/
comments: true
post_identifier: thread-mantigi-java-ornekleri
featured_image: /assets/category/java.png
---

Thread programlamada iş parçacığı anlamına gelen bir kavram.
Bir programın içerisinde aynı anda yapılması gereken birden fazla iş olduğu zaman 
Thread kullanmak artık Allah'ın emri olur. 
Mesela bir örnek verelim: 
Bir sohbet programı düşünün, msn, gtalk, skype, ya da her ne haltsa. 
Bu programda iki temel işlem vardır aynı anda yürüyen. 
Aslında onlarca farklı işlem vardır da iki tanesi çok önemlidir:

<!--more-->

1. Kullanıcının birşey yazıp göndermesini beklemek
2. Karşıdaki diğer kullanıcının birşey gönderip göndermediğini dinlemek

Bu iki işi bilgisayarın aynı anda yapması gerekir.
Yoksa bizim anlık ileti programı olarak kullandığımız programlar "anlık" ifadesini kaybeder.

Aslında bir işlemcide iki iş aynı anda yürümez.
Bunu bilgisayar bilen birçok kişi bilir.
İşlemci, işleri parçalara böler, biraz birisinden, biraz birisinden yapar.
Ama işlemler arası atlamaları çok hızlı ve kısa sürede yaptığı için 
biz aciz kullanıcılara işlemler aynı anda yapılıyor izlenimi verir. 
Thread'ler de böyledir. 
Yukarıda verdiğim örnekte, 
işlemci çok hızlı bir şekilde biraz kendi kullanıcısını, 
biraz da karşıdaki kullanıcıyı dinler.

##### Sleep Methodu?

Sleep methodu sayesinde bir Thread'i belirli bir zaman bekletebiliyoruz.
Böylelikle işlemci o süre içerisinde o Thread'i işlemeyi bırakıyor ve başka işlemler ile uğraşıyor.
Bu daha çok zamanlamalı programlarda/oyunlarda kullanılıyor sanırsam, yani ben öyle yapıyorum.
Örneğin bir programımız var ve bu program normal bir şekilde işlerken
biz sağ üst köşesinde falan dijital bir saat göstermek istiyoruz. 
O zaman oraya eklediğimiz dijital saat arayüzünün her 1000 milisaniyede(1 saniye) bir 
yenilenmesi gerekiyor ki zaman sürekli ilerlesin.

Saati her saniye *saat:dakika:saniye* şeklinde konsola yazdıran 
basit bir java uygulaması görmek için aşağıdaki kodu inceleyebilirsiniz:

```java
package sedran;
// Package ile ilgili hata alırsanız sadece üstteki satırı silmeniz yeterli.

/**
 * Saat tutan, her geçen saniye saati ekrana yazan uygulama.
 * @author Serdar KUZUCU
 * https://serdarkuzucu.com
 */
public class ClockApp {
  
  public static void main(String a[]) {
    new ClockApp();
  }
  
  public ClockApp() {
    Clock c = new Clock(); // Thread yaratıldı fakat başlatılmadı.
    c.start(); // Thread'i başlatır.
  }
  
  private static class Clock extends Thread {
    private int sn=0, dk=0, saat=0;
    
    /**
     * Bu saate bir saniye ekleyen method. Bu method her çağırıldığında
     * saate bir saniye eklenir ve saniye ve dakika 60'a bölünerek
     * çıkan sonuçları... Ne olduğunu biliyosunuz artık bunun :)
     */
    private void timeIncrement() {
      sn++;
      if(sn/60 > 0) {
        dk += sn/60;
        sn %=60;
      }
      if(dk/60 > 0) {
        saat += dk/60;
        dk %= 60; 
      }
    }
    
    /**
     * Thread start() edildiğinde çağırılan method.
     * Thread program kapatılana kadar hiç bitmesin diyorsanız, bu methodun
     * içerisinde bir sonsuz döngü ayarlamanız gerekiyor.
     */
    public void run() {
      while(true) { // Sonsuz döngümüz.
        try {
          Thread.sleep(1000); // Thread'i 1 saniye beklet.
          timeIncrement(); // Sonra saate bir saniye ekle.
          System.out.println(this); // Saati yazdır.
        } catch (InterruptedException e) {
          e.printStackTrace(); // Thread'i uyutmaya çalışırken hata olması durumunda...
        }
      }
    }
    
    /**
     * Clock class'ının System.out.println() methoduna
     * parametre olarak atanması durumunda çağırılan method.
     * Clock class'ından dijital saat dizaynında bir String üretir.
     */
    public String toString() {
      String a = (saat/10 == 0) ? "0" + saat : ""+saat;
      a += ":" + ((dk/10 == 0) ? "0" + dk : ""+dk);
      a += ":" + ((sn/10 == 0) ? "0" + sn : ""+sn);
      return a;
    }
  }
}
```

Şimdi bunu Thread kullanmadan da yazarım diyenler vardır mutlaka.
Yazarsınız tabi, ehe. 
Yukarıdaki örnek kodda ben tek Thread kullandım çünkü amacım orada sleep komutunu göstermekti. 
O saati Thread içerisinde arttırıp ekrana yazdırdık değil mi? 
Peki niye? 
Çünkü eğer biz main fonksiyonunun içerisinde başka işlemler yapıyor olsaydık, 
bu işlemleri yapmak için Thread'in bitmesini beklemek zorunda kalmayacaktık. 
Hepsi eş zamanlı olarak yürütülecekti. 
Bu arada Thread de sonsuz döngü içerdiği için bitmiyor zaten, hehe.

Şimdi işleri komplikeleştirmek için az önceki saat uygulamamızda ikinci bir Thread açalım 
ve o da her 3 saniyede bir ekrana "Sedran - serdarkuzucu.com" tarzı birşey yazsın. 
Çift Thread ile çalıştığımız zaman hem her saniye ekrana saatin yazıldığını, 
hem de her 3 saniyede bir ekrana diğer şeyin yazıldığını göreceksiniz. 
Görelim, kodumuz aşağıda:

```java
package sedran;

/**
 * Saat tutan, her geçen saniye saati ekrana yazan uygulama.
 * Ek olarak, her 3 saniyede bir ekrana "Sedran - serdarkuzucu.com" yazdırır.
 * @author Serdar KUZUCU
 * https://serdarkuzucu.com
 */
public class ClockApp {
  
  public static void main(String a[]) {
    new ClockApp();
  }
  
  public ClockApp() {
    Clock c = new Clock(); // Saat Thread'i yaratıldı fakat henüz başlatılmadı.
    SedranWriter s = new SedranWriter(); // Başka bir Thread yaratıldı. 
    c.start(); // Saat Thread'i başlatıldı.
    s.start(); // Diğer Thread de başlatıldı.
  }
  
  /**
   * Her 3 saniyede bir ekrana birşey yazdıran Thread.
   */
  private static class SedranWriter extends Thread {
    /**
     * Unutmayalım, Thread'i extend ettiğimiz zaman run methodu yazmamız gerekir.
     * Çünkü bir Thread start() edildiğinde run() methodunu çağırır.
     */
    public void run() {
      while(true) {
        try {
          Thread.sleep(3000);
          System.out.println("Sedran - serdarkuzucu.com");
        } catch(InterruptedException e) {
          e.printStackTrace(); // Thread'i uyutmaya çalışırken hata olması durumunda...
        }
      }
    }
  }
  
  /**
   * Saat Thread'i. Her saniye saati günceller ve ekrana yazdırır.
   */
  private static class Clock extends Thread {
    private int sn=0, dk=0, saat=0;
    
    /**
     * Bu saate bir saniye ekleyen method. Bu method her çağırıldığında
     * saate bir saniye eklenir ve saniye ve dakika 60'a bölünerek
     * çıkan sonuçları... Ne olduğunu biliyosunuz artık bunun :)
     */
    private void timeIncrement() {
      sn++;
      if(sn/60 > 0) {
        dk += sn/60;
        sn %=60;
      }
      if(dk/60 > 0) {
        saat += dk/60;
        dk %= 60; 
      }
    }
    
    /**
     * Thread start() edildiğinde çağırılan method.
     * Thread program kapatılana kadar hiç bitmesin diyorsanız, bu methodun
     * içerisinde bir sonsuz döngü ayarlamanız gerekiyor.
     */
    public void run() {
      while(true) { // Sonsuz döngümüz.
        try {
          Thread.sleep(1000); // Thread'i 1 saniye beklet.
          timeIncrement(); // Sonra saate bir saniye ekle.
          System.out.println(this); // Saati yazdır.
        } catch (InterruptedException e) {
          e.printStackTrace(); // Thread'i uyutmaya çalışırken hata olması durumunda...
        }
      }
    }
    
    /**
     * Clock class'ının System.out.println() methoduna
     * parametre olarak atanması durumunda çağırılan method.
     * Clock class'ından dijital saat dizaynında bir String üretir.
     */
    public String toString() {
      String a = (saat/10 == 0) ? "0" + saat : ""+saat;
      a += ":" + ((dk/10 == 0) ? "0" + dk : ""+dk);
      a += ":" + ((sn/10 == 0) ? "0" + sn : ""+sn);
      return a;
    }
  }
}
```

Bu programı bir süre çalıştırdığımızda ekranda şunların yazdığını görüyoruz:

```text
00:00:01
00:00:02
Sedran - serdarkuzucu.com
00:00:03
00:00:04
00:00:05
Sedran - serdarkuzucu.com
00:00:06
00:00:07
00:00:08
Sedran - serdarkuzucu.com
00:00:09
00:00:10
00:00:11
Sedran - serdarkuzucu.com
00:00:12
```

Bu da bu iki işlemin birbirini beklemediğini,
sadece bizim onlara bekle dediğimiz zamanı beklediklerini gösteriyor.

Şimdilik bu kadar.
Thread'ler ile ilgili incelemelerim devam edecek.
Beni bırakmayın.
