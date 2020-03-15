---
layout: post
title:  "User Threads vs Daemon Threads"
date:   2019-02-12 02:37:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /user-threads-vs-daemon-threads
author: Serdar Kuzucu
comments: true
post_identifier: user-threads-vs-daemon-threads
featured_image: /assets/posts/java-threads.jpg
---

Java'da birden fazla görevi eş zamanlı gerçekleştirmek istediğimizde 
`Thread`'lerden faydalanırız. 
Yeni bir `Thread` nesnesi oluşturur, 
constructor argümanı olarak bir <code>Runnable</code> geçeriz veya 
<code>Thread</code> sınıfını extend eder, 
<code>void run()</code> methodunu override ederiz. 
Bunları daha önce yaptıysanız belki <code>Thread</code> sınıfının üzerindeki 
<code>setDaemon(boolean on)</code> methodunu da farketmişsinizdir. 
Peki kimdir bu daemon?

<!--more-->

<blockquote class="blockquote">
<p class="mb-0">In multitasking computer operating systems, a daemon is a computer program that runs as a background process, rather than being under the direct control of an interactive user.</p>
<footer class="blockquote-footer"><a href="https://en.wikipedia.org/wiki/Daemon_(computing)" target="_blank" rel="nofollow">Wikipedia, <cite title="Daemon">Daemon (Computing)</cite></a></footer>
</blockquote>


## User Threads vs Daemon Threads

Java iki adet Thread türü tanımlar:

1. **User Threads:** Bu tip Thread'ler bitmeden JVM kapanmaz. Eğer `System.exit` çağırmadıysanız.
2. **Daemon Threads:** Tüm User Thread'leri sonlandığında JVM bu Thread'leri gözünün yaşına bakmadan sonlandırır.

Bu türler ile ilgili sahip olduğum bilgiler şu şekilde:

* JVM'in kendi kendine sonlanması için tüm User Thread tipindeki Thread'ler sonlanmış olmalıdır.
* Thread'ler daemon olma/olmama durumunu kendilerini yaratan Thread'den alırlar.
* JVM'e ait çoğu Thread daemon tipindedir. 
Örneğin Garbage Collection Thread'leri. 
JVM sonlanmak için çalışmakta olan bir Garbage Collection işleminin tamamlanmasını beklemez.
* Bir Thread `start()` edilmeden önce daemon olup olmadığına karar verilmelidir. 
Eğer çalışmakta olan bir `Thread` üzerinde `setDaemon(boolean)` 
çağırırsanız `IllegalThreadStateException` alırsınız.
* I/O benzeri kritik işler için daemon thread kullanımı kesinlikle tavsiye edilmez. 
Çünkü JVM kapanırken daemon thread'leri `finally` bloklarını bile çalıştırmadan öldürür.


Bu konular ile ilgili sık duyduğum birkaç yanlış bilginin doğrularını yazayım:

* Daemon thread kendisini yaratan thread sonlandığında değil, 
tüm user thread'ler sonlandığında JVM ile birlikte sonlanır.
* JVM sonlandıktan sonra hiçbir thread hayatta kalmaz. 
JVM bir process'dir ve onu öldürdüğünüz zaman thread'ler, heap, 
stack, database bağlantıları, network bağlantıları, açılmış dosyalara 
olan referanslar gibi birçok şey de yok olur.

Şimdi çok küçük bir örnek kod paylaşayım ve nasıl çalıştığını görelim.

```java
package com.serdarkuzucu.daemonthreads;

public class UserVsDaemonThreads {
    private static final String LOG_FORMAT = "%7s : %s\n";
    private static final String LOG_FORMAT_ITERATION = "%7s : %d : %s\n";

    private static final String THREAD_MAIN = "MAIN";
    private static final String THREAD_USER = "USER";
    private static final String THREAD_DAEMON = "DAEMON";

    public static void main(String[] args) throws InterruptedException {
        System.out.printf(LOG_FORMAT, THREAD_MAIN, "thread is started");

        final Thread daemonThread = new Thread(new SleepIteratingRunnable(THREAD_DAEMON, 20));
        daemonThread.setDaemon(true);
        daemonThread.start();

        final Thread userThread = new Thread(new SleepIteratingRunnable(THREAD_USER, 5));
        userThread.setDaemon(false);
        userThread.start();

        Thread.sleep(1000);

        System.out.printf(LOG_FORMAT, THREAD_MAIN, "thread is finished");
    }

    private static class SleepIteratingRunnable implements Runnable {
        private final String threadName;
        private final int iterations;
        private int currentIteration = 1;

        SleepIteratingRunnable(String threadName, int iterations) {
            this.threadName = threadName;
            this.iterations = iterations;
        }

        @Override
        public void run() {
            while (!Thread.interrupted() && iterations >= currentIteration) {
                try {
                    System.out.printf(LOG_FORMAT_ITERATION, threadName, currentIteration, "Sleeping.");

                    Thread.sleep(250);

                    System.out.printf(LOG_FORMAT_ITERATION, threadName, currentIteration, "Woke up.");
                } catch (InterruptedException e) {
                    System.out.printf(LOG_FORMAT_ITERATION, threadName, currentIteration, "InterruptedException caught.");
                } finally {
                    System.out.printf(LOG_FORMAT_ITERATION, threadName, currentIteration, "Finally executed.");
                }
                currentIteration++;
            }

            System.out.printf(LOG_FORMAT, threadName, "While loop finished");
        }
    }
}
```

