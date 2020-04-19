---
layout: post
title:  "Git Commit Mesajı Nasıl Yazılmalı"
date:   2020-04-19 16:25:00 +0300
categories: [Git]
author: Serdar Kuzucu
permalink: /2020/04/19/git-commit-mesaji-nasil-yazilmali/
comments: true
post_identifier: git-commit-mesaji-nasil-yazilmali
featured_image: /assets/category/git.png
---

Kaynak kodda yaptığımız bir değişikliği versiyon kontrol sistemine kaydederken yapmamız gereken en önemli
maddelerden bir tanesi bu değişikliği iyi yazılmış bir mesaj ile açıklamaktır. Peki iyi bir commit mesajını
diğerlerinden ayıran özellikler nelerdir? Bu yazıda dünya genelinde kabul görmüş bazı standartları göreceğiz.

<!--more-->

Öncelikle iyi yazılmış bir commit mesajı daha sonra ne işimize yarar? Güzel bir alıntı ile başlamak istiyorum.

> Any software project is a collaborative project. It has at least two developers, the original developer and the
> original developer a few weeks or months later when the train of thought has long left the station. This later self
> needs to reestablish the context of a particular piece of code each time a new bug occurs or a new feature needs to 
> be implemented.
>
> Peter Hutterer - [On commit messages](http://who-t.blogspot.com/2009/12/on-commit-messages.html)

Özetle iyi yazılmış bir commit mesajı;

1. Kodda yapılan bir değişikliğin üzerinden zaman geçtikten sonra 
   bu değişikliğin sebebini kodu okuyarak anlamaya çalışmak 
   oldukça zaman alan bir eylemdir.
   İyi bir commit mesajı kodu tekrar okumadan değişikliğin neden yapıldığını bize söyler.

2. Projenin versiyon geçmişinin düzenli ve tutarlı görünmesini sağlar.
   Hangi özellik ne zaman geliştirildi, 
   bir hata hangi commit ile düzeltildi 
   veya ilgili release hangi değişiklikleri içeriyor
   gibi kıymetli bilgilere versiyon geçmişinde sadece commit mesajlarını okuyarak ulaşabiliriz.

3. Yazılan kodu asıl branch'e merge etmeden önce gözden geçiren kişilere yardımcı olur.
   Code-review sürecini hızlandırır.

4. Son olarak bu benim kişisel yorumum, 
   iyi yazılmış bir commit mesajı bir yazılımcının işini özenerek yaptığını gösterir.
   Yaptığı değişiklikleri commit mesajında güzelce açıklamayan bir geliştiriciye bir gün
   "Bu satırı niçin bu şekilde değiştirdin?" diye sormamız gerekebilir 
   ve muhtemelen sebebini o da unutmuş olacaktır. 
   Bu sefer hatırlamak için onun kodu açıp okuması gerekecektir.

Çeşitli kaynaklardan toparladığım kuralları birer birer açıklamadan önce
iyi bir commit mesajı bulup örnek olarak panoya asmanın güzel olacağını düşünüyorum.

Aşağıda spring-boot projesinin github repository'sinden aldığım 
[bir commit](https://github.com/spring-projects/spring-boot/commit/70d4994502c848b3db82845c97a033448356c938) 
mesajını göstermek istiyorum. 
Bu commit'i gönderen [Scott Frederick](https://github.com/scottfrederick) abimiz 
aşağıda yazacağım bütün iyi commit mesajı yazma kurallarını, adeta ibret-i alem için, uygulamış.

    Disable exception details on default error views
    
    Prior to this commit, default error responses included the message
    from a handled exception. When the exception was a BindException, the
    error responses could also include an errors attribute containing the
    details of the binding failure. These details could leak information
    about the application.
    
    This commit removes the exception message and binding errors detail
    from error responses by default, and introduces a
    `server.error.include-details` property that can be used to cause
    these details to be included in the response.
    
    Fixes gh-20505

Kötü yazılmış mesajlara da örnekler vermeyi düşündüm 
fakat iyi yazılmış mesajlar o kadar nadir projelerde bulunuyor ki
rastgele açtığım projelerin çoğunda kötü örnekler mevcut.
Kötü örnekleri çok iyi bildiğiniz için burayı hiç kirletmeyeceğim.

## Kurallar

Artık kuralları incelemeye başlayabiliriz.
İyi bir commit mesajının kuralları:

1. [Başlık ve gövdeyi boş bir satır ile birbirinden ayırın](#bos-satir)
2. [Başlığı 50 karakter ile sınırlandırın](#baslik-50-karakter)
3. [Başlığa büyük harf ile başlayın](#baslik-buyuk-harf)
4. [Başlık satırını nokta ile sonlandırmayın](#baslik-nokta)
5. [Başlığı emir kipi ile yazın](#baslik-emir-kipi)
6. [Gövde satırlarında 72 karakter uzunluğunu geçmeyin](#govde-72-karakter)
7. [Gövdede neyi niçin değiştirdiğinizi açıklayın](#govde-ne-neden)

### Başlık ve gövdeyi boş bir satır ile birbirinden ayırın {#bos-satir}

Git versiyon kontrol sistemi yazdığınız mesajı başlık ve gövde olmak üzere iki parça olarak düşünür.
Versiyon geçmişi üzerinde çalışan birçok git komutu bu ayrımı kullanır. 
Örneğin `git log` komutu tüm commit'lerin mesajlarını tam haliyle listelerken,
`git shortlog` ve `git log --oneline` komutları commit'lerin sadece başlıklarını listeler. 

Git'in bu ayrımı yapabilmesinin tek yolu başlık olarak yazdığınız satır ile
gövde olarak yazdığınız ilk satırın arasında bir boş satır bulunmasıdır.
Boş satır bulunmadığı takdirde Git iki satırı birleştirir ve tek satır gibi düşünür.


### Başlığı 50 karakter ile sınırlandırın {#baslik-50-karakter}

Commit mesajını kısa tutmak okunabilirliğini arttıracaktır.
Aynı zamanda sizi yaptığınız değişiklikleri kısaca özetlemeye zorlayacağı için
yaptığınız değişiklikleri bir kez daha düşünmenizi sağlayacaktır.

Eğer yaptığınız değişiklikleri özetleme konusunda zorluk yaşıyorsanız
gerekenden fazla değişikliği tek bir commit'e yüklemeye çalışıyor olabilirsiniz.
Bu durumda yaptığınız değişiklikleri birden fazla commit'e paylaştırmayı düşünebilirsiniz.

`git commit --help` komutunu kullanarak `git commit` hakkında yardım istediğimizde
terminalimize dökülen uzun yazıda aşağıdaki gibi bir bölüm var:

    Though not required, it's a good idea to begin the commit message with a single short 
    (less than 50 character) line summarizing the change, followed by a blank line and then 
    a more thorough description. The text up to the first blank line in a commit message is 
    treated as the commit title, and that title is used throughout Git. For example, 
    git-format-patch(1) turns a commit into email, and it uses the title on the Subject 
    line and the rest of the commit in the body.

Yani git de başlık satırının 50 karakterden kısa olmasının iyi olacağını söylüyor.

### Başlığa büyük harf ile başlayın {#baslik-buyuk-harf}

Adından anlaşılacağı gibi ilk satırımız commit mesajımızın başlığı görevi görecek.
Tüm başlıklar gibi bu başlığımıza da büyük harf ile başlayalım.

### Başlık satırını nokta ile sonlandırmayın {#baslik-nokta}

Nihayetinde commit mesajının başlığı da bir başlıktır 
ve başlıklar nokta ile bitmemeli.

Ek olarak başlık satırına koyacağınız her bir karakter
kendimize koyduğumuz 50 karakter başlık kotasından tüketmekte.

### Başlığı emir kipi ile yazın {#baslik-emir-kipi}

Git kendisi de commit mesajı üretirken emir kipi (Imperative) kullanmakta.

Örneğin otomatik olarak merge commit oluşturken:

    Merge branch 'release/awesome-feature'

Bu durumda emir kipi ile yazmanın birinci faydası 
git ile aynı kuralları kullanmış oluyoruz.
Bu da versiyon geçmişimizde tutarlılık sağlıyor.

Git'in kendi repository'sinde de aşağıdaki gibi emir kipi ile yazılmasını istemişler.
Sanki koda davranışını değiştirmesi için emir veriyormuş gibi yazın diyorlar. 

> Describe your changes in imperative mood, e.g. "make xyzzy do frotz"
  instead of "[This patch] makes xyzzy do frotz" or "[I] changed xyzzy
  to do frotz", as if you are giving orders to the codebase to change
  its behavior.
>
> [Git Docs](https://git.kernel.org/pub/scm/git/git.git/tree/Documentation/SubmittingPatches?id=HEAD#n133)


Bir diğer faydası da emir kipi ile yazdığımızda özne kullanmayacağımız 
ve fiillere -ed veya -s gibi ekler gelmeyeceği için mesajımızın kısalması.
Böylece başlık satırımızda 50 karakter limiti kuralımızı delmeden daha fazla bilgi verebileceğiz.

##### Yanlış

```Fixes NullPointerException in SubscriptionRestController```

```Fixed NullPointerException in SubscriptionRestController```

```I added direct charging capability for internal partners```

```This commit adds direct charging capability for internal partners```

##### Doğru

```Fix NullPointerException in SubscriptionRestController```

```Add direct charging capability for internal partners```

### Gövde satırlarında 72 karakter uzunluğunu geçmeyin {#govde-72-karakter}

Kod yazarken de kitap yazarken de okunabilirliğin artması için
bir satıra yazılabilcek maksimum karakter sayısı kısıtlanır.
Çok kısa satırlar sürekli satır atlamak zorunda kalacağımız için okumayı zorlaştırır.
Çok uzun satırlar ise okuyanın alt satıra geçeceği zaman satırın başını kaçırmasına sebep olur.

Bilgisayar dünyasında geçmişin teknolojik kısıtlamalarının günümüze bıraktığı bir armağan olan
80 karakter limiti bir çok alanda hala kullanılmakta. 
Bu 80 karakter limitinin nereden geldiği ile ilgili çok güzel bir stackexchange yazısı buldum
linki şuraya bırakıyorum boş vaktiniz olur ve merak ederseniz buyrun:
[Why is 80 characters the 'standard' limit for code width?](https://softwareengineering.stackexchange.com/questions/148677/why-is-80-characters-the-standard-limit-for-code-width)

Peki neden 72 karakter? Çünkü bazı git komutlarında commit mesajlarımıza indentation uygulanır.
Bu indentation 72 karakter olarak yazdığımız satırlarımıza bir miktar boşluk ekler
ve mesajlarımız ekranda yazdığımızdan daha fazla yer kaplar.

Kendimizi 72 karakter ile kısıtladığımızda oluşan çıktı hala 80 karakter limitini aşmamış olur.
80 karakterlik bir terminalde yatay scrollbar'ın görünmesine 
veya yazdığımız satırın terminal tarafından wrap edilmesine sebep olmamış oluruz.


### Gövdede neyi neden değiştirdiğinizi açıklayın {#govde-ne-neden}

Commit mesajımızın gövde kısmında, kodda ne değişiklik yaptığımızı
ve bu değişikliği neden yaptığımızı görmek isteriz.
Değişikliğin nasıl yapıldığı veya kodun nasıl çalıştığını merak edenler kodu okumalı.
Commit mesajında "nasıl" sorusuna cevap aramamalıyız.

Kaliteli bir kod kendisini açıklayabilmelidir.
Eğer açıklayamayacak kadar kompleks bir kodsa, koda yorum yazılmalı.

Koda bakarak anlayamayacağımız şey, bağlamıdır (context). 
Yani bu kod neden yazıldı?
Hangi bug çözülmeye çalışılırken bu satır değiştirildi?
Bu methodun içine bu koşul hangi özellik geliştirilirken eklendi?
İyi bir commit mesajının bunlar gibi sorulara cevap vermesini bekleriz.

Beğendiğim bir diğer mesaj içeriği de yazının başlarında verdiğim örnekteki gibi,
"Bu değişiklikten önce kodun davranışı şu şekildeydi,
bu commit sonrasında artık kodun davranışı bu şekilde olacaktır."
şeklinde anlatmaktır. 
Gördüğüm kadarıyla Spring Boot projesi geliştiricileri bu kuralı uyguluyorlar.

Gövdede değinilebilecek bir diğer konu ise ilgili commit sonrası nelerin eksik kaldığıdır.
Bu commit ile geliştirilecek özelliğin ne kadarı geliştirildi, ne kadarı başka commit'lere adreslendi?
Bu bilginin de commit mesajında çok kıymetli bir veri olacağını düşünüyorum.


## Öneriler

Bu kısımda herkesin kabul ettiği genel geçer kuralların dışında kalan kendi görüşlerime
veya fikir ayrılıklarının olduğu konularda savunduğum görüşe yer vereceğim.

1. [İngilizce yazın](#ingilizce-yazin)
2. [Proje yönetim aracı ID'lerini sona ekleyin](#proje-yonetim-id)
3. [Pair programming yaptığınız kişileri de mesaja dahil edin](#pair-programming)

### İngilizce yazın {#ingilizce-yazin}

Bu madde ile ilgili yazılmış bir şey pek bulamadım o yüzden kendi görüşüm olduğunu belirteyim.
Artık herkes her yerde.
Şu anda çalıştığınız projedeki tüm ekibin Türk olması her zaman böyle kalacağını göstermiyor.
Her an yabancı bir iş arkadaşınız olabilir,
yurt dışından danışmanlık alabilir,
veya projeyi silikon vadisindeki bir firmaya satabilirsiniz.
Daha da güzeli açık kaynak kodlu deyip kaynak kodunuzu dünyanın dört bir yanındaki geliştiricilere açabilirsiniz.

Birçok sektörde olduğu gibi yazılım sektöründe de iletişim dili olarak İngilizce kullanılıyor.
Nasıl ki kodumuzdaki değişkenleri, fonksiyonları, sınıfları, vs Türkçe isimlendirmiyorsak 
(ki aksini savunanlar da yapanlar da var)
versiyon geçmişini de Türkçe tutmamalıyız.

Bu 3-4 sene önce benim de yaptığım bir hataydı.
Şimdi versiyon geçmişinde eskiden Türkçe yazdığım mesajları gördükçe sinirleniyorum.
En kötüsü de üzerine epey commit geldikten sonra o mesajları düzeltememek. :)


### Proje yönetim aracı ID'lerini Sona Ekleyin {#proje-yonetim-id}

Eğer bir proje yönetim aracı, issue tracker, vs kullanıyorsanuz, 
commit mesajının en sonunda, gövde bittikten sonra yine bir satır boşluk bırakıp,
proje yönetim sistemi ID'mizi yazabiliriz.

Bu şekilde kullandığımız farklı tool'ların birbirinden haberinin olmasını sağlayabiliriz.
Daha ileriki zamanlarda commit mesajını inceleyen arkadaşlara 
bu iş ile ilgili daha fazla detayın bulunduğu bir kaynak daha sunmuş oluruz.

Örneğin yazının başında örnek verdiğim commit mesajındaki `Fixes gh-20505` yazan satırda
Github'daki issue ID'sinin referans verildiğini görebiliriz.

Bunu yaparken dikkat edilmesi gereken husus bu issue id'nin commit mesajının
başlığında değil gövdesinde yer almasıdır.

Bunu başlığın başına koyanları gördüm. 
Sonuna koyanları gördüm.
Başlık satırına issue id dışında başka hiçbir şey yazmayanlar olduğunu gördüm.
Başlığın hem başına hem sonuna koyanını bile gördü bu gözler hey gidi.
Bu konuda çok hassasım çünkü çalıştığım ekipte buna direnen gençler var :)

Commit mesajının en sonlarında bir satırda issue id aşağıdakilere benzer bir formatta kullanılabilir:

    Fixes: FCB-8473
    Resolves: FCB-3123
    Issue: TEAM-432
    Ticket: TKT-83823242

Ayrıca issue id yazıyorum nasıl olsa gidip ordan okusunlar diyip de 
commit mesajını açıklayıcı yazmamak çok ayıptır.
Issue tracking sisteminiz o anda hizmet veremiyor olabilir, 
projede çalışan geliştiricilerden birisinin o anda o sisteme erişimi olmayabilir,
veya bizim gibi ara sıra proje yönetim programınızı değiştirebilirsiniz.
Bu sebeple issue id versek dahi commit mesajında yeteri kadar detayı paylaştığımızdan emin olmalıyız.

Issue id eğer commit mesajı başlığında olursa ilgili özellik ile ilgili
tüm commit mesajlarında aşağıdaki gibi aynı issue id kendini tekrar eder
ve görüntü kirliliğine yol açar:

```console
$ git log --oneline
cb5515d21 Merge branch 'fea/FCB-1126-customer-history-report' into 'release/024-port-out-customer-information'
b5d572d32 FCB-1126 Fix test
c7c80cda3 FCB-1126 Change msisdn-history pojo class
ab68a1d7c FCB-1126 Add customer-history page
```

Başlık satırımızdaki 50 karakterlik alan oldukça kıymetli bir alan olduğu için 
issue id yazarak boşa karakter harcamak israf olmaz mı?

Issue ID'ler branch isimlerinde kullanıldığında daha anlamlı olduğunu düşünenlerdenim.
Böylece sadece merge commit'inin başlığında görürüz kendilerini.
Yukarıdaki kötü örnekte bu şekilde yazılmış bir adet de merge commiti göreceksiniz.


### Pair programming yaptığınız kişileri de mesaja dahil edin {#pair-programming}

Eğer pair programming gibi kodu iki kişinin birlikte yazdığı 
fakat klavyeyi tek bir kişinin kullandığı bir yöntem uyguluyorsanız,
birlikte çalıştığınız arkadaşınızın ismini de bir şekilde commit mesajına dahil edin.
 
Bunu yapmak çok kolay.
Sadece üşenmeyip aşağıdakine benzer bir satırı commit mesajının sonuna ekleyebilirsiniz.

    Co-authored-by: Foo Bar <foo.bar@example.com>

Veya birden fazla kişi ile birlikte çalışıyorsanız bunu iki satırda yapabilirsiniz:

    Co-authored-by: Foo Bar <foo.bar@example.com>
    Co-authored-by: John Bob <john.bob@example.com>

Bu şekilde çalışma arkadaşlarınıza da hak ettikleri krediyi vermiş olursunuz.

Unutmayın ki kodu ne kadar oturup birlikte yazarsanız yazın
commit'i kimin hesabı ile yaparsanız tüm kodu o kişi yazmış gibi görünecektir.
Bu sebeple commit atarken birlikte çalıştığımız arkadaşlarımızı da unutmamak lazım.


## Bitti

Bu yazıda yazdığım maddelerin büyük çoğunluğunu 
[Chris Beams](https://chris.beams.io/)'in 2014 yılında yazdığı 
[How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
yazısından öğrendim. 
Bu yazı yıllardır web tarayıcımda yer imi olarak durmaktaydı.
Çalıştığım projelerde gelen Merge Request'leri gözden geçirirken
eğer kötü bir commit mesajı görürsem bu linki yapıştırırdım hemen yorum olarak.

Bu yazıyı Türkçe şekliyle tekrar yazarak 
ve birlikte çalıştığım ekibimle kullandığımız 
veya kullanmayı arzuladığım pratikleri de dahil ederek 
ülkemizde üretilen yazılımların kalitesinde pozitif bir etki oluşturabilmek en büyük temennim.

Kaliteli yazılımcı yaptığı işin dökümantasyonunu da iyi yapar.
Commit mesajları da bana göre en güzel dökümantasyon araçlarından biridir.

Sağlıklı kalın.


## Kaynaklar

* <https://chris.beams.io/posts/git-commit/>
* <http://who-t.blogspot.com/2009/12/on-commit-messages.html>
* <https://corgibytes.com/blog/2019/03/20/commit-messages/>
* <https://yvonnickfrin.dev/a-guide-on-commit-messages>
* <https://hackernoon.com/power-up-your-pair-programming-with-co-authored-commits-on-github-ffb5d049aed3>
* <https://help.github.com/en/github/committing-changes-to-your-project/creating-a-commit-with-multiple-authors>
* <https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html>
