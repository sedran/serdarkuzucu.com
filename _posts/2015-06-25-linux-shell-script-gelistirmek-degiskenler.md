---
layout: post
title:  "Linux Shell Script Geliştirmek: Değişkenler"
date:   2015-06-25 01:38:00 +0300
categories: [Bash, Programlama, Linux]
author: Serdar Kuzucu
permalink: /linux-shell-script-gelistirmek-degiskenler
comments: true
post_identifier: linux-shell-script-gelistirmek-degiskenler
featured_image: /assets/category/bash.png
---

[google-style-guide]: https://google.github.io/styleguide/shellguide.html

Merhaba arkadaşlar.
Bir önceki yazımda, [shell script geliştirmek](/linux-shell-script-gelistirmek) konusuna kabaca giriş yapmıştık. 
Bu yazıda da, değişken tanımlama konusuna değineceğim.

<!--more-->

Birçok programlama dilinin olmazsa olmazı değişkenler, 
Shell Script geliştirirken de olmazsa olmazımız.
Değişken tanımlamak için yapacağımız şey oldukça basit. 
Aşağıdaki kod, önce `BLOG_NAME` isminde bir değişken tanımlayıp ona AsosyalBebe değerini veriyor. 
Daha sonra `CURRENT_DIR` ismindeki değişkene, `pwd` komutunun sonucunu veriyor. 
Burada dikkat etmemiz gereken, bir komutun sonucunu bir değişkene vereceğimiz zaman, 
komutu `$(komut)` şeklinde yazıyoruz.

Bir sonraki değişkenimiz de, ilk iki değişkeni birleştirerek başka bir metin oluşturuyor. 
Değişkenleri kullanırken, başlarına dolar işareti koymamız gerekiyor. 
Değişkenleri yaratırken koymuyoruz bu işareti. 
İki değişkeni birbirine eklemek için tırnak içinde yan yana yazmamız yeterli.

```bash
#!/bin/bash
# Hello World Application 3
# Variable definitions

BLOG_NAME="AsosyalBebe"
CURRENT_DIR=$(pwd)
CONCAT_VAR="$BLOG_NAME$CURRENT_DIR"

echo $BLOG_NAME
echo $CURRENT_DIR
echo $CONCAT_VAR
```

Bu işlemlerden benim bilgisayarımda aşağıdaki sonuç çıkmakta:

```text
AsosyalBebe
/home/sedrik/lesson
AsosyalBebe/home/sedrik/lesson
```

### Sabit(Constant) Tanımlamak

Bazen değişken tanımlamalarımızın değerinin program içerisinde değişmesini istemeyiz.
Bu durumlarda o değişkeni `readonly` anahtar kelimesi ile tanımayarak, 
değerinin program boyunca sabit kalmasını sağlayabiliyoruz. 
Aşağıdaki kodda tanımladığım `MY_VARIABLE` isimli değişkenin değerini değiştirmeye çalıştığımda, 
kodun o satırı hata veriyor ve değişkenin değerini tekrar ekrana yazdırdığımızda, değişmemiş olduğunu görüyoruz.

```bash
#!/bin/bash
# Constants

readonly MY_VARIABLE="serdar"
echo "MY_VARIABLE=$MY_VARIABLE"
MY_VARIABLE="kuzucu"
echo "MY_VARIABLE=$MY_VARIABLE"
```

Programı çalıştırdığımızda, sonuç olarak şunu elde ediyoruz:

```text
MY_VARIABLE=serdar
./constant: line 6: MY_VARIABLE: readonly variable
MY_VARIABLE=serdar
```

Gelelim conventions denen kurallar dizisine. 
Google'ın "[Shell Style Guide][google-style-guide]" isimli yazısından sizlere değişken tanımlamak ile ilgili kuralları aktaracağım.

1. Değişken isimleri küçük harfle yazılır ve tüm kelimeler alt çizgi (_) karakteri ile ayrılır.
2. Sabitler(Constants) tamamen büyük harfle yazılır ve kelimeler alt çizgi ile ayrılır. 
Ayrıca dosyanın en başında tanımlanmalıdırlar.
3. Sabitleri `readonly` anahtar kelimesiyle belirterek program boyunca değerinin değişmeyeceğinden emin olunmalıdır.
4. Fonksiyonların içerisindeki değişkenler `local` anahtar kelimesi ile tanımlanmalıdır. 
Gereksiz değişkenler fonksiyon dışına çıkmamalıdırlar.

Bu kurallara uymazsanız programınız çalışmaz demiyoruz. 
Bu kurallara convention denir ve her programlama dilinin kendi convention'ı vardır. 
Kodun güzel ve okunabilir olmasını sağlarlar.

Yukarıdaki kurallar ile ilgili bir örnek verelim ve yazımızı bitirelim.

```bash
#!/bin/bash
# Conventions
# from Google's Shell Style Guide

# All caps, separated with underscores, declared at the top of the file.
# Use readonly  or declare -r  to ensure they're read only.
readonly BLOG_URL="http://blog.asosyalbebe.com"

function my_function() {
    # Declare function ­specific variables with local .
    local local_variable=1
    echo $local_variable
}

# Lower­case, with underscores to separate words.
global_variable=1
```

Değişkenler ile ilgili anlatacaklarım da bu kadar efendim. 
Bir sonraki yazıya kadar esen kalın.
