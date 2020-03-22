---
layout: post
title:  "Shell Scripts: if / elif / else"
date:   2015-06-28 05:41:00 +0300
categories: [Bash, Programlama, Linux]
author: Serdar Kuzucu
permalink: /shell-scripts-if-elif-else
comments: true
post_identifier: shell-scripts-if-elif-else
featured_image: /assets/category/bash.png
---

Merhaba arkadaşlar. 
[Linux Shell Script Geliştirmek](/linux-shell-script-gelistirmek) diye başladığım 
yazı dizisinin bir diğer yazısında daha birlikteyiz. 
Yavaş yavaş daha akıllı programlar yazar hale gelmeye başlıyoruz. 
Bir önceki yazımda, [while ve until döngülerini](/shell-scripts-while-ve-until-donguleri) görmüştük. 
Bu yazıda da programlamanın olmazsa olmazlarından, if (eğer) komutunu inceleyeceğiz.

<!--more-->

if komutu bizim belirteceğimiz bir koşulu kontrol eder. 
Eğer koşul doğru ise, yine bizim istediğimiz kodu çalıştırır. 
İstersek koşul doğru olmadığında başka bir koşulu kontrol edebilir (elif) 
veya belirttiğimiz hiçbir koşul doğru olmadığında (else) çalıştırılacak kodu söyleyebiliriz.

Öncelikle if komutunu syntax(söz dizimi) olarak inceleyelim.

```bash
#!/bin/bash

# Sadece if
if [[ koşul1 ]]; then
    # koşul1 doğru olduğunda çalışacak kod
fi


# if ve else
if [[ koşul1 ]]; then
    # koşul1 doğru olduğunda çalışacak kod
else
    # koşul1 doğru olmadığında çalışacak kod
fi


# if ve elif
if [[ koşul1 ]]; then
    # koşul1 doğru olduğunda çalışacak kod
elif [[ koşul2 ]]; then
    # koşul1 yanlış olduğunda ve
    # koşul2 doğru olduğunca çalışacak kod
fi


# if, elif ve else
if [[ koşul1 ]]; then
    # koşul1 doğru olduğunda çalışacak kod
elif [[ koşul2 ]]; then
    # koşul1 yanlış olduğunda ve
    # koşul2 doğru olduğunca çalışacak kod
else
    # koşul1 ve koşul2 doğru olmadığında çalışacak kod
fi
```

Şimdi örnek olarak RAM'de kalan boş yere göre vereceği mesaj değişecek olan bir kod parçası geliştirelim. 
Öncelikle benim geliştirmiş olduğum, basitçe bellek istatistiklerini okuyup değişkenlere aktaran 
ve süslü bir şekilde ekrana yazdıran kodu veriyorum. 
Daha sonra bu koda `if/elif/else` yapısını kuracağız.

```bash
#!/bin/bash
# if / elif / else

TABLE_FORMAT="| %-10s | %-10s | %-10s |n"
divider="===================="
divider="$divider$divider"

total_memory=$(free -m | grep "Mem:" | awk '{print $2}')
used_memory=$(free -m | grep "Mem:" | awk '{print $3}')
free_memory=$(free -m | grep "Mem:" | awk '{print $4}')

echo "$divider"
printf "$TABLE_FORMAT" "Total" "Used" "Free"
echo "$divider"
printf "$TABLE_FORMAT" "$total_memory MB" "$used_memory MB" "$free_memory MB"
echo "$divider"
```

Göz korkutmasın. 
Önceki yazılarda gösterdiğim değişken tanımlama 
ve bir komutun sonucunu bir değişkene aktarma dışında ekstra birşey kullanmadım. 
Geri kalan yabancı terimler standart linux komutları. 
`free` komutu ile bellekteki boş alan hesaplanıyor, 
`grep` komutu ile `free` komutunun sonucundan içinde "Mem:" geçen satır ayrıştırılıyor 
ve `awk` komutuyla sırasıyla bu satırdaki ikinci, üçüncü ve dördüncü sütunlardaki veriler değişkenlere aktarılıyor. 
Bu programı çalıştırınca aşağıdaki tabloyu çiziyor ekrana:

```text
========================================
| Total      | Used       | Free       |
========================================
| 11909 MB   | 7373 MB    | 4535 MB    |
========================================
```

