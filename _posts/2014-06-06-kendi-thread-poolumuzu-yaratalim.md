---
layout: post
title:  "Kendi Thread Pool'umuzu Yaratalım"
date:   2014-06-06 16:44:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /kendi-thread-poolumuzu-yaratalim
comments: true
post_identifier: kendi-thread-poolumuzu-yaratalim
featured_image: /assets/posts/java-threads.jpg
---

[Thread nedir, nasıl kullanılır](/thread-mantigi-java-ornekleri)
konusuna uzun zaman önce değinmiştim. 
Peki multithread bir uygulamada sürekli yeni Thread yaratmak ne kadar iyi bir yöntemdir?
Sık sık Thread yaratmak bazen performansı arttırmak yerine düşürebilir 
çünkü yeni bir Thread yaratmak işletim sistemi için masraflı bir iştir. 
Hem yeni bir Thread'in yaratılması, bu Thread için gerekli kaynakların ayrılması, 
hem de yüzlerce Thread'i yönetmek ve bunlar arasında geçişler yapmak JVM için masraflı işlerdir.
Bu yazıda Thread kullanımını nasıl kontrol altında tutarız buna bakıyor olacağız.

<!--more-->

Büyük sistemlerde ve framework'lerde (mesela Spring Framework) Thread Pool isminde çeşitli yapılar bulunur.
Thread Pool'un amacı sistemdeki Thread sayısını kontrol altında tutmak 
ve yaratılan belirli sayıdaki Thread'leri işi bitince sonlandırmak yerine gelecekteki olası işler için bekletmektir.
Bir Thread Pool yaratıldığında belirli sayıda Thread'i yaratır 
ve yapılacak işler gelene kadar bu Thread'leri bekletir.
Yapılacak işler sıraya girdikçe boşta bulunan Thread'lerden birisi uyanıp işi yapar ve tekrar bekleme durumuna geçer.

Şimdi içinde Thread Pool hazır olarak gelen kütüphaneleri ve frameworkleri bir kenara bırakalım ve basit bir Thread Pool nasıl geliştirilir buna bakalım.


### 1. Queue Sınıfı

Öncelikle Thread Pool'un yapısı gereği Thread sayımız kısıtlı olacağı için 
yapılacak işlerin sıraya koyulması gerekiyor. 
Bunun için senkron bir queue yapısına ihtiyacımız var. 
Senkrondan kastımız, aynı anda sadece bir Thread queue üzerindeki 
enqueue ve dequeue methodlarından birisini kullanabilir. 
Ayrıca bir Thread dequeue methodunu çağırdığında, 
queue boşsa queue'ya yeni bir iş ekleninceye kadar bu methodda beklemeli. 
Bu durumda queue'ya yeni bir task eklendiğinde, 
task bulamayıp bekleyen diğer Thread'lerin uyarılması gerekiyor. 
Aşağıda örnek Queue implementasyonunu görebilirsiniz.

```java
package com.asosyalbebe.threadpool;

import java.util.LinkedList;

/**
 * Queue.java
 */
public class Queue {
    private LinkedList<Runnable> tasks = new LinkedList<>();

    public synchronized void enqueue(Runnable runnable) {
        tasks.addLast(runnable);

        // Yeni bir task eklendiğinde, task için bekleyen
        // Thread'ler uyarılır
        notifyAll();
    }

    public synchronized Runnable dequeue() {
        Runnable runnable = null;

        // Hiç task olmadığında task isteyen Thread bekletilir
        while (tasks.isEmpty()) {
            try {
                wait();
            } catch (InterruptedException e) {
                return runnable;
            }
        }

        runnable = tasks.remove();
        return runnable;
    }
}
```


### 2. Worker Sınıfı

Şimdi, yaratıp pool'a aldığımız Thread'leri tanımlamaya geldi sıra.
Bu Thread'lerin görevi, sürekli Queue üzerinden yeni bir task alıp bunu çalıştırmak
ve sistem ayakta olduğu sürece açık kalmak.
Örnek Worker sınıfını aşağıda görebilirsiniz.

```java
package com.asosyalbebe.threadpool;

/**
 * Worker.java
 */
public class Worker extends Thread {
    private Queue tasks;

    public Worker(Queue tasks, String name) {
        super(name);
        this.tasks = tasks;
    }

    @Override
    public void run() {
        while (true) {
            try {
                // Yeni bir task al
                Runnable runnable = tasks.dequeue();
                System.out.println("New task is selected by " + getName());
                
                // Task'i çalıştır
                runnable.run();
                System.out.println("Task completed by " + getName());
            } catch (Exception e) {
                // Hatayı logla fakat thread'in ölmesine izin verme
                System.out.println(e.getMessage());
            }
        }
    }
}
```


