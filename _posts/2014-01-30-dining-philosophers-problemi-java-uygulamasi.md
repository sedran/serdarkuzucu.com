---
layout: post
title:  "Dining Philosophers Problemi Java Uygulaması"
date:   2014-01-30 16:03:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /dining-philosophers-problemi-java-uygulamasi
comments: true
post_identifier: dining-philosophers-problemi-java-uygulamasi
featured_image: /assets/posts/dining-philosophers-sm.png
---

Hayatımda hiç deadlock ile karşılaşmamış birisi olarak Java'da deadlock yakalamaya heves ettim.
Bunu en güzel ve eğlenceli şekilde nasıl yaparım diye düşünürken Dining Philosophers Problem geldi aklıma.
Basit bir Java kodu ile problemi yaratmayı başardım.

<!--more-->

Dining Philosophers problem,
Türkçe söylemek gerekirse Makarna yiyen düşünürler problemi 
(benim suçum değil wikipedia'de bu şekilde yer alıyor), 
bilgisayar dünyasında paralellik, eşzamanlılık ve işlemler (prosesler) konusu anlatılırken 
sık sık örnek olarak gösterilen bir problem. 
Kısaca açıklamak gerekirse:

5 filozof yuvarlak bir masa etrafında oturmuş makarna yiyecekler.
Her filozofun bir tane sağında ve bir tane solunda çatal var 
ve iki çatala da sahip olmadan kimse makarna yemeğe başlayamıyor. 
Bu yüzden ortada çatal kapmak için bir rekabet dönüyor. 
Bir çatalı bir filozof kullanırken diğer filozof kullanamayacağı için de 
çatalı alamayan filozof o diğer filozofun o çatalı bırakmasını bekliyor.

![Dining Philosophers](/assets/posts/dining-philosophers-lg.png){:width="500px"}

İşte deadlock bu sebeple ortaya çıkıyor.
Bu sahneyi programatik olarak canlandırdığımızda,
her filozof önce soldaki çatalı almak için hamlesini yapıyor.
Sol tarafındaki çatalı kapan filozoflar bu sefer sağ taraflarındaki çatallara yöneliyorlar.
Fakat o çatal da sağ tarafındaki arkadaşının solundaki çatal olduğu için çoktan tutulmuş oluyor.
Bu durumda her filozof eline bir çatal almış oluyor
ve hiçbirisi ikinci çatalı alamadığı için sistemdeki prosesler sonsuz beklemeye giriyor.
Buna da deadlock deniyor.

Bunun için yazdığım örnek koda bakalım şimdi.
Philosopher sınıfını yarattım önce.
Kendi başına ayrı bir thread olarak çalışabilmesi için Thread sınıfını extend edecek şekilde tasarladım.
Yaptığı iş sırasıyla çatalları almak, yemek yemek, çatalları bırakmak ve düşünmek.

```java
package com.asosyalbebe.deadlock;

public class Philosopher extends Thread implements Runnable {
    private int forkLeft;
    private int forkRight;
    private int index;

    public Philosopher(int index) {
        forkLeft = index;
        forkRight = (index + 1) % 5;
        this.index = index;
    }

    @Override
    public void run() {
        // Endless life of a philosopher
        while (true) {
            takeForks();
            eat();
            putDownForks();
            think();
        }
    }

    /**
     * Take left and right forks
     */
    private void takeForks() {
        System.out.printf("Filozof#%d is taking forks\n", index);
        Table.takeFork(forkLeft);
        System.out.printf("Filozof#%d took fork at left\n", index);
        Table.takeFork(forkRight);
        System.out.printf("Filozof#%d took fork at right\n", index);
    }

    /**
     * Put left and right forks down
     */
    private void putDownForks() {
        System.out.printf("Filozof#%d is putting forks down\n", index);
        Table.putDownFork(forkLeft);
        System.out.printf("Filozof#%d put left fork down\n", index);
        Table.putDownFork(forkRight);
        System.out.printf("Filozof#%d put right fork down\n", index);
    }

    /**
     * Eat for a while
     */
    private void eat() {
        System.out.printf("Filozof#%d is now eating\n", index);
        sleep();
    }

    /**
     * think for a while
     */
    private void think() {
        System.out.printf("Filozof#%d is now thinking\n", index);
        sleep();
    }

    private void sleep() {
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

Daha sonra da Table sınıfını oluşturdum.
main methodu da bu sınıfta tanımladım.
Burada da filozofları yaratıp hepsini ayrı thread olarak başlatıyoruz.
Ayrıca çatalları da bu sınıf içerisinde yaratıyoruz ve filozoflar istediği zaman bu sınıftan istiyorlar.
Lock/unlock mekanizması da bu sınıf içerisinde bulunuyor o yüzden.

```java
package com.asosyalbebe.deadlock;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Table {
    public static Lock[] forks;
    public static Philosopher[] philosophers;

    public static void main(String[] args) {
        philosophers = new Philosopher[5];
        forks = new Lock[5];

        for (int i = 0; i < philosophers.length; i++) {
            philosophers[i] = new Philosopher(i);
            forks[i] = new ReentrantLock();
        }

        for (int i = 0; i < philosophers.length; i++) {
            philosophers[i].start();
        }
    }

    /**
     * Locks a fork with given index
     * @param fork index of the fork
     */
    public static void takeFork(int fork) {
        forks[fork].lock();
    }

    /**
     * unlocks a fork with given index
     * @param fork index of the fork
     */
    public static void putDownFork(int fork) {
        forks[fork].unlock();
    }
}
```

Deadlock'lar genelde her zaman olmaz.
Bu programı da çalıştırdığınız zaman düzgün bir şekilde çalışabilir.
Genellikle bir kaç kere programı kapatıp açtıktan sonra güzel bir deadlock yakalayabiliyorum.
İşte deadlock olduğu bir anın konsol çıktısı:

```text
Filozof#2 is taking forks
Filozof#1 is taking forks
Filozof#4 is taking forks
Filozof#0 is taking forks
Filozof#0 took fork at left
Filozof#3 is taking forks
Filozof#4 took fork at left
Filozof#1 took fork at left
Filozof#2 took fork at left
Filozof#3 took fork at left
```

Çıktıdan da görebileceğimiz üzere, 
önce tüm filozoflar soldaki çatalı alıyor.
Daha sonra da program hiçbir şey yapamaz hale geliyor.
Çünkü program bu noktaya geldikten sonra 
tüm filozoflar diğer çatalın boşa çıkmasını bekler durumda kalıyorlar.

Bu yazıyı kısa tutuyorum şimdilik.
İlerde başka bir yazıda çözümüne de değinebilirim bu konunun.
Şimdilik esen kalın.

### Kaynaklar:
* [Wikipedia: Makarna yiyen düşünürler sorunu](http://tr.wikipedia.org/wiki/Makarna_yiyen_d%C3%BC%C5%9F%C3%BCn%C3%BCrler_sorunu)
* [Wikipedia: Dining philosophers problem](http://en.wikipedia.org/wiki/Dining_philosophers_problem)

