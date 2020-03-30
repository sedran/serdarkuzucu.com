---
layout: post
title:  "Sedran Renamer Beta!"
date:   2011-02-24 23:03:00 +0300
categories: [Programlarım]
author: Serdar Kuzucu
permalink: /sedran-renamer-beta/
comments: true
post_identifier: sedran-renamer-beta
featured_image: /assets/category/java.png
---

Ciddi anlamda oturup uğraştığım ilk java programım Sedran Renamer'ın beta versiyonunu hazırladım. 
İlgilenenler [bu linkten](http://www.box.net/shared/zholg6vkpz) indirebilirler. 
Bu ne ki diyenler var gibi. 
Anlatalım o zaman.

<!--more-->

Bu program ile belirli bir klasörün içerisindeki bütün dosyaları 
aynı isim ve farklı numaraları kullanarak isimlendirebilirsiniz. 
Peki bu ne işe yarar? 
Güzel hoş görünen bir fotoğraf arşivi yapmanıza demek geliyor ilk aklıma. 
Örneğin bir klasörünüz var ve içerisinde yaklaşık 200 tane facebooktan indirilmiş fotoğraf. 
Çoğumuz bilir, facebooktan indirilen fotoğrafların isimlerinin nasıl olduğunu 
(mesela: 149848_474144643210_719258210_5526981_1391865_n). 
Biz bu klasördeki bütün fotoğrafların isimlerini tatil{1}, tatil{2}, tatil{3} 
şeklinde veya daha farklı şekillerde değiştirmek için ne kullanmalıyız?

Cevap: Sedran Renamer Beta!

Programın kullanılışından kısaca bahsetmek istiyorum. 
Programı indirdiniz, kurulum yok. 
Hemen çalışır. 
Ardından yukarıdaki "Klasör" butonunu kullanarak klasör seçme penceresini açtınız. 
Oradan içerisinde ismini değiştireceğiniz dosyaların bulunduğu klasörü de seçtiniz. 
Programın orta yerinde bütün dosyaların isimlerinin sıralandığını gördünüz. 
Oradan isterseniz birkaç tanesini CTRL tuşunu basılı tutarak seçin, 
isterseniz de "Tümünü Seç" butonu ile hepsini seçin, ama birşeyler seçin. 
Seçtik. 
Daha sonra alttaki yeni isim kutusuna geldik. 
Oraya isim ve numarayı belirli bir formatta yazmamız gerekiyor. 
Programın otomatik olarak vereceği numarayı temsilen bir yerine mutlaka `{#}` yazmamız gerekiyor. 
Örneğin dosya isimlerinin serdar_1 olmasını istiyorsak, o kutuya `sedran_{#}` yazmamız gerekiyor. 
`{#}` haricinde yazacağınız karakterler program için özel bir anlam ifade etmiyor. 
Daha sonra da "Değiştir" butonuna bastık, ve gördüğünüz gibi, isimler değişti.

Program henüz beta aşamasında. 
Bulduğunuz hataları buradan bana iletirseniz mutlu olurum :)

<a href="http://www.box.net/shared/zholg6vkpz" 
   style="margin-left: 1em; margin-right: 1em;">
  <img border="0" 
       height="50" 
       src="/assets/posts/download.png" 
       width="50" />
</a>
Boyut: 4.5 KB

##### Ekran Görüntüleri

İsimleri değişmeden önce:

![Sedran Renamer Beta](/assets/posts/sedran-renamer-before.png)

Alana `{% raw %}tatil{{#}}{% endraw %}` yazılıp tüm dosyalar seçilerek işlem yapıldıktan sonraki görüntü:

![Sedran Renamer Beta](/assets/posts/sedran-renamer-after.png)
