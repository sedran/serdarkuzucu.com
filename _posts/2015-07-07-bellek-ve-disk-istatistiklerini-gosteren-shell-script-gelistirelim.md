---
layout: post
title:  "Bellek ve Disk İstatistiklerini Gösteren Shell Script Geliştirelim"
date:   2015-07-07 01:27:00 +0300
categories: [Bash, Programlama, Linux]
author: Serdar Kuzucu
permalink: /bellek-ve-disk-istatistiklerini-gosteren-shell-script-gelistirelim
comments: true
post_identifier: bellek-ve-disk-istatistiklerini-gosteren-shell-script-gelistirelim
featured_image: /assets/category/bash.png
---

Merhaba arkadaşlar. 
Bu yazıda, shell script yazma konusunda geliştirdiğimiz becerileri, 
bir takım linux komutlarını ve özelliklerini kullanarak basit bir program yazacağız. 
Bu program, format edilmiş bir şekilde bellekteki ve sabit disklerimizdeki boş alanı gösterecek. 
Bu yazıyı bazı komutların üzerinde durmak istediğim için adım adım yazacağım. 
Öncelikle kemerlerimizi bağlıyoruz.

<!--more-->


## Disk Kullanımını Görmek

Öncelikle hard disklerimizi ve toplam/kullanılan/boş alanları nasıl görebileceğimize bakalım. 
Ben bu işlem için linux'da varolan `df -h` komutunu kullanıyorum. 
Diskler çok büyük depolama alanları olduğu için, bu komuttan gigabyte değerinde ölçüm alıyoruz.

Bir terminal açıp, `df -h` komutunu yazdığınızda, aşağıdakine benzer bir output alacaksınız.

```console
sedrik@localhost ~ $ df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            5,9G     0  5,9G   0% /dev
tmpfs           1,2G  9,4M  1,2G   1% /run
/dev/sda1       129G   21G  102G  17% /
tmpfs           5,9G  754M  5,1G  13% /dev/shm
tmpfs           5,0M  4,0K  5,0M   1% /run/lock
tmpfs           5,9G     0  5,9G   0% /sys/fs/cgroup
/dev/sda6        90G   48G   38G  56% /appdata
cgmfs           100K     0  100K   0% /run/cgmanager/fs
tmpfs           1,2G     0  1,2G   0% /run/user/1001
tmpfs           1,2G   56K  1,2G   1% /run/user/1000
```

Ben diskimi iki partition'a bölmüştüm ve birinci partition'ı `/` adresine mount etmiştim. 
Bu yüzden `/dev/sda1` satırındaki disk kullanımı, birinci partition'ıma ait.

İkinci partition'ımı da `/appdata` adresine mount etmiştim. 
Bu yüzden `/dev/sda6` satırındaki disk kullanımı, ikinci partition'ıma ait. 
Siz de diskinizi iyi tanımalı ve bu aşamada hangi partition'ların 
kullanım istatistiklerini kontrol etmek istediğinize karar vermelisiniz.


## Bellek Kullanımını Görmek

Şimdi de bellekteki toplam/kullanılan/boş alanları nasıl öğrenebileceğimize bakalım. 
Bu işlem için `free -m` komutunu kullanıyorum ben. `-m` seçeneğini kullandığımızda değerleri megabyte cinsinden veriyor. 
Şimdi bir terminal açıp `free -m` komutunu yazarsanız, aşağıdakine benzer bir output alabilirsiniz:

```console
sedrik@localhost ~ $ free -m
             total       used       free     shared    buffers     cached
Mem:         11922       9844       2078       1129        223       7111
-/+ buffers/cache:       2509       9412
Swap:         1951          0       1951
```

