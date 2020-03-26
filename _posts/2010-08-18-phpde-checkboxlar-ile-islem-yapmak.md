---
layout: post
title:  "PHP'de Checkbox'lar ile İşlem Yapmak"
date:   2010-08-18 02:30:00 +0300
categories: [Programlama, PHP]
author: Serdar Kuzucu
permalink: /phpde-checkboxlar-ile-islem-yapmak
comments: true
post_identifier: phpde-checkboxlar-ile-islem-yapmak
featured_image: /assets/category/php.png
---

Şu günlerde PHP öğrenirken kendim yüzleşmiş olduğum sorunları yazıyorum.
Şimdi anlatacağım olay mailbox veya bir siteye gönderilmiş mesajları 
toplu olarak onaylama tarzında kodlar geliştirirken çok işinize yarayacaktır eminim. 
Bu yazımı ikiye böleceğim, birinci parçasında basit olarak olayın mantığını kavramaya yönelik bir uygulama yazacağım. 
İkinci parçasında ise işin içinde MySQL da olacak. 
Haydi başlayalım.

<!--more-->

### 1. Basit Bir Checkbox Uygulaması

Burada yapacağımız işlem, checkbox nesneleri sayesinde işaretlediğimiz seçeneklerin ekrana yazdırılması. 
Bunun için bize gereken ilk şey; checkbox'lardan ve 1 adet gönder butonundan oluşan bir form. 
Bir adet örnek form hazırlayalım hemen:

```html
<form action="checkboxes.php" method="post">
   <input type="checkbox" name="secenek[1]" value="Arkadaşlık" /> Arkadaşlık<br />
   <input type="checkbox" name="secenek[2]" value="İlişki" /> İlişki<br />
   <input type="checkbox" name="secenek[3]" value="Çevre Edinme" /> Çevre Edinme<br />
   <input type="checkbox" name="secenek[4]" value="Flört Etme" /> Flört Etme<br />
   <input type="submit" name="send" value="Gönder" />
</form>
```

Formumuz da hazır.
Formda dikkat etmemiz gereken hususlar nelerdir?

1.  Öncelikle *Checkbox* elementlerinin *name* özellikleri bir dizinin elemanlarını oluşturacak şekilde ayarlanmalı. 
    Yani `name="dizi_ismi[eleman_no]"` şeklinde. 
    Her Checkbox aynı dizi ismine sahip olmalı 
    ve o dizinin farklı bir eleman numarasına sahip olmalı, 
    yukarıda görüldüğü gibi.
    
2.  *Checkbox* elemanlarının *value* özellikleri, o *Checkbox*'ın ne için seçildiğini, 
    bize hangi değeri vereceğini gösterir. 
    Yani kullanıcı yanında Arkadaşlık yazan bir *Checkbox*'u işaretliyorsa, 
    biz de ekrana Arkadaşlık yazmak istiyorsak onu işaretlediğinde, 
    *Checkbox*'un değeri(*value*) Arkadaşlık olmalı.
    
3.  *Form* elementinin *action* özelliği bu kodları yazacağınız sayfanın ismi olmalı. 
    Ben sayfayı checkboxes.php ismiyle kaydettiğim için oraya da onu yazdım. 
    Anlatıma da ona göre devam edeceğim. 
    Get methodunu da pek sevmediğim için *Post methodu*nu kullandım.

Şimdi formumuzdan gelecek verileri alacak olan PHP kodlarını yazmaya başlayabiliriz. 
Öncelikle şu ayrıntıya dikkat edelim; 
formun olduğu sayfa ile formdan gelen verilerin yazdırılacağı sayfa aynı olacağı için, 
PHP kodlarımız Gönder butonuna basıldığı zaman form'u gizleyecek ve gelen verileri işleyecek. 
Bunun için `if(!isset($_POST['send']))` koduyla başlayacağız php dosyamıza. 
`$_POST['send']` değişkeni ismi(*name*) **send** olan *Submit* butonuna bastığımızda yaratılır, 
biz de kodumuzu eğer butona basılmamışsa formu göster, 
eğer basılmışsa verileri ekrana yaz şeklinde ikiye böleriz. 
Şimdi geldiğimiz yeri bir görelim:

```php
<?php if(!isset($_POST['send'])) { ?>
<form action="checkboxes.php" method="post">
  <input type="checkbox" name="secenek[1]" value="Arkadaşlık" /> Arkadaşlık<br>
  <input type="checkbox" name="secenek[2]" value="İlişki" /> İlişki<br>
  <input type="checkbox" name="secenek[3]" value="Çevre Edinme" /> Çevre Edinme<br>
  <input type="checkbox" name="secenek[4]" value="Flört Etme" /> Flört Etme<br>
  <input type="submit" name="send" value="Gönder" />
</form>
<?php } ?>
```

Buraya kadar yaptıklarımızı **checkboxes.php** isimli bir dosyaya kaydedip çalıştırabilirseniz, 
Gönder butonuna bastığımızda kaybolan bir form elde etmiş olursunuz. 
Şimdi gönderdiğimiz verileri işlemeye geçelim. 
Şu ana kadar yazdığımız kodlara aynen devam ediyoruz. 
**else** diyerek başlıyoruz çünkü "**eğer butona basılmamışsa formu göster**" şeklinde bir koşul girdik. 
Şimdi bu koşulun zıttı için kod yazıyoruz. 
İlk olarak `$secenek` isminde bir değişken yaratıyoruz 
ve onu post methodu ile gelen **secenek** isimli *dizi*ye eşitliyoruz. 
Yani:

```php
$secenek = $_POST['secenek'];
```

Daha sonra `foreach` döngüsünü kullanarak elimize geçen dizinin tüm elemanlarını ekrana yazıyoruz. 
Geldiğimiz son noktayı da kodlarımıza eklersek:

```php
<?php if(!isset($_POST['send'])) { ?>
<form action="checkboxes.php" method="post">
  <input type="checkbox" name="secenek[1]" value="Arkadaşlık" /> Arkadaşlık<br>
  <input type="checkbox" name="secenek[2]" value="İlişki" /> İlişki<br>
  <input type="checkbox" name="secenek[3]" value="Çevre Edinme" /> Çevre Edinme<br>
  <input type="checkbox" name="secenek[4]" value="Flört Etme" /> Flört Etme<br>
  <input type="submit" name="send" value="Gönder" />
</form>
<?php
} else {
  $secenek = $_POST['secenek'];
  echo "Looking for: <br/>";
  foreach($secenek as $secim) {
    echo $secim;
    echo "<br />";
  }
}
?>
```

Bu kodları **checkboxes.php** ismiyle kaydettiğimiz zaman, uğraştığımız şeyi başardığımızı görüyoruz :)

MySQL veritabanını kullanarak yapacağımız gelişmiş Checkbox uygulamasına da bir sonraki yazımda geçelim. 
Bu gecelik bu kadar yeter, çok yoruldum zaten. 
Şimdilik görüşürüz şekerler.
