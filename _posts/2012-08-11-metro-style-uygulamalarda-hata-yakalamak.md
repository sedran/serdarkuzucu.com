---
layout: post
title:  "Metro Style Uygulamalarda Hata Yakalamak"
date:   2012-08-11 13:40:00 +0300
categories: [Javascript, Programlama, Windows 8]
author: Serdar Kuzucu
permalink: /metro-style-uygulamalarda-hata-yakalamak/
comments: true
post_identifier: metro-style-uygulamalarda-hata-yakalamak
featured_image: /assets/posts/metro-windows-8.png
---

Microsoft yakın zamanlarda Metro Style Apps isminde yeni bir konsept duyurmuş.
Windows 8 yüklü tüm platformlarda çalışan bir uygulama türüymüş kendisi.
Ben de stajda kendimi bir anda Metro Style Apps geliştirirken buldum.
En güzel yanı dil olarak C#, C++, VB, ve Javascript/HTML5 kullanılabiliyor olması.

<!--more-->

Tabi ki ilk tercihim Javascript oldu.
Lakin error handling falan Javascript'te düşündüğümden çok daha zormuş, 
asenkron işlemler, callback'ler, türü belli olmayan hatalar, 
neden kaynaklandığını anlayamadığım `eval(..)` kod içerisinde patlayan hatalar, 
programın çökmesi falan derken bir türlü önünü alamadım hataların.
Daha sonra dedim bu böyle olmaz, bir iki döküman indirdim Microsoft'un sitesinden 
ve okumaya başladım Metro Style App nedir, ne değildir.

Neyse, okurken fark ettim ki, Metro Style Apps içerisindeki hataları yakalamak 
aslında benim düşündüğümden çok daha kolaymış. 
Neredeyse 3 satır ile programda çıkan tüm hataları görmezden gelebiliyoruz. 
Böylece program çökmemiş oluyor.

İşte o sihirli kodlar:

```javascript
WinJS.Application.onerror = function (customEventObject) {
    // daha sonra debug etmek için hata mesajını yazdıralım.
    console.log("Exception caught: " + customEventObject.detail.errorMessage);

    // true dönmezsek handle edilmemiş hatalar programı çökertir.
    return true;
};
```

Metro Style Application geliştirmek bana çok eğlenceli geldi.
Özellikle de bu hata yakalama mekanizmasını indirdiğim pdf'den okuduğumda.
Okuduğum İngilizce dökümanları da sizle paylaşayım son olarak. 

Öncelikle, [Metro Style Application nedir, ne değildir?][what-is]

    NOT (2020): Bazı linkler microsoft sitelerinden kaldırılmışlar.
    Bu sebeple buradan da silmek zorunda kaldım.

[what-is]: http://msdn.microsoft.com/en-us/library/windows/apps/hh974576.aspx
