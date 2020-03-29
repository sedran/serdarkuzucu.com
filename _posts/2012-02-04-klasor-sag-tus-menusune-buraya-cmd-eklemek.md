---
layout: post
title:  "Windows: Klasör Sağ Tuş Menüsüne Buraya CMD Eklemek"
date:   2012-02-04 05:49:00 +0300
categories: [Genel, Bilgisayar İpuçları]
author: Serdar Kuzucu
permalink: /klasor-sag-tus-menusune-buraya-cmd-eklemek/
comments: true
post_identifier: klasor-sag-tus-menusune-buraya-cmd-eklemek
featured_image: /assets/posts/win7logo.jpg
---

Windows üzerinde çalışan programcı arkadaşlar bazı işlemler için kendilerine kolaylık sağlamak isteyebilirler.
Mesela bir klasöre komut isteminde ulaşmak için cd komutu ile o klasörün adresini yazmak yerine, 
klasöre sağ tıklayıp "Buraya CMD" gibi bir komutu seçebilmeli insan. 
Bilgisayar mühendisliği öğrencisinin çok değerli proje zamanlarının 
cmd komutlarıyla uğraştırılarak harcanmaması lazım. 
O halde sağ tuş menümüze böyle bir kısayol ekleyelim ve kurtulalım.

<!--more-->

##### Adım 1.

Başlat menüsündeki arama çubuğuna **regedit** yazıp enter'a basıyoruz.
"Kayıt Defteri Düzenleyicisi" isimli programın açılmış olması gerekiyor.


##### Adım 2.

Kayıt Defteri Düzenleyicisi'nde sol tarafta 
**HKEY_LOCAL_MACHINE -> SOFTWARE -> Classes -> Directory -> shell**
adresine gidiyoruz. 
Windows'a düzeltilemez hatalar vermenin mümkün olduğu kayıt defteri üzerinde değişiklik yapmadan önce 
*kayıt defterinizin yedeğini almayı da unutmayın.*

![regedit](/assets/posts/regedit-right-click-cmd-here.png)


##### Adım 3.

**shell** klasörüne sağ tıklıyoruz ve **Yeni -> Anahtar** diyerek shell klasörünün altında 
yeni bir klasör oluşmasını sağlıyoruz. 
Bu klasörümüzün adına **BurayaCMD** koyalım. 
Aslında itiraf etmek gerekirse isminin ne olduğu pek farketmiyor.


##### Adım 4.

Yarattığımız **BurayaCMD** isimli klasöre tıklıyoruz.
Sağ tarafta göreceğimiz **(Varsayılan)** isimli değere çift tıklayalım 
ve açılan kutudaki **"Değer Verisi"** kutusuna **"Buraya CMD"** yazalım. 
Yada klasöre sağ tıkladığımız zaman orada yazmasını istediğiniz herhanbi bir komutu yazabilirsiniz. 
3 ve 4. adımlarda yaptığımız değişiklikler şu şekilde görünüyor olmalı:

![regedit](/assets/posts/cmd-here-regedit.png)


##### Adım 5.

Şimdi yarattığımız **BurayaCMD** klasörüne sağ tıklıyoruz 
ve **Yeni -> Anahtar** diyerek onun altında da ismi **"command"** olan bir klasör yaratıyoruz.
Bu klasröre tıklayıp, sağ tarafındaki **(Varsayılan)** isimli değere de çift tıkladıktan sonra 
açılan kutuya `cmd.exe /k cd %1` yazıp Tamam diyoruz.

![regedit](/assets/posts/regedit-right-click-cmd-here-final.png)

An itibariyle bitmiş olması lazım.
Şimdi herhangi bir klasöre sağ tıkladığınız zaman aşağıdaki resimde gördüğünüz gibi 
**Buraya CMD** seçeneğinin çıkması lazım ve tıklanılınca da komut isteminin o dizin ile başlaması gerekir.

![Buraya CMD](/assets/posts/cmd-here-final.png)