Benim gibi siz de yanılabilirsiniz bu komutu kullandığınızda. 
İlk satırdaki kullanılan ve boş bellek miktarı, aslında fiziksel olarak doğru değerler. 
Fakat ubuntu, RAM'de boş yer bulduğunda işlemlerimizde zaman kazandırmak için disk cache yapıyor, 
yani sabit diskimizdeki sık kullandığımız veya kullanma ihtimalimiz olan bilgileri RAM'e kopyalıyor. 
Eğer RAM'e ihtiyacımız olursa aniden, bu yedeklediği bilgileri RAM'den siliyor. 
Dolayısı ile bellek kullanımını monitör etmek istediğimizde, birinci satırdaki bilgileri değil, 
ikinci satırdaki bilgileri kullanırsak daha doğru sonuç elde ediyoruz, içimiz kararmıyor. 
İkinci satırda, disk cache için kullanılmış alanları da free sütununa ekleyerek gösteriyor.

## Komut Sonuçlarından İstenilen Bilgilerin Alınması

`df -h` ve `free -m` şeklinde iki komut gördük. 
Uzun uzun sonuçlar veriyorlar, kafalarına göre formatlıyorlar. 
Peki bu sonuçlardan nasıl istediğimiz bilgileri alıp değişkenlere aktarırız?

Öncelikle istediğimiz satırları alarak başlayalım. 
Pipe (`|`) karakteri, bir komuttan çıkan sonucu diğer komuta input olarak vermemizi sağlıyor. 
Örneğin `df -h | grep "/dev/sda1"` komutunu yazdığımızda, 
`df -h` komutundan çıkan sonucu `grep` komutuna vermiş oluyoruz. 
`grep` komutu da, kendine gelen inputun içerisinden sadece 
istediğimiz anahtar kelimeyi içeren satırları output olarak veriyor, diğerlerini eliyor.

Böylece istediğimiz sabit diske ait istatistikleri tek bir satır halinde bir değişkene aktarabiliyoruz. 
Aşağıdaki kodda benim iki partition'ıma ait istatistikleri `DISK1` ve `DISK2` isimli değişkenlere aktarmış olduk.

```bash
#!/bin/bash
# Shows user friendly disk usage

DISK1=$(df -h | grep "/dev/sda1")
DISK2=$(df -h | grep "/dev/sda6")
```

Şimdi bu satırlardan toplam disk boyutu, kullanılan alan ve boş alan istatistiklerini ayıklayalım. 
`df -h` komutunu çalıştırdığınızda farketmişsinizdir ki, toplam disk boyutu 2. sütunda yer alıyor. 
Kullanılan disk boyutu 3. sütunda, diskteki boş alan da 4. sütunda yer alıyor. 
Peki elimizdeki satırlardan sütunları nasıl ayıklıyoruz? `awk` komutu ile!

Bir programın outputunu pipe (`|`) karakteri ile `awk '{print $1}'` komutuna vermek, 
ekrana o çıkıdaki birinci sütunun değerinin yazılmasını sağlıyor. 
Biz ise 2. 3. ve 4. sütunlara ihtiyaç duyuyoruz, 
o yüzden `awk` komutumuzdaki print edilen sayıyı değiştirmemiz gerekiyor.

Aşağıdaki kod parçası, iki diskin de kullanım istatistiklerini TOTAL, USED ve FREE olmak üzere üçer değişkene bölüyor.

```bash
#!/bin/bash
# Shows user friendly disk usage

DISK1=$(df -h | grep "/dev/sda1")
DISK2=$(df -h | grep "/dev/sda6")

DISK1_TOTAL=$(echo $DISK1 | awk '{print $2}')
DISK1_USED=$(echo $DISK1 | awk '{print $3}')
DISK1_FREE=$(echo $DISK1 | awk '{print $4}')

DISK2_TOTAL=$(echo $DISK2 | awk '{print $2}')
DISK2_USED=$(echo $DISK2 | awk '{print $3}')
DISK2_FREE=$(echo $DISK2 | awk '{print $4}')
```

