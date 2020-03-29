---
layout: post
title:  "Shell Scripts: Program Argümanlarını Okumak"
date:   2015-06-25 01:58:00 +0300
categories: [Bash, Programlama, Linux]
author: Serdar Kuzucu
permalink: /shell-scripts-program-argumanlarini-okumak/
comments: true
post_identifier: shell-scripts-program-argumanlarini-okumak
featured_image: /assets/category/bash.png
---

Merhaba arkadaşlar. 
[Linux Shell Script Geliştirmek](/linux-shell-script-gelistirmek) 
diye başladığım yazı dizisinin bir diğer yazısında daha birlikteyiz. 
Bu yazıda, program argümanlarını okumayı göreceğiz.

<!--more-->

Birçok program, çalışmadan önce bir takım parametreleri kullanıcıdan alır. 
Bu yöntem programa esneklik kazandırır. 
Örneğin dosya kopyalarken kullandığımız `cp` komutu, 
en yaygın kullanımında iki tane parametre alır. 
Bunlardan ilki hangi dosyayı kopyalayacağıdır. 
Diğeri ise o dosyayı nereye kopyalayacağıdır.

Shell scriptimizde de bu şekilde istediğimiz kadar parametre alabilmemiz mümkün.

Shell scriptlerinde, programa geçilen argümanları okuyabilmemiz için 
otomatik olarak tanımlanan değişkenler vardır. 
Bunların ilki `$#` isimli parametredir. 
Bu parametre, programa kaç tane parametre geçildiğini söyler.

Programa geçilen parametreleri ise sırasıyla şu değişkenlerden okuyabiliriz: 
`$1`, `$2`, `$3`, ...

`$0` parametresi ise, çalıştırdığımız programın ismini söylüyor bize.

Şimdi bir örnek verelim. 
Diyelim ki aşağıdaki Shell Scriptini yazdık.

```bash
#!/bin/bash
# Hello World Application 4
# Command Line Arguments

echo "There are $# parameters"

echo "Program is $0"
echo "First parameter is $1"
echo "First parameter is $2"
echo "First parameter is $3"
```

Bu programı helloworld ismiyle kaydettik ve `chmod +x helloworld` komutuyla çalıştırılabilme yetkisini verdik.
Daha sonra bu programı `./helloworld a1 b2 c3` şeklinde çağıracak olursak, programın çıktısı aşağıdaki gibi olacak:

```console
$ ./helloworld a1 b2 c3
There are 3 parameters
Program is ./helloworld
First parameter is a1
First parameter is b2
First parameter is c3
```

### shift komutu

Bu komutu daha ileriki başlıklarda daha etkin kullanmayı göstereceğim 
fakat şimdilik konuyla alakası olduğu için ufaktan değineyim diyorum.
`shift` komutu, program argümanlarını bir sola kaydırır. 
Yani `$1` değişkeninde "a" değeri, `$2` değişkeninde "b", `$3` değişkeninde de "c" değeri varken, 
shift komutunu çalıştırırsak, `$1` değişkenine "b" değeri, `$2` değişkenine "c" değeri gelir.
`$3` değişkeni ise kaybolur. 
Bu bize döngüler yazmayı öğrendiğimiz zaman tüm parametre değerlerini `$1` ile okuyabilmenin yolunu açacak. 
Şimdilik basitçe bir örnekle geçiştireyim.

```bash
#!/bin/bash
# shift example

echo "Parameter 1 is $1"
shift
echo "Parameter 1 is $1"
shift
echo "Parameter 1 is $1"
shift
echo "Parameter 1 is $1"
```

Bu programı `shiftexample` olarak kaydedip `./shiftexample a b c d e` şeklinde çalıştırdığımızda, 
çıktı aşağıdaki gibi olacak:

```console
$ ./shiftexample a b c d e
Parameter 1 is a
Parameter 1 is b
Parameter 1 is c
Parameter 1 is d
```

Görüldüğü gibi, verdiğimiz tüm parametreleri `$1` değişkenini kullanarak okuyabildik.

Efendim bir sonraki yazımıza kadar esen kalın.
Kodlu geceler.
