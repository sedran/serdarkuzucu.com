---
layout: post
title:  "Shell Scripts: Aritmetik İşlemler"
date:   2015-06-25 23:58:00 +0300
categories: [Bash, Programlama, Linux]
author: Serdar Kuzucu
permalink: /shell-scripts-aritmetik-islemler/
comments: true
post_identifier: shell-scripts-aritmetik-islemler
featured_image: /assets/category/bash.png
---

Merhaba arkadaşlar. 
[Linux Shell Script Geliştirmek](/linux-shell-script-gelistirmek) 
diye başladığım yazı dizisinin bir diğer yazısında daha birlikteyiz. 
Aritmetik programlamanın olmazsa olmazlarındandır.
Sonuçta iki sayıyı toplayamıyorsak, neden kod yazalım değil mi?
Shell script geliştirirken de bir takım matematiksel işlemlere ihtiyaç duyacağız.
Bu yazıda, bazı matematiksel işlemleri nasıl yapacağımızı göreceğiz.

<!--more-->

Shell, integer aritmetiği yapmamızı sağlayan altyapıya sahip.
Yani ondalık sayılar ile işlem yapamıyor veya ondalık sonuçlar elde edemiyoruz.
Eğer ondalık sayılarla çalışmamız gerekirse, `bc` isimli komutu kullanmamız gerekiyor 
fakat bu yazıda buna değinmeyeceğim.

Öncelikle, aritmetik işlemler için syntax olarak dolar işaretinden 
sonra iki tane iç içe parantez kullanmamız gerekiyor. 
Yani kodumuz `$((aritmetik işlem))` şeklinde olmalı. 
Bu işlemin sonucunu daha sonra doğrudan konsola yazdırabiliyor veya bir değişkene atama yapabiliyoruz.

### Aritmetik Operatörler

<table class="table table-bordered">
<thead>
<tr>
<th>Operatör</th>
<th>Açıklama</th>
<th>Örnek</th>
<th>Sonuç</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>+</code></td>
<td>Toplama</td>
<td><code>echo $((5 + 3))</code></td>
<td>8</td>
</tr>
<tr>
<td><code>-</code></td>
<td>Çıkarma</td>
<td><code>echo $((5 - 3))</code></td>
<td>2</td>
</tr>
<tr>
<td><code>*</code></td>
<td>Çarpma</td>
<td><code>echo $((5 * 3))</code></td>
<td>15</td>
</tr>
<tr>
<td><code>/</code></td>
<td>Bölme</td>
<td><code>echo $((5 / 3))</code></td>
<td>1</td>
</tr>
<tr>
<td><code>**</code></td>
<td>Üs Alma</td>
<td><code>echo $((5 ** 3))</code></td>
<td>125</td>
</tr>
<tr>
<td><code>X++</code></td>
<td>Önce oku, sonra bir arttır</td>
<td><code>X=4
echo $((X++))
echo $((X))</code></td>
<td>4
5</td>
</tr>
<tr>
<td><code>X--</code></td>
<td>Önce oku, sonra bir azalt</td>
<td><code>X=4
echo $((X--))
echo $((X))</code></td>
<td>4
3</td>
</tr>
<tr>
<td><code>++X</code></td>
<td>Önce bir arttır, sonra oku</td>
<td><code>X=5
echo $((++X))</code></td>
<td>6</td>
</tr>
<tr>
<td><code>--X</code></td>
<td>Önce bir azalt, sonra oku</td>
<td><code>X=5
echo $((--X))</code></td>
<td>4</td>
</tr>
<tr>
<td><code>%</code></td>
<td>Mod Alma</td>
<td><code>echo $((7 % 5))</code></td>
<td>2</td>
</tr>
</tbody>
</table>

### Çalışan Örnek Bir Kod

Aşağıdaki kod 1 arttırma ve 1 azaltma işlemleri haricindeki işlemlerin yapıldığı, 
çalış deyince çalışan örnek bir programdır.

```bash
#!/bin/bash
# Shell Scripting
# Aritmetic Operations


# Addition
# Prints 8
echo -n "3 + 5 = "
echo $((3 + 5))

# Subtraction
# Prints 4
echo -n "7 - 3 = "
echo $((7 - 3))

# Multiplication
# Prints 12
echo -n "4 * 3 = "
echo $((4 * 3))

# Division
# Prints 4
echo -n "17 / 4 = "
echo $((17 / 4))

# Modulus
# Prints 2
echo -n "7 % 5 = "
echo $((7 % 5))

# Power
# Prints 32
echo -n "2 ** 5 = "
echo $((2 ** 5))
```

Ve programı çalıştırmak istemeyenler için, programın sonucu böyle oluyor:

```text
3 + 5 = 8
7 - 3 = 4
4 * 3 = 12
17 / 4 = 4
7 % 5 = 2
2 ** 5 = 32
```

### İşlem Sonucunu Değişkene Atamak ve Değişkenler ile İşlem Yapmak

Başlığı önemli birşey anlatacakmış gibi attım ama bu da zor birşey değil.
Hatta burayı okumadan deneme yanılma ile de bulabilirsiniz. 
Doğrudan örnek bir kod yazayım.

```bash
#!/bin/bash
# Shell Scripting
# Aritmetic Operations

X=$((5 + 4))
Y=$((2 + 1))

SUM=$(($X + $Y))
MPY=$(($X * $Y))

echo "sum: $SUM, multiply: $MPY"

# You don't need to use $ sign for variables in $(( ))
SUM=$((X + Y))
MPY=$((X * Y))

echo "sum: $SUM, multiply: $MPY"
```

Yukarıdaki iki örnekte aynı işlemleri iki farklı şekilde yaptım. 
Burada anlatmak istediğim, `$(())` içerisinde kullandığımız değişkenlerin başına `$` işareti koymak zorunda değiliz. 
Yukarıdaki kodu çalıştırdığınızda iki `echo` komutunun da aynı şeyleri ekrana yazdırdıklarını göreceksiniz.

Evet arkadaşlar.
Matematik ile ilgili de yeteri kadar ahkam kestik.
Bundan sonraki yazılarımı da okumanız dileğiyle.
Kodlu kalın.
