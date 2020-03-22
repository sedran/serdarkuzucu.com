---
layout: post
title:  "Linux Shell Script Geliştirmek"
date:   2015-06-24 00:13:00 +0300
categories: [Bash, Programlama, Linux]
author: Serdar Kuzucu
permalink: /linux-shell-script-gelistirmek
comments: true
post_identifier: linux-shell-script-gelistirmek
featured_image: /assets/category/bash.png
---

Merhaba arkadaşlar. 
Bu yazıda basitçe linux işletim sisteminde shell script geliştirmeyi anlatmaya çalışacağım.
Bu içeriği tek bir yazı olarak yazmayı düşünüyordum fakat o kadar uzadı ki, sonunda parçalara bölmeye karar verdim.
Bu ilk yazımda, ilk shell scriptimizi yazarak başlayacağız.
Daha sonraki konulara yine bu yazıdan linkler vereceğim.

<!--more-->

### Shell Script Nedir?

Linux işletim sistemi kullananlar birçok işlem için komut yazmaları gerektiğini bilirler.
Genellikle arayüzü kullanmak zor olduğu için ben birçok işlemimi komutlar yazarak hallediyorum.
Ayrıca SSH ile linux sunuculara bağlandığımızda, 
görsel arayüz olmadığı için komutlar yazmak zorunda kalırız.

Shell Script dediğimiz dil, 
sürekli tekrarladığımız komutları bir dosyaya peş peşe yazarak
tek bir komutla hepsini çalıştırmamıza yarar.
Hatta yaptığım bu kaba tanımdan daha da güçlü bir dildir.

### İlk Shell Script'imizi Yazalım

Şimdi, her yazılım diline girişde olduğu gibi, "Hello World" uygulamamızı yazalım.
Aşağıdaki komutları `1_HelloWorld` isimli bir dosya oluşturup, onun içine kaydedelim.

```bash
#!/bin/bash
# Hello World Application

echo "Hello World!"
```

Daha sonra, bu dosyanın bulunduğu klasöre komut satırında gidelim ve dosyaya execute yetkisi verelim.
Bunun nasıl yapıldığını bir kereliğine gösteriyorum.
Daha sonra geliştirdiğiniz tüm script'lere uygulamak sizin göreviniz olsun.

```bash
chmod +x 1_HelloWorld
```

Şimdi yine aynı komut satırında, aşağıdaki komutu yazarak yazdığımız ilk uygulamayı çalıştırabiliriz.

```bash
./1_HelloWorld
```

Sonuç olarak, ekrana Hello World yazıldığını göreceksiniz.

### Neleri Kullanabiliriz?

Komut satırından çağırabildiğiniz her türlü komutu, Shell Script içerisine yazıp, çağırtabilirsiniz.
Mesela, aşağıdaki script, çoğumuzun bildiği bir dizi linux komutunu ardışık olarak çağırmakta.

```bash
#!/bin/bash
# Hello World Application 2
# Run a list of commands

echo "Begin!"
# Show current directory
pwd
# List files in current directory
ls -ltrh
# Show disk usage info
df -h
# Show currently running processes
ps -ef
# Show memory usage information
free -m
echo "End..."
```

Evet arkadaşlar, buraya kadar ilk shell scriptimizi başarıyla yazıp çalıştırdık.
Bundan sonraki konulara, ayrı yazılarda değineceğim.
Bu konuların başlıkları şöyle olacak:

1. [Değişken Tanımlamak](/linux-shell-script-gelistirmek-degiskenler)
2. [Aritmetik İşlemler](/shell-scripts-aritmetik-islemler)
3. [Program Argümanlarını Okumak](/shell-scripts-program-argumanlarini-okumak)
4. [Kontrol Yapıları: while ve until](/shell-scripts-while-ve-until-donguleri)
5. [Kontrol Yapıları: if/elif/else](/shell-scripts-if-elif-else)
6. [Kontrol Yapıları: case](/shell-scripts-case-komutu)
7. Fonksiyonlar

Herkese iyi kodlamalar dilerim.