### 3. ThreadPool Sınıfı

Sırada ana ThreadPool sınıfını yazmak var.
ThreadPool sınıfı, kodumuzu kullanan geliştirici tarafından kullanılacak olan sınıf.
Öncelikle kaç Thread'in havuzda hazır bekletilmesi gerektiğini belirterek bir ThreadPool objesi yaratılıyor.
Bu obje yaratıldığında istenilen sayıda Thread hemen açılıp hizmete hazır hale geliyor.
Daha sonra kullanıcı yapılmasını istediği herhangi bir iş olduğunda 
bunu bir Runnable implementasyonu şeklinde submitTask methoduna gönderiyor 
ve boşta olan bir Thread bu işi ilerde otomatik olarak yapıyor. 
Kodumuz şu şekilde:

```java
package com.asosyalbebe.threadpool;

/**
 * ThreadPool.java
 */
public class ThreadPool {
    private Queue tasks = new Queue();
    private int numberOfThreads;

    public ThreadPool(int numberOfThreads) {
        this.numberOfThreads = numberOfThreads;
        startAllThreads();
    }

    private void startAllThreads() {
        // istenilen sayıda Thread başlangıçta 
        // yaratılır ve başlatılır
        for (int i = 0; i < numberOfThreads; i++) {
            Worker worker = new Worker(tasks, "Worker#" + i);
            worker.start();
        }
    }

    public void submitTask(Runnable runnable) {
        tasks.enqueue(runnable);
    }
}
```


### 4. Test Edelim

Her yaptığımız işte olduğu gibi, burada da çalışıp çalışmadığına bakmamız gerekiyor tabii.
Aşağıda ThreadPool sınıfının bir örnek kullanımını göreceksiniz:

```java
package com.asosyalbebe.threadpool;

/**
 * ThreadPoolTest.java
 */
public class ThreadPoolTest {
    public static void main(String[] args) {
        ThreadPool pool = new ThreadPool(5);

        // 500 tane task başlatalım.
        for (int i = 0; i < 500; i++) {
            startTask(pool, i);
        }

        System.out.println("500 task were submitted!");
    }

    private static void startTask(ThreadPool pool, final int order) {
        pool.submitTask(new Runnable() {

            @Override
            public void run() {
                // Uzun matematiksel işlemler yapan task
                int j = 0;
                long k = 1;
                long a = 0;
                for (int i = 0; i < Integer.MAX_VALUE - 100; i++) {
                    j += 5 + i;
                    k = (long) a * j;
                    a = k;
                }

                System.out.println("Task#" + order + " completed!");
            }
        });
    }
}
```

Bu testin çıktısı şuna benzer birşey olacak:

```text
New task is selected by Worker#4
New task is selected by Worker#1
New task is selected by Worker#2
New task is selected by Worker#0
New task is selected by Worker#3
500 task were submitted!
Task#0 completed!
Task completed by Worker#4
New task is selected by Worker#4
Task#3 completed!
Task completed by Worker#1
New task is selected by Worker#1
Task#2 completed!
Task completed by Worker#2
New task is selected by Worker#2
Task#1 completed!
Task completed by Worker#3
New task is selected by Worker#3
Task#4 completed!
Task completed by Worker#0
New task is selected by Worker#0

.... Burayı kestim ....

New task is selected by Worker#3
Task completed by Worker#1
New task is selected by Worker#2
New task is selected by Worker#0
Task completed by Worker#4
Task#493 completed!
Task#494 completed!
New task is selected by Worker#1
Task#492 completed!
Task#495 completed!
Task completed by Worker#2
Task completed by Worker#0
New task is selected by Worker#4
New task is selected by Worker#0
New task is selected by Worker#2
Task completed by Worker#1
Task completed by Worker#3
New task is selected by Worker#1
Task#497 completed!
Task#498 completed!
Task#496 completed!
Task completed by Worker#0
Task completed by Worker#2
Task#499 completed!
Task completed by Worker#4
Task completed by Worker#1
```

Görüldüğü gibi, Pool'da yaratılan 5 Thread(Worker#0, Worker#1, Worker#2, Worker#3 ve Worker#4) 
bu işleri sırayla paylaşarak yapıp bitiriyorlar.
Hem de çok kısa bir süre içerisinde.
Eğer 500 task için 500 Thread açmayı düşünseydik, çok daha yavaş olacaktı.
Hatta korkunç bir performans elde edebilirdik.

Bir sonraki yazıma kadar esen kalın.