Örnek kod, istenilen sayıda iterasyon yapan ve her iterasyonda konsola 
çeşitli bilgiler bırakıp 250 milisaniye uyuyan <code>SleepIteratingRunnable</code> 
isimli <code>Runnable</code> sınıfını kullanıyor. 
Bu sınıfın içerisinde özellikle run methodunun sonuna, catch ve finally bloklarının 
içlerine konsol loglaması yaptım ki hangi Thread hangi aşamada öldü görebilelim.

Tüm kod <code>public static void main</code> methodunu içeren bir dosyada bulunuyor. 
main method içeren bir java programı çalıştırıldığında önce bir main thread yaratılır 
ve kodumuz main thread içinde koşmaya başlar. main thread de bir user thread'dir.

Yukarıdaki kodun 14, 15 ve 16. satırlarında bir adet daemon thread yaratıyoruz 
ve ona verdiğimiz <code>SleepIteratingRunnable</code>'a 20 iterasyon yapmasını söylüyoruz. 

18, 19 ve 20. satırlarda ise bir adet user thread yaratıyoruz 
ve bu thread'de çalışan <code>SleepIteratingRunnable</code>'a 5 iterasyon yapmasını söylüyoruz.

22. satırda ise main thread'i 1 saniye sleep ediyoruz.

Bu noktadan sonra olacaklar şu şekilde:

main thread 1 saniye sonra uykudan uyanır ve "thread is finished" yazıp sonlanır.

Bu 1 saniyelik süre içerisinde yarattığımız user thread ve daemon thread bir miktar 
iterasyon yapacaklar. (3 veya 4 iterasyon)

5 iterasyon ile sınırladığımız user thread 5. iterasyondan sonra sonlanır.

20 iterasyon ile sınırladığımız daemon thread'in işini tamamlamasını beklemeden JVM sonlanır. 
JVM burada finally, interrupt, catch gibi aksiyonlara hiç girmeden daemon thread'i de 
kendisiyle birlikte sonlandırır.

Programın çıktısı şu şekilde: 

```text
   MAIN : thread is started
 DAEMON : 1 : Sleeping.
   USER : 1 : Sleeping.
 DAEMON : 1 : Woke up.
 DAEMON : 1 : Finally executed.
 DAEMON : 2 : Sleeping.
   USER : 1 : Woke up.
   USER : 1 : Finally executed.
   USER : 2 : Sleeping.
 DAEMON : 2 : Woke up.
 DAEMON : 2 : Finally executed.
 DAEMON : 3 : Sleeping.
   USER : 2 : Woke up.
   USER : 2 : Finally executed.
   USER : 3 : Sleeping.
 DAEMON : 3 : Woke up.
 DAEMON : 3 : Finally executed.
 DAEMON : 4 : Sleeping.
   USER : 3 : Woke up.
   USER : 3 : Finally executed.
   USER : 4 : Sleeping.
   MAIN : thread is finished
 DAEMON : 4 : Woke up.
 DAEMON : 4 : Finally executed.
 DAEMON : 5 : Sleeping.
   USER : 4 : Woke up.
   USER : 4 : Finally executed.
   USER : 5 : Sleeping.
 DAEMON : 5 : Woke up.
 DAEMON : 5 : Finally executed.
 DAEMON : 6 : Sleeping.
   USER : 5 : Woke up.
   USER : 5 : Finally executed.
   USER : While loop finished
```

Çıktıda gördüğümüz gibi daemon thread'in yaptığı son iş uykuya dalmak oldu. 
JVM onu uykudan uyandırmadı, interrupt etmedi veya bir şekilde finally bloğuna düşürmedi. 
User thread sonlandığında doğrudan aşağı indirdi.

Bu gecelik bu kadar dostlar. Artık uyumalıyım.

İyi geceler.
