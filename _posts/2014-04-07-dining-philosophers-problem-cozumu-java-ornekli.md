---
layout: post
title:  "Dining Philosophers Problem Çözümü - Java Örnekli"
date:   2014-04-07 16:55:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /dining-philosophers-problem-cozumu-java-ornekli
comments: true
post_identifier: dining-philosophers-problem-cozumu-java-ornekli
featured_image: /assets/posts/dining-philosophers-sm.png
---

Merhaba sevgili arkadaşlar.
Yaklaşık 2 ay önce [Dining Philosophers Problemine](/dining-philosophers-problemi-java-uygulamasi) değinmiş, 
örnek bir Java uygulamasıyla kolayca sistemi deadlock'a sokabilmiştik.
Sorunu yaratmış, fakat çözmeden bırakmıştık.
2 aydır yoğun tempoda çalıştığım için tekrar blog yazmaya fırsat bulamadım.
Şimdi basit bir yöntemle ve örnek kodlarla bu sorunun nasıl çözüleceğine odaklanacağız.

<!--more-->

![Dining Philosophers](/assets/posts/dining-philosophers-lg.png){:width="500px"}

Öncelikle sorunu tekrar hatırlayalım.
Yuvarlak bir masa etrafında oturan 5 filozofumuz ve hepsinin önünde birer tabak makarnamız var.
Ayrıca her filozofun arasında bir tane olcak şekilde, 5 tane de çatalımız var.
Bir filozofun makarna yiyebilmesi için hem solundaki hem de sağındaki çatala sahip olması gerekiyor.
Günlük hayatta bir problem yaşanmayacak gibi görünse de, programatik olarak çok tehlikeli bir durum ortaya çıkıyor.
Eğer tüm filozoflar önce sol taraflarındaki çatalları alıp sonra sağ taraftaki çatallara ulaşmaya çalışırlarsa,
sağ taraflarındaki çatallar alınmış olduğu için sistem deadlock'a giriyor.

Şimdi bu sorunu nasıl çözebiliyoruz buna bakalım.
Bu problem çok bilindik bir problem olduğu için, literatürde birçok bilinen çözüm mevcut.
Ben bu yazıda şu yöntemi tercih ettim:

* Tüm filozoflar önce sol taraflarındaki çatala uzanırlar.
* Sol tarafındaki çatalı alamayan filozoflar sağ taraflarındaki çatala uzanmazlar 
ve bir süreliğine düşünürler(boş boş beklerler).
* Sol tarafındaki çatalı alabilen filozoflar sağ tarafındaki çatala uzanır.
* Sağ tarafındaki çatalı alabilen filozoflar yemek yemeye başlar.
* Sağ tarafındaki çatalı alamayan filozoflar sol tarafındaki çatalı da bırakırlar 
ve bir süreliğine düşünürler(boş boş beklerler).
* Bir süreliğine yemek yiyen filozoflar çatalı bırakır.

Normal lock mekanizması, bir kaynağı alabilene kadar mevcut thread'i kilitler.
Bu durumda, sağ çatal için lock methodu çağırdığımızda,
eğer sağ çatalı başkası almışsa,
biz vazgeçip sol çatalı bırakma işlemini gerçekleştiremeyiz.
Sağ çatalı alanın bırakmasını beklemek zorundayız.
Bu durum da yukarıda belirttiğim esnekliği sağlamamıza engel oluyor.
Bu yüzden, bu gibi durumlarda tryLock mekanizmasını kullanıyoruz.
tryLock mekanizması, bir kaynağı kilitleyebilirse kilitler,
kilitleyemezse bekleme yapmadan yoluna devam eder ve bize sonucu bildirir.
Java'da bu method bize işlemin başarılı olup olmadığını boolean olarak döner.
Örnek kullanımı şu şekilde:

```java
// Lock objesini birlikte çalışan threadlerin
// görebileceği bir yere koymak gerekiyor.
Lock lock = new ReentrantLock();

// ...

if (lock.tryLock()) {
    System.out.println("The Lock was acquired!");

    // Kilit gerçekleştiğinde yapılacak işi burada yap.
    
    // İşin bitince kilidi aç.
    lock.unlock();
} else {
    System.out.println("The Lock wasn't acquired!");
}
```

Şimdi konumuza geri dönelim.
Daha önceki uygulamamızda Philosopher ve Table isminde iki tane sınıf tanımlamıştık.
Şimdi ise PhilosopherV2 ve TableV2 isminde iki yeni sınıf tanımlıyor
ve lock kullandığımız yerleri tryLock kullanacak şekilde güncelliyoruz.
Ayrıca Philosopher sınıfının takeForks methodunu da iki çatalı da alamadığı durumda
soldaki çatalı bırakacak şekilde güncelliyoruz.

#### TableV2 Sınıfı