Şimdi bellek ile ilgili istatistiklere bakalım. 
`free -m` komutu ile bunu yapacağımızdan bahsetmiştik. 
Toplam RAM boyutumuzu, `free -m` komutunda içerisinde "Mem" anahtar kelimesi geçen satırın 2. sütunu söylüyor. 
Bu yüzden bu bilgiyi `free -m | grep "Mem" | awk '{print $2}'` şeklinde alacağız.

Kullanılan ve boş alanları ise `free -m` komutunun "buffers/cache" 
anahtar kelimesi geçen satırının 3. ve 4. sütunları içeriyor. 
Bu yüzden kullanılan RAM bilgisini `free -m | grep "buffers/cache" | awk '{print $3}'` komutuyla öğrenirken, 
boş RAM bilgisini de `free -m | grep "buffers/cache" | awk '{print $4}'` komutuyla öğreneceğiz. 
Aşağıda, kodumuza bellek istatistiklerinin de eklenmiş hali mevcut.

```bash
#!/bin/bash
# Shows user friendly disk usage

DISK1=$(df -h | grep "/dev/sda1")
DISK2=$(df -h | grep "/dev/sda6")

DISK1_TOTAL=$(echo $DISK1 | awk '{print $2}')
DISK1_USED=$(echo $DISK1 | awk '{print $3}')
DISK1_FREE=$(echo $DISK1 | awk '{print $4}')

DISK2_TOTAL=$(echo $DISK2 | awk '{print $2}')
DISK2_USED=$(echo $DISK2 | awk '{print $3}')
DISK2_FREE=$(echo $DISK2 | awk '{print $4}')

MEMORY_TOTAL=$(free -m | grep "Mem" | awk '{print $2}')
MEMORY_USED=$(free -m | grep "buffers/cache" | awk '{print $3}')
MEMORY_FREE=$(free -m | grep "buffers/cache" | awk '{print $4}')
```

## Bilgileri Ekrana Güzelce Yazdıralım

Herşey iyi güzel de, komutu çalıştırınca hala ekranda birşey göremiyoruz diyor musunuz? 
Çünkü ekrana hiçbir şey yazdırmadık. Şimdi `echo` ve `printf` komutları eşliğinde ekrana bu değerleri yazdıralım.

`echo` kullanmayı hepiniz biliyorsunuzdur.
`pritf` kullanmak ise biraz daha zahmetli ama sonu çok güzel bitiyor. 
Bu komuta ilk parametre olarak kullanmak istediğiniz formatı geçiyorsunuz. 
Örneğin 3 kelimeyi 10 karakterlik sütunlara sığdırmak ve aralarına pipe karakteri koymak istiyorsanız, 
şu şekilde `printf` yazmanız yeterli:

```bash
printf "| %-10s | %-10s | %-10s |n" "Kelime1" "Kelime2" "Kelime3"
```

Sonuç olarak size şunu dönecektir:

```text
| Kelime1    | Kelime2    | Kelime3    |
```

Şimdi kodumuza birazcık sanat ekleyelim ve son halini verelim. 
Yukarıda hesapladığımız tüm değişkenleri güzel güzel ekrana yazdıralım. Bendeki kodun son hali şöyle:

```bash
#!/bin/bash
# Shows user friendly disk usage

DISK1=$(df -h | grep "/dev/sda1")
DISK2=$(df -h | grep "/dev/sda6")

DISK1_TOTAL=$(echo $DISK1 | awk '{print $2}')
DISK1_USED=$(echo $DISK1 | awk '{print $3}')
DISK1_FREE=$(echo $DISK1 | awk '{print $4}')

DISK2_TOTAL=$(echo $DISK2 | awk '{print $2}')
DISK2_USED=$(echo $DISK2 | awk '{print $3}')
DISK2_FREE=$(echo $DISK2 | awk '{print $4}')

MEMORY_TOTAL=$(free -m | grep "Mem" | awk '{print $2}')
MEMORY_USED=$(free -m | grep "buffers/cache" | awk '{print $3}')
MEMORY_FREE=$(free -m | grep "buffers/cache" | awk '{print $4}')

TABLE_FORMAT="| %-10s | %-10s | %-10s | %-10s |n"
DIVIDER="+------------+------------+------------+------------+"

echo "$DIVIDER"
printf "$TABLE_FORMAT" "Storage" "Size" "Used" "Free"
echo "$DIVIDER"
printf "$TABLE_FORMAT" "/dev/sda1" "${DISK1_TOTAL:0:-1} GB" "${DISK1_USED:0:-1} GB" "${DISK1_FREE:0:-1} GB"
printf "$TABLE_FORMAT" "/dev/sda6" "${DISK2_TOTAL:0:-1} GB" "${DISK2_USED:0:-1} GB" "${DISK2_FREE:0:-1} GB"
printf "$TABLE_FORMAT" "Memory" "$MEMORY_TOTAL MB" "$MEMORY_USED MB" "$MEMORY_FREE MB"
echo "$DIVIDER"
```

