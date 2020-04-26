---
layout: post
title:  "Daha Tatlı Bir Git Log"
date:   2020-04-26 05:40:00 +0300
categories: [Git]
author: Serdar Kuzucu
permalink: /2020/04/26/daha-tatli-bir-git-log/
comments: true
post_identifier: daha-tatli-bir-git-log
featured_image: /assets/category/git.png
---

`git log`, Git versiyon kontrol sisteminde oluşturulmuş
commit geçmişini tarihsel olarak sondan başa doğru sırasıyla
konsola yazan bir **Git** komutudur. 
Tek başına kullanıldığında oldukça sıkıcı bir görünüme sahip olan
`git log` komutunu birkaç parametre ile daha tatlı bir hale getirebiliyoruz.

<!--more-->

## Varsayılan Git Log

En basit hali ile 
[spring-boot](https://github.com/spring-projects/spring-boot) 
projesinde `git log` komutunu çalıştırdığımızda
aşağıdaki gibi bir görüntü ile karşılaşırız.

![Normal Git Log](/assets/posts/better-git-log-1.png){:width="600px"}

## Tek Satır Git Log

Yukarıdaki şekilde olduğu gibi uzun uzun açıklamaları okumak istemiyorsak,
sadece commit başlıklarını listelemek istiyorsak, 
`--oneline` parametresini kullanabiliriz.

`git log --oneline` komutunu çalıştırdığımızda 
aşağıdaki çıktıyı elde ederiz.

![Git Log --oneline](/assets/posts/better-git-log-2.png){:width="600px"}

## Graph Şeklinde

Graph şeklinde çıktı almak için `--graph` parametresini kullanabiliriz.

`git log --graph` komutunu çalıştırdığımızda aşağıdaki çıktıyı elde ederiz.

![Git Log --graph](/assets/posts/better-git-log-3.png){:width="600px"}

Bu şekilde ağaç yapısında hangi commit hangi branch'de oluşturulmuş,
hangi branch hangi branch'e birleştirilmiş rahatça görebiliriz.

Eğer commit mesajlarının sadece başlık kısımları görünsün isterseniz
bu komutta da `--oneline` parametresini kullanabilirsiniz.

`git log --graph --oneline` komutunu kullanarak aşağıdaki
görüntüyü elde edebiliriz.

![Git Log --graph --oneline](/assets/posts/better-git-log-4.png){:width="600px"}

## Formatlama

`git log` komutuna `--pretty=format:<string>` parametresini geçerek
kendi istediğimiz bilgiyi istediğimiz şekilde yazmasını sağlayabiliyoruz.

Bu sayede istersek tek bir satırda veya birden fazla satırda 
commit'in id'sini, 
commit'i işaret eden tag ve branch'leri,
commit yazarını (author),
commitin oluşturulduğu tarihi,
commit mesajının başlığını veya tamamını
ve daha birçok alanını çıktı alabiliriz.

Formatı girerken tırnak içerisinde belli başlı bazı parametreleri kullanabiliyoruz.

Aşağıdaki örneğin üzerinden inceleyelim:

```bash
git log --pretty=format:"%h -%d %s (%ar) <%an>"
```

Bu komuttaki formatın içerisinde bulunan parametreler:

* `%h`  : Commit ID'sinin 10 karakter uzunluğundaki kısa hali
* `%d`  : Commit'e işaret eden branch veya tag'lerin parantez içerisinde virgülle ayrılmış listesi
* `%s`  : Commit mesajının başlık satırı (subject)
* `%ar` : Commit tarihinin şimdiki zamana göre göreceli formatı. Örneğin "3 gün önce", "5 dakika önce", vb.
* `%an` : Commit'i oluşturan kişinin (author) ismi

Bu komutun çıktısı aşağıdaki gibi olacaktır:

![Git Log pretty format](/assets/posts/better-git-log-5.png){:width="600px"}

Daha fazla parametreye hakim olmak isteyenlerin 
[Git Log](https://git-scm.com/docs/git-log) dökümantasyonunun
[PRETTY FORMATS](https://git-scm.com/docs/git-log#_pretty_formats)
başlığını incelemelerini tavsiye ederim.

Ben "3 gün önce" gibi göreceli tarihleri sevmediğim için
`%cd` format parametresini kullanıyorum.
Bu parametre ek olarak `--date=format:<string>` parametresini
kullanabilmeme olanak tanıyor.
Böylece istediğim formatta tarih çıktısı da alabiliyorum.

Aşağıdaki komut tarih formatını istediğimiz gibi ayarlayabilmemizi sağlıyor.
Yukarıdaki komuttan tek farkı tarihin `2020-04-25 13:32:43` şeklinde çıkması.

```bash
git log --pretty=format:"%h -%d %s (%cd) <%an>" --date=format:'%Y-%m-%d %H:%M:%S'
```

## Renklendirme

`--pretty=format:<string>` parametresi ile formatladığımız log
tek renk olarak çıktı vereceğinden okuması biraz zor olacaktır.

Eğer istersek formatın herhangi bir alanını 
`%C(<color>)` ve `%C(reset)` arasına alarak renklendirebiliriz.

Bazı durumlarda renklendirme git ayarlarında devre dışı bırakılmış olabiliyor.
Bu sebeple komuta `--color` parametresini de ekleyelim.

Yukarıdaki son örnekte verdiğim komutta
commit id kırmızı,
branch ve tag isimleri sarı,
tarih yeşil,
author koyu mavi olsun istiyorsak 
aşağıdaki gibi parametrelerin etrafını renklerle sarabiliriz.

```bash
git log \
  --color \
  --pretty=format:"%C(red)%h%C(reset) -%C(yellow)%d%C(reset) %s %C(green)(%cd)%C(reset) %C(bold blue)<%an>%C(reset)" \
  --date=format:'%Y-%m-%d %H:%M:%S'
```

Bu komutun çıktısı aşağıdaki gibi olacaktır:

![Git Log pretty format renkli](/assets/posts/better-git-log-6.png){:width="800px"}


## Renkli, Formatlı, Graph Olarak

Yukarıdaki renklendirme başlığında verdiğim örnek komutun sonuna
bir de `--graph` parametresini eklersek eğer,
hem istediğimiz formatta ve renklendirme ile hem de graph halinde
versiyon geçmişimizi görüntülemiş oluruz.

Son iyileştirmeyi de yaptığımız durumda komutumuz şu hale gelir:

```bash
git log \
  --color \
  --pretty=format:"%C(red)%h%C(reset) -%C(yellow)%d%C(reset) %s %C(green)(%cd)%C(reset) %C(bold blue)<%an>%C(reset)" \
  --date=format:'%Y-%m-%d %H:%M:%S' \
  --graph
```

Bu komutu çalıştırdığımızda çıktı aşağıdaki gibi olacaktır:

![Git Log pretty format renkli graph](/assets/posts/better-git-log-7.png){:width="800px"}


## Alias Tanımlama

Yukarıda başlıktan başlığa eklemeler yapıp uzattığımız bu komutu 
her seferinde tekrar elle yazmayacağız veya kopyala yapıştır yapmayacağız.

Bu komutu git'in alias özelliğini kullanarak bir kısayola atayacağız.

Terminalde `git lg` yazdığımızda yukarıdaki uzun komutun çalışmasını sağlayacağız.

Aşağıdaki komutu çalıştırdığınız anda git'in global konfigürasyonunda
`lg` isminde bir alias tanımlanmış oldu.
Böylece `git lg` yazdığımız zaman artık o meşhur uzun komutumuz çalışacak.

```bash
git config --global \
  alias.lg "log --color --graph --pretty=format:'%C(red)%h%C(reset) -%C(yellow)%d%C(reset) %s %C(green)(%cd)%C(reset) %C(bold blue)<%an>%C(reset)' --date=format:'%Y-%m-%d %H:%M:%S'"
```

## Kapanış

Bu komutu ilk olarak epey vakit önce 
[A better git log](https://coderwall.com/p/euwpig/a-better-git-log)
isimli yazıda görmüştüm.
Birkaç yıldır bu yazıda gösterilen alias'ı ben de kullanıyorum ve bağımlılık oldu artık.
Ekibimde işe başlayan her yeni genç yazılımcı arkadaşıma mutlaka bu alias'ı tanımlattırıyorum.

Sizin kendi geliştirici ortamlarınızda kullandığınız benzer formatlar varsa
bu yazının altında yorum olarak paylaşabilirsiniz.

## Kaynaklar

* <https://git-scm.com/docs/git-log>
* <https://coderwall.com/p/euwpig/a-better-git-log>
* <https://www.atlassian.com/git/tutorials/git-log>