```java
package com.asosyalbebe.deadlock2;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class TableV2 {
    public static Lock[] forks;
    public static PhilosopherV2[] philosophers;

    public static void main(String[] args) throws InterruptedException {
        System.out.println("Starting simulation...");
        philosophers = new PhilosopherV2[5];
        forks = new Lock[5];

        for (int i = 0; i < philosophers.length; i++) {
            philosophers[i] = new PhilosopherV2(i);
            forks[i] = new ReentrantLock();
        }

        for (int i = 0; i < philosophers.length; i++) {
            philosophers[i].start();
        }

        Thread.sleep(20000);

        System.out.println("Stopping simulation...");

        for (int i = 0; i < philosophers.length; i++) {
            philosophers[i].stopEating();
        }

        Thread.sleep(1000);

        for (int i = 0; i < philosophers.length; i++) {
            System.out.println("Philosopher " + i + " = " + philosophers[i].getEatCount());
        }
    }

    /**
     * Locks a fork with given index
     * @param fork index of the fork
     */
    public static boolean takeFork(int fork) {
        return forks[fork].tryLock();
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

#### PhilosopherV2 Sınıfı

```java
package com.asosyalbebe.deadlock2;

public class PhilosopherV2 extends Thread implements Runnable {
    private int forkLeft;
    private int forkRight;
    private int index;
    private int eatCount;
    private boolean eat;

    public PhilosopherV2(int index) {
        forkLeft = index;
        forkRight = (index + 1) % 5;
        this.index = index;
        this.eatCount = 0;
        this.eat = true;
    }

    @Override
    public void run() {
        // Endless life of a philosopher
        while (eat) {
            boolean forksTaken = takeForks();
            if (forksTaken) {
                eat();
                putDownForks();
            }
            think();
        }
    }

    public int getEatCount() {
        return eatCount;
    }

    public void stopEating() {
        this.eat = false;
    }

    /**
     * Take left and right forks
     */
    private boolean takeForks() {
        System.out.printf("Filozof#%d is taking forks\n", index);
        boolean leftForkTaken = TableV2.takeFork(forkLeft);
        if (!leftForkTaken) {
            System.out.printf("Filozof#%d couldn't take left fork\n", index);
            return false;
        }

        System.out.printf("Filozof#%d took fork at left\n", index);
        boolean rightForkTaken = TableV2.takeFork(forkRight);
        if (!rightForkTaken) {
            System.out.printf("Filozof#%d couldn't take right fork, putting down left fork\n", index);
            TableV2.putDownFork(forkLeft);
            return false;
        }
        System.out.printf("Filozof#%d took fork at right\n", index);
        return true;
    }

    /**
     * Put left and right forks down
     */
    private void putDownForks() {
        System.out.printf("Filozof#%d is putting forks down\n", index);
        TableV2.putDownFork(forkLeft);
        System.out.printf("Filozof#%d put left fork down\n", index);
        TableV2.putDownFork(forkRight);
        System.out.printf("Filozof#%d put right fork down\n", index);
    }

    /**
     * Eat for a while
     */
    private void eat() {
        System.out.printf("Filozof#%d is now eating\n", index);
        eatCount++;
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
            Thread.sleep(50);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

Bu programı çalıştırdığımızda örnek çıktı şunun gibi olmaktadır:

```text
Starting simulation...
Filozof#1 is taking forks
Filozof#3 is taking forks
Filozof#3 took fork at left
Filozof#3 took fork at right
Filozof#3 is now eating
Filozof#2 is taking forks
Filozof#2 took fork at left
Filozof#2 couldn't take right fork, putting down left fork
Filozof#4 is taking forks
Filozof#4 couldn't take left fork
Filozof#4 is now thinking
Filozof#0 is taking forks
Filozof#0 took fork at left
Filozof#0 couldn't take right fork, putting down left fork
Filozof#0 is now thinking
Filozof#2 is now thinking
Filozof#1 took fork at left
Filozof#1 took fork at right
Filozof#1 is now eating
....
Filozof#0 is now thinking
Filozof#2 is taking forks
Filozof#2 took fork at left
Filozof#2 couldn't take right fork, putting down left fork
Filozof#2 is now thinking
Filozof#3 is putting forks down
Filozof#3 put left fork down
Filozof#3 put right fork down
Filozof#3 is now thinking
Stopping simulation...
Philosopher 0 = 343
Philosopher 1 = 340
Philosopher 2 = 342
Philosopher 3 = 342
Philosopher 4 = 343
```

Simulasyonun en sonunda konsola yazdırdığımız,
hangi filozofun kaç kere yemek yiyebildiğinin raporuna baktığımızda
hepsinin hemen hemen aynı sayıda yemek yeme eylemini gerçekleştirebildiğini görüyoruz.
Bu nedenle yöntemimize adil(fair) diyebiliriz.

Not: Bu çözümde aynı anda hem sağındaki hem de solundaki çatallar boş olan filozofların
yemek yiyemediği zamanlar olabilir.
Mesela tüm filozoflar solundaki çatala sahip olup, hiçbirisi sağındaki çatalı alamayınca,
hepsi sollarındaki çatalları bırakıyorlar ve düşünme eylemine geçiyorlar.
Bu yöntem efektif olmayabilir fakat deadlock olmama garantisi verir.
