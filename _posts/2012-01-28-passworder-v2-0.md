---
layout: post
title:  "Passworder v2.0"
date:   2012-01-28 04:02:00 +0300
categories: [Programlarım]
author: Serdar Kuzucu
permalink: /passworder-v2-0/
comments: true
post_identifier: passworder-v2-0
featured_image: /assets/posts/lock-icon.png
---

Önceki [yazım](/passworder-v1-0)da belirttiğim gibi 
"Passworder, belirli bir algoritma ile verilen herhangi bir dosyayı belirtilen parola ile şifreleyen 
ve kendisi tarafından şifrelenmiş herhangi bir dosyayı 
tekrar eski haline geri getirebilen basit bir Java uygulaması." 
Lakin önceki yazımda yazdığım notta da belirttiğim gibi 
"Profesyonel amaçlar için kullanılması tehlikelidir. 
Programın şifreleme algoritması o kadar da güçlü değil çünkü. 
Birileri saatlerini harcayarak mantığını çözebilir, şifreleri kırabilir."

<!--more-->

Dediğim gibi oldu ve bölüm arkadaşım şifreyi programı paylaştığım gün kırdı.
Şimdi versiyon güncelleme zamanıdır o zaman.
Algoritmayı tamamen değiştirdim.
Arayüze dokunmadım.
Arayüz zaten ilk versiyonda en çok vakit harcadığım kısmıydı, güzel de oldu diye düşünüyorum.
İlk versiyonun algoritmasını da programı kıran arkadaşımın ağzından sizlerle paylaşayım:

<div class="card">
<div class="card-body">
<blockquote class="blockquote">
arkadaslar sifreyi bulmak çok basit. 
dosyayı bir hex editorle açın. 
ilk 4 byte bir offset. 
sonraki 4 byte sifrenin uzunluğu. 
sonra sifrenin uzunluğu kadar geriye sayma şeklinde byte yazılmış.
(mesela 00 00 00 02 ise ondan sonra 01 00 gelir.) 
bundan sonra 15lik unicode char arrayi(uzantıyı tutuyor.) 
bu yerden offset kadar giderseniz de, sifreyi görürsünüz. 
sifreden sonra datanın kalan kısmı geliyor. 
Data ise 0xFF ile xorlanarak gizlenmeye çalışılmıştır.

aslında 02 01 00 kısım şifre harflerin yerini söylüyormuş mesela 
"02 01 00 03 04" ile "m h a e t" eşleştirirseniz, 
a=00 h=01 m=02 e=03 t=04 olur ve şifre ahmet olarak bulursunuz.
</blockquote>
</div>
</div>

Evet ilk versiyonda çıplak gözle görülebilen bu şeylere bu versiyonda pek rastlayamayacaksınız.
Rastlasanız da anlamayacaksınız.
Saygılar.

**Programı bu linkte bulabilir, indirebilirsiniz:**
<http://www.box.com/s/aoptn491snotr89d6f4v>

