---
layout: post
title:  "Shell Scripts: While ve Until Döngüleri"
date:   2015-06-26 01:56:00 +0300
categories: [Bash, Programlama, Linux]
author: Serdar Kuzucu
permalink: /shell-scripts-while-ve-until-donguleri
comments: true
post_identifier: shell-scripts-while-ve-until-donguleri
featured_image: /assets/category/bash.png
---

Merhaba arkadaşlar. 
[Linux Shell Script Geliştirmek](/linux-shell-script-gelistirmek) 
diye başladığım yazı dizisinin bir diğer yazısında daha birlikteyiz. 
Şimdiye kadar konuyla ilgili yazdığım yazılardan iyi bir döngü yazmaya yetecek donanımı edindik. 
Edindik diyorum, çünkü ben de yazarak öğreniyor, öğrenerek yazıyorum. 
Şimdi de while ve until döngülerinin ne olduklarına ve nasıl kullanıldıklarına bakalım.

<!--more-->

### While Döngüsü

Döngüler, içlerinde tanımladığımız işlemi belirttiğimiz koşul gerçekleştiği sürece tekrarlayan yapılardır. 
While döngüsü, içerisine verdiğimiz koşul doğru olduğu sürece verdiğimiz komutları tekrarlayan bir yapıya sahiptir.

Öncelikle while döngüsü nasıl yazılır ona bakalım:

```bash
# syntax 1
while [[ condition ]]
do
    echo "condition holds"
done

# syntax 2
while [[ condition ]]; do
    echo "condition holds"
done
```

Koşulu yazdıktan sonra koyduğumuz noktalı virgül, 
`do` anahtar kelimesi ile koşulu aynı satıra yazabilmemizi sağlıyor. 
Ben ikinci yazımı tercih ediyorum, gözüme hoş geldiği için.

[Program Argümanlarını Okumak](/shell-scripts-program-argumanlarini-okumak) 
isimli yazıda komut satırından gelen argümanları tek tek ekrana yazdırmayı başarmıştık. 
Şimdi bir döngü yapıp hepsini daha şık bir kod ile yazdırmaya ne dersiniz?

Aşağıdaki kod, parametre sayısı 0 oluncaya kadar ilk parametreyi ekrana yazdırıyor. 
Bu kodun en önemli kısmı `shift` komutu. 
Bu komut parametreleri birer sola kaydırıyor. 
Yani örneğin `shift` çağırmadan önce argüman değerleri `$1="a"`, `$2="b"`, `$3="c"` durumundaysa, 
`shift` çağırdıktan sonra `$1="b"`, `$2="c"` durumuna geçiyor. 
Böylece tüm parametreleri `$1` değişkenini kullanarak okuyabiliyoruz.

```bash
#!/bin/bash
# Learning Shell Scripting
# While Loop

INDEX=0
while [[ "$#" -ne "0" ]]; do
    INDEX=$(($INDEX + 1))
    echo "Parameter[$INDEX] is $1"
    shift
done
```

Bu programı aşağıdaki gibi çağırırsanız, aşağıdaki sonucu alabilirsiniz:

```console
sedrik@localhost ~ $ ./helloworld a b c d
Parameter[1] is a
Parameter[2] is b
Parameter[3] is c
Parameter[4] is d
```

### Until Döngüsü

While döngüsünün tam tersi şekilde koşulu sorgular. 
Yani verdiğimiz koşul doğru olmadığı sürece verdiğimiz komutları tekrarlar. 
Koşul ne zaman doğru olur, o zaman döngü durur.

Aşağıdaki döngü, `my_variable` isimli değişken 10 değerinden büyük olduğu zaman duracak. 
Yani ekrana 1'den 10'a kadar tüm sayıları yazdırmış olacağız.

```bash
#!/bin/sh
# Learning Shell Scripting
# Until Loop

my_variable=1

until [[ "${my_variable}" -gt "10" ]]; do
    echo "${my_variable}"
    my_variable=$((my_variable + 1))
done
```

While syntax'ında olduğu gibi, until syntax'ında da, 
koşuldan sonraki noktalı virgülü kaldırıp 
`do` anahtar kelimesini bir sonraki satıra atabilirsiniz. 
Ama ben atmamayı tercih edeceğim. 
Bana göre böyle daha güzel görünüyor.

Saygılarımı sunarak bu yazımı da sonlandırıyorum. 
Herkese kodlu geceler dilerim. 
Esenlikle.
