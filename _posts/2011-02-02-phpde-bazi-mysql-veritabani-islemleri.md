---
layout: post
title:  "PHP’de Bazı MySQL Veritabanı İşlemleri"
date:   2011-02-02 12:02:00 +0300
categories: [Programlama, PHP]
author: Serdar Kuzucu
permalink: /phpde-bazi-mysql-veritabani-islemleri/
comments: true
post_identifier: phpde-bazi-mysql-veritabani-islemleri
featured_image: /assets/category/php.png
---

PHP’de yeni başlayanların veya kısa bir süredir içinde olan çoğu kişinin dahi bildiği belli başlı MySQL işlemleri var. 
Bu yazı bunlar için değil, çünkü araştırırsanız bu işlemleri anlatan birçok Türkçe kaynak halihazırda var. 
O yüzden insert, into, select, delete, update gibi işlemlerden hiç bahsetmiyorum bile. 

<!--more-->

Bunun yerine sizi Yakuter’e gönderiyorum: 
[PHP ile Veritabanı (Mysql) İşlemleri](http://www.yakuter.com/php-ile-veritabani-mysql-islemleri/)

Benim burada bahsetmek istediklerim daha çok tablodaki sütunları değiştirme, 
silme, tablo silme ve sütun ekleme gibi işlemler.

İlk olarak varolan bir tabloya yeni bir sütun ekleyeceğiz.

```php
// Tabloya yeni sütun eklemek:
mysql_query("ALTER TABLE tablo_ismi ADD sütun_ismi INT");
```

Buradaki INT kelimesi de sütun tipidir. 
Onu da kendinize göre değiştirmeyi unutmayın(Örneğin: CHAR(30), TEXT, datetime,..).

Eğer isterseniz tabloya sütun ekleme işlemini biraz daha özelleştirebilir, 
ekleyeceğiniz sütunu herhangi bir sütunun arkasına da ekleyebilirsiniz:

```php
// Tabloya yeni sütun eklemek:
mysql_query("ALTER TABLE tablo_ismi ADD sütun_ismi INT AFTER baska_sütun_ismi");
```

Eğer bu kodu her sütun için tekrar tekrar yazmak istemiyorsanız, 
tek seferde birden fazla sütun da ekleyebilirsiniz:

```php
// Tabloya tek seferde birden fazla sütun eklemek
mysql_query("ALTER TABLE tablo_ismi
  ADD sütun1 CHAR(30) AFTER sütun0,
  ADD sütun2 CHAR(30) AFTER sütun1,
  ADD sütun3 CHAR(4) AFTER sütun2,
  ADD sütun4 CHAR(20) AFTER sütun3,
  ADD sütun5 CHAR(20) AFTER sütun4
");
```

Şimdi de, varolan bir sütunun ismini ve/veya türünü değiştirmeye geldi sıra:

```php
// Sütunun ismini değiştirmek
mysql_query("ALTER TABLE tablo_ismi CHANGE sütun_ismi yeni_isim VARCHAR(15)");
```

Sütunun ismini değiştirmek için yukarıdaki kodda CHANGE'den sonra ilk olarak sütunun şu anki adını,
ikinci olarak da yeni vereceğimiz ismi yazıyoruz. 
Sütun tipinin değişmesini istemiyorsak, o sütunun şu anki türünü yazıyoruz oraya.

```php
// Sütunun türünü değiştirmek
mysql_query("ALTER TABLE tablo_ismi CHANGE sütun_ismi sütun_ismi CHAR(30)");
```

Sütunun türünü değiştirmek istiyorsak da, 
CHANGE'den sonra iki kere sütunun şu anki ismini yazıyoruz 
ve sütun türü kısmına sütuna vereceğimiz yeni türü yazıyoruz.

Şimdi de, tablodaki bir sütunu yok edelim.

```php
// Tablodan bir sütun silmek
mysql_query("ALTER TABLE tablo_ismi DROP sütun_ismi");
```

Ve son olarak, tabloyu silelim.

```php
// Tabloyu silmek.
mysql_query("DROP TABLE tablo_ismi");
```

Bugünlük yazmak istediklerim bunlar. 
Bu komutları her yazmam gerektiğinde uzun bir araştırma yapar, aynı ingilizce siteyi bulur, okurdum. 
Yer imlerime eklemek yerine buraya yazmayı tercih ettim. 
Umarım faydalı olur.
