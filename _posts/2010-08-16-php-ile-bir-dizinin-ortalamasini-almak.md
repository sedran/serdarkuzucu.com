---
layout: post
title:  "PHP ile Bir Dizinin Ortalamasını Almak"
date:   2010-08-16 03:54:00 +0300
categories: [Programlama, PHP]
author: Serdar Kuzucu
permalink: /php-ile-bir-dizinin-ortalamasini-almak
comments: true
post_identifier: php-ile-bir-dizinin-ortalamasini-almak
featured_image: /assets/category/php.png
---

Dün araştırdığım bir konuydu bu konu.
Bu işlem için özel bir fonksiyon arıyordum ki,
daha sonra bulduğum arama sonuçlarını incelediğimde kendi saflığıma güldüm.
Ortalama işlemi basit bir for döngüsü ile yapılıyor aslında.
Yazacağımız kodların mantığını düşünecek olursak, 
önce ortalamasını alacağınız dizinizi yazıyorsunuz, 
elemanları sayı olacak tabi.

<!--more-->

Daha sonra `$sum` isminde bir değişken yaratıyoruz 
ve başlangıç değeri olarak sıfır veriyoruz. 
Sonra for döngümüz ile yazdığımız dizideki tüm elemanların toplamını buluyoruz, 
ve sonra o toplamı dizimizin eleman sayısına bölüyoruz. 
Gördüğünüz gibi herşey birkaç ufak matematik işleminden oluşuyor. 
Kodlarımızı yazacak olursak:

```php
<?php
  $numberArray = array(1, 5, 6, 89, 64, 234, 23, 4, 66, 789, 85); // Dizimizi Oluşturduk
  $numberOfElements = count($numberArray); // Dizinin eleman sayısı
  $sum = 0; // Toplam başlangıçta sıfır

  for($i = 0; $i < $numberOfElements; $i++) {
    // Bir önceki döngüden gelen $sum ile dizinin 
    // sıradaki elemanı toplanır, yeni toplam elde edilir.
    $sum = $sum + $numberArray[$i];
  }

  // Çıkan toplam eleman sayısına bölünür, ortalama elde edilir.
  $average = $sum / $numberOfElements;
  echo $average; // Ortalama ekrana yazdırılır.
?>
```

Anlamadığınız kısımlar olursa yorum aracılığıyla bana sorabilirsiniz.
Şu sıralar PHP çalışmaktayım, bildiğim kısımlardan cevap veririm. 

İyi günler dilerim.
