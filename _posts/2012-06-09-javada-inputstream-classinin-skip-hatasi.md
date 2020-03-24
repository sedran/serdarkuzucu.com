---
layout: post
title:  "Java'da InputStream Class'ının Skip Hatası"
date:   2012-06-09 05:46:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /javada-inputstream-classinin-skip-hatasi
comments: true
post_identifier: javada-inputstream-classinin-skip-hatasi
featured_image: /assets/category/java.png
---

`InputStream` class'ının `skip` methodu bir datayı okurken 
okumak istemediğimiz kadar veriyi atlamamızı sağlaması gereken bir fonksiyon. 
Parametre olarak kaç byte skip edileceğini alıyor 
ve return olarak da kaç byte skip ettiğini dönüyor. 
Yani dosyanın sonuna gelinmediği sürece parametresi 
ile return değerinin eşit olması gerekiyor, mantıken. 
Ama bazı durumlarda nedense atladığı data parametre olarak verdiğimizden çok daha ufak, 
neredeyse onda biri olabiliyor.

<!--more-->

Az önce bu problem yüzünden yaklaşık 1 saatimi harcadım. 
Çözümü de yine her zaman olduğu gibi 
[stackoverflow](http://stackoverflow.com/a/9077180/618279)'da buldum.

Bu sorunu düzelten fonksiyonu kendime göre düzenledim ve şu şekilde kullanmaya başladım:

```java
private static long skip(InputStream s, long numbytes) throws IOException {
    if (numbytes <= 0) {
        return 0;
    }
    long n = numbytes;
    int buflen = (int) Math.min(1024, n);
    byte data[] = new byte[buflen];
    while (n > 0) {
        int r = s.read(data, 0, (int) Math.min((long) buflen, n));
        if (r < 0) {
            break;
        }
        n -= r;
    }
    return numbytes - n;
}
```

Java, kendisi de bu şekilde yaptığını söylüyor bize aslında.
Bir byte array'i yaratıp onun içerisine okuyarak skip ediyormuş datayı.
Biz de aynı şekilde yaptık.
O yaptı çalışmadı, biz yaptık çalıştı.
Garip.