Şimdi bu kodu `monitor` ismiyle bir yere kaydedelim. 
Ben şu şekilde kaydediyorum: ~/myscripts/monitor

Daha sonra `chmod +x ~/myscripts/monitor` komutunu çağırarak yazdığımız script'in çalışabilmesini sağlıyoruz.

Şimdi komutumuzu terminalden şu şekilde çalıştırabiliriz: `~/myscripts/monitor`. Bize şuna benzer bir sonuç verecektir:

<pre class="language-bash command-line" data-output="2-10" data-user="sedrik" data-host="localhost"><code></code></pre>

```console
sedrik@localhost ~ $ ~/myscripts/monitor
+------------+------------+------------+------------+
| Storage    | Size       | Used       | Free       |
+------------+------------+------------+------------+
| /dev/sda1  | 129 GB     | 21 GB      | 102 GB     |
| /dev/sda6  | 90 GB      | 48 GB      | 38 GB      |
| Memory     | 11922 MB   | 2552 MB    | 9370 MB    |
+------------+------------+------------+------------+
```

## Alias Tanımlayarak Kodumuza Her Yerden Erişelim

Şimdi bu yazdığımız koda hep ~/myscripts klasörü altından mı erişeceğiz? 
Haydi gelin bir de alias tanımlaması yapalım da, her yerden tek bir kelime ile bu kodumuzu çalıştırabilelim.

Alias tanımlamak için, `~/.bashrc` veya `~/.bash_aliases` dosyalarından birisini 
gedit programı yardımıyla düzenleyelim. 
Ben alias tanımlamak içni `~/.bash_aliases` dosyasını tavsiye ediyorum, adından belli. 
Şu komutla açabiliriz bu dosyayı: `gedit ~/.bash_aliases`

Açılan gedit penceresinde, aşağıdaki satırı ekleyelim ve kaydedip kapatalım:

```bash
alias monitor=~/myscripts/monitor
```

Daha sonra da terminal pencerelerimizi kapatalım ve tekrar açalım. 
Böylelikle `~/.bash_aliases` dosyası terminale tekrar yüklenmiş olacak. 
Artık terminalde hangi klasörde olursak olalım, `monitor` yazarak programımızı çalıştırabiliriz.

Bu arada kodun içinde bir yerlerde `${DISK2_USED:0:-1} GB` kullandığımı görmüş 
ve dikkatinizi çekmiş olabilir. `df -h` komutu bize sayıların sonuna Gigabyte'ın G'sini ekleyerek veriyor. 
Örneğin: 12G. Biz bunu istemiyoruz. 
O kod, `DISK2_USED` değişkeninin son karakterini yani 'G' karakterini silmeye yarıyor. 
Daha sonra kendim elle bir boşluk bırakıp 'GB' yazıyorum. 
Daha estetik görünüyor.

Efendim hevesle yazdığım bir yazımın daha sonuna geldim. 
Hepinize iyi programlamalar dilerim. 
Kodlu kalın. 
Herhangi bir soru veya yazı talebiniz için bu yazıya yorum bırakabilirsiniz.