Tabi tablodaki sayıların bilgisayardan bilgisayara değişeceğini söylememe gerek yok. 
Şimdi bu koda ufak bir ekleme yapıp, boş bellek yüzdesini hesaplayıp, düzgün bir hata/uyarı/bilgi mesajı vereceğiz.

```bash
#!/bin/bash
# if / elif / else

TABLE_FORMAT="| %-10s | %-10s | %-10s |n"
divider="===================="
divider="$divider$divider"

total_memory=$(free -m | grep "Mem:" | awk '{print $2}')
used_memory=$(free -m | grep "Mem:" | awk '{print $3}')
free_memory=$(free -m | grep "Mem:" | awk '{print $4}')

echo "$divider"
printf "$TABLE_FORMAT" "Total" "Used" "Free"
echo "$divider"
printf "$TABLE_FORMAT" "$total_memory MB" "$used_memory MB" "$free_memory MB"
echo "$divider"

free_percent=$((free_memory * 100 / total_memory))

if [[ "$free_percent" -gt "50" ]]; then
    echo "We are safe. Memory=$free_memory MB. $free_percent%"
elif [[ "$free_percent" -gt "30" ]]; then
    echo "We are OK. Memory=$free_memory MB. $free_percent%"
else
    echo "We are in danger. Memory=$free_memory MB. $free_percent%"
fi
```

Gördüğünüz gibi, 
`free_percent=$((free_memory * 100 / total_memory))` ile boş belleğin toplam belleğe yüzdesini hesapladık 
ve `if [[ "$free_percent" -gt "50" ]];` ile belleğin yüzde 50'den fazlası boş mu kontrolünü yaptık. 
Eğer belleğin yüzde 50'den fazlası boşsa, güvendeyiz mesajı verdik. 
`elif [[ "$free_percent" -gt "30" ]];` ile belleğin yüzde 30'undan fazlası boş mu kontrolü yaptık 
ve sonrasında sorun yok mesajı verdik. 
Eğer boş bellek yüzdesi yüzde 30'dan daha düşük bir seviyedeyse, tehlikedeyiz uyarısını yaptık. 
Şimdi bu kodu benim bilgisayarımda çalıştırdığımızda ne sonuç veriyor tekrar paylaşayım.

```text
========================================
| Total      | Used       | Free       |
========================================
| 11909 MB   | 7859 MB    | 4050 MB    |
========================================
We are OK. Memory=4050 MB. 34%
```

İşte `if/elif/else` kullanımı bu kadar basit.

Şimdi interaktif ve istenildiği kadar toplama çıkarma yapılabilen bir hesap makinası yapalım.

```bash
#!/bin/bash
# if/elif/else

SUM=0
operation="+"

while [[ "$operation" != "=" ]]; do
    echo -n "Operation >> "
    read operation
    
    if [[ "$operation" = "+" ]]; then
        echo -n "Enter operand >> "
        read operand
        SUM=$((SUM + operand))
    elif [[ "$operation" = "-" ]]; then
        echo -n "Enter operand >> "
        read operand
        SUM=$((SUM - operand))
    elif [[ "$operation" = "=" ]]; then
        echo -n "Exiting... "
    fi
    
    echo "SUM is now $SUM"
done
```

Bu program önce kullanıcıdan bir işlem girmesini istiyor. 
Kullanıcı `+`, `-`, veya `=` işaretlerinden birisini girebilir bu aşamada. 
Eğer kullanıcı `+` işaretini girerse, program bir tane sayı girmesini istiyor. 
Sayı girilince, girilen sayı `SUM` isimli değişkene ekleniyor. 
Eğer kullanıcı `-` işaretini girerse, program yine bir tane sayı girmesini istiyor. 
Sayı girilince, girilen sayı `SUM` isimli değişkenden çıkartılıyor. 
`=` işareti girildiğinde ise program kapanıyor.

Örnek bir kullanım çıktısını paylaşıyorum aşağıda:

```console
sedrik@localhost ~ $ ./5_HelloWorld
Operation >> +
Enter operand >> 1
SUM is now 1
Operation >> +
Enter operand >> 2
SUM is now 3
Operation >> -
Enter operand >> 1
SUM is now 2
Operation >> =
Exiting... SUM is now 2
```

`if / elif / else` hakkında söyleyeceklerim şimdilik bu kadar. 
Bir ara hatırlatırsanız, 
if komutlarında veya döngülerde koşul olarak kullanılabilecek özel yapılara değinmek istiyorum. 
Şimdilik kalın sağlıcakla.
