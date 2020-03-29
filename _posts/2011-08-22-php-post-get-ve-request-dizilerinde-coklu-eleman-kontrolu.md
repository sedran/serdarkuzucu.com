---
layout: post
title:  "PHP Post, Get ve Request Dizilerinde Çoklu Eleman Kontrolü"
date:   2011-08-22 14:34:00 +0300
categories: [PHP, Programlama]
author: Serdar Kuzucu
permalink: /php-post-get-ve-request-dizilerinde-coklu-eleman-kontrolu/
comments: true
post_identifier: php-post-get-ve-request-dizilerinde-coklu-eleman-kontrolu
featured_image: /assets/category/php.png
---

PHP yazarken en çok vaktimizi alan şeylerden birisi formlardan gelen verileri doğrulamaktır. 
POST, GET veya REQUEST, veri hangi method ile geliyor olursa olsun, 
bizim kullanıcı bu alanı doldurmuş mu, 
veya veriyi gönderen sayfada böyle bir alan var mı diye kontrol etmemiz gerekir. 
Bunun için de gelmesi ihtimali olan her değişken için tek tek `isset()` methodunu kullanırız. 

<!--more-->

Örneğin:

```php
if( isset($_POST['username']) && isset($_POST['password']) ) {
   // işlemler...
}
```

Veya biraz daha kısa bir şekilde:

```php
if( isset($_POST['username'], $_POST['password']) ) {
   // işlemler...
}
```

Şimdi bu işlemi biraz daha kısaltacak bir fonksiyonu tozlu kod kütüphanemden çıkarıp sizlerle paylaşıyorum.
Bu fonksiyon sayesinde birden fazla `isset()` yazmaktan, veya birden fazla `$_POST` yazmaktan kurtulacağız.

```php
function post_isset() {
   $args = func_get_args();

   foreach($args as $arg) {
      if( !isset($_POST[$arg]) ) {
         return false;
      }
   }

   return true;
}
```

Fonksiyon, ona parametre olarak gönderdiğimiz her indexin `$_POST` dizisinde var olup olmadığına bakar 
ve bir tanesi bile yoksa false return eder. 
Mantık olarak basit, pratikte çok işe yarayan bir fonksiyon. 
Kullanırken de uzun uzun `$_POST['index']` yazmak yerine sadece 'index' yazıyoruz parametre olarak. 
Örneğin:

```php
if( post_isset('username', 'password') ) {
   // işlemler...
}
```

Aynı fonksiyonu `$_GET` ve `$_REQUEST` dizilerinin kontrolü için de yazabiliriz:

```php
function get_isset() {
   $args = func_get_args();

   foreach($args as $arg) {
      if( !isset($_GET[$arg]) ) {
         return false;
      }
   }

   return true;
}
```


```php
function request_isset() {
   $args = func_get_args();

   foreach($args as $arg) {
      if( !isset($_REQUEST[$arg]) ) {
         return false;
      }
   }

   return true;
}
```

Şu linkte de önceden yazmış olduğum örnek bir kodlama bulunuyor belki işe yarar:
[http://codepad.org/fW5cgban](http://codepad.org/fW5cgban)

Bu kısa yazımız da bu kadar. 
Yeri geldikçe kütüphanemden faydalı, basit fonksiyonlar aktaracağım. 
İşinize yaradıysa ne mutlu canlar!
