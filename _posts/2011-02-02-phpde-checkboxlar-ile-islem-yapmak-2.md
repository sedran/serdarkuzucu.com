---
layout: post
title:  "PHP'de Checkbox'lar ile İşlem Yapmak - 2"
date:   2011-02-02 21:15:00 +0300
categories: [Programlama, PHP]
author: Serdar Kuzucu
permalink: /phpde-checkboxlar-ile-islem-yapmak-2
comments: true
post_identifier: phpde-checkboxlar-ile-islem-yapmak-2
featured_image: /assets/category/php.png
---

Şu yarım bıraktığımız işe devam edelim. [İlk yazıda](/phpde-checkboxlar-ile-islem-yapmak), 
PHP’de Checkbox’lar ile basit bir ekrana yazma uygulaması yapmıştık. 
Şimdi ise, bir MySQL tablosundaki kayıtları Checkbox’lar kullanarak toplu halde silme işlemini göstermeye çalışacağım.

<!--more-->

Öncelikle hazırlayacağımız iki sayfa için de MySQL bağlantısı gerekeceği için, 
bağlantıları kuran ayrı bir dosya hazırlayacağız 
ve o dosyayı sayfalarımıza çağıracağız. 
Aşağıdaki kodları kendimize göre düzenliyoruz, ve `baglan.php` isminde kaydediyoruz.

Şimdi, yukarıda belirttiğimiz veritabanının içinde “checkbox” isminde bir tablo olduğunu varsayalım. 
Tablonun içerisinde 3 sütun var, ve görünüşü de şu şekilde:

![phpmyadmin - mysql](/assets/posts/mysql-phpmyadmin.jpg)

Şimdi bu tablodaki kayıtları sıralayan, her kaydın yanına birer checkbox koyan bir arayüz hazırlamamız gerekiyor. 
Ve bir de seçtiğimiz checkbox’lar ile işlem yapmamız için bir butona ihtiyacımız var. 
Aşağıdaki kodları arayuz.php ismiyle kaydedelim.

```php
<?php
include('baglan.php'); // MySQL bağlantımızı kuran dosya
 
$sql = mysql_query("select * from checkbox"); // Checkbox isimli tablodan kayıtları al
echo '<ul>';
echo '<form action="islem.php" method="post">';

while($dizi = mysql_fetch_array($sql)) // Tablodan gelen her satır için bir liste elemanı
{
   $id = $dizi['id'];
   $isim = $dizi['isim'];
   $soyisim = $dizi['soyisim'];
   echo '<li><input name="secenek[' . $id . ']" type="checkbox" value="' . $id . '" /> ' . $isim . ' '.$soyisim.'</li>'; 
} 
echo '<input name="kayit_sil" type="submit" value="Sil" />';
echo '</form>';
echo '</ul>';
?>
```

Bu hazırladığımız sayfa ne yapıyor önce ona bakalım. 
İlk başta include komutu ile daha önceden hazırlamış olduğumuz baglan.php sayfasını kendi içine çağırıyor.
Böylece MySQL veritabanımıza bağlanmış oluyoruz.

Daha sonra $sql değişkenine checkbox tablosundaki satırları atıyoruz.
ul html tagını kullanarak bir liste yaratıyoruz, 
bu listenin içine form‘umuzu oluşturuyoruz ki checkbox’larımız çalışsın. 

Yarattığımız formdan anlayacağımız gibi, formumuz verdiğimiz verileri post metodunu kullanarak 
islem.php isimli bir dosyaya aktarıyor. 
Yani yaratacağımız son dosya islem.php olacak. 
Form yaratıldıktan sonra, while döngüsünü kullanarak, 
tablodaki her satır için bir adet liste elemanı(li) yaratıyoruz, 
liste elemanının içerisine, tablodan getirdiğimiz satır’ın id‘sini 
value ve name‘inde barındıran bir checkbox, 
ve checkbox’un yanına neyi işaretlediğimizi anlamamızı sağlayacak, isim ve soyisim verilerini getiriyoruz. 

While döngümüz sonlandıktan sonra, işaretlediğimiz checkbox’lardaki verileri 
islem.php dosyasına aktarmak için, bir adet buton yaratıyoruz. 
Ve son olarak yarattığımız form ve ul taglarını kapatıyoruz. 
Bu sayfamızın görüntüsü şu şekilde olacaktır:

![Arayüz PHP Checkbox](/assets/posts/arayuz_checkboxes.jpg)

Şimdi gelelim islem.php sayfamıza. 
Bu sayfaya gelecek olan verilere bir bakalım. 
Buton‘a bastığımız zaman, ilk olarak buton‘un name değerini sayfaya göndermiş oluruz. 
Bunu işaretlediğimiz checkbox‘ların name ve value değerleri takip eder. 
Yani islem.php sayfamıza “eğer buton’a tıklanmışsa” şeklinde bir koşul ile başlamamız doğru olacaktır. 
Daha sonra, işaretlenmiş checkbox’ların name değerlerinin oluşturduğu dizinin her işlemi için, 
MySQL’dan silme işlemi yapacağız ve bunu foreach ile sağlayacağız. 
Haydi bir de islem.php sayfamızın içine yazmamız gereken kodlarımıza bakalım.

```php
<?php
include('baglan.php'); // MySQL bağlantımız
 
if(isset($_POST['kayit_sil'])) // Eğer butona basıldıysa
{
  if(isset($_POST['secenek'])) // Eğer seçeneklerden en az biri işaretlenmişse
  {
    $dizi = $_POST['secenek']; // Post ile gelen seçenekler diziye aktarılır.
    foreach($dizi as $secenek) // dizinin her elemanı için tekrar eden döngü
    {
      mysql_query("delete from checkbox where id = '$secenek'"); // MySQL'dan işbu veriyi silme
    }
  }
  else // eğer hiçbir checkbox işaretlenmemişse
  {
    echo "Birşey seçmediniz!"; // ekrana bu yazılır.
  }
}
header("Location: arayuz.php"); // işlem tamamlandığında arayuz.php sayfasına döner
?>
```

Son bir toparlamak gerekirse, islem.php sayfamızın ne yaptığı konusunda, 
ilk satırda gerekli veritabanı bağlantısını sağlamak amacıyla baglan.php sayfasını include ediyor. 
Daha sonra sayfaya eğer butona basılarak gelinmişse, ve eğer checkbox’lar işaretlenmişse, 
işaretlenen her checkbox için, MySQL tablosundan bir kayıt siliyor. 
Eğer işaretlenmiş checkbox yoksa, ekrana birşey seçmediniz yazıyor. 
Daha sonra da header fonksiyonu aracılığıyla arayuz.php sayfasına geri dönüyor.

Anlamadığınız bir kısım olursa, geriye dönüp 
[PHP’de Checkbox’lar ile İşlem Yapmak](/phpde-checkboxlar-ile-islem-yapmak) isimli yazıyı tekrar okuyun. 
Olur da yine bir problem olursa, her zaman yorum olarak geri dönebilirsiniz.
