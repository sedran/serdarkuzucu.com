---
layout: post
title:  "PHP ile Code Converter Hazırlamak"
date:   2010-08-17 19:20:00 +0300
categories: [Programlama, PHP]
author: Serdar Kuzucu
permalink: /php-ile-code-converter-hazirlamak
comments: true
post_identifier: php-ile-code-converter-hazirlamak
featured_image: /assets/category/php.png
---

Hani bazen sayfanıza kod yazmak istersiniz de o kod sayfada metin olarak görünmek yerine işlevsel olarak iş yapar. 
Yani siz sayfanızda `<br/>` kodunu yazmak istersiniz fakat sayfada `<br/>` olarak görünmez de 
alt satıra geçme işlevini gerçekleştirir. 
Bu durumda kodlarınızı çevirmeniz gerekir. 
Sizin yazdığınız kodları çevirmek için hazırlanmış çeşitli web siteleri var. 
Bunların en sağlam örneklerinden birisi de [eblogtemplates](http://www.eblogtemplates.com/)'in 
[Blogger Adsense Code Converter](http://www.eblogtemplates.com/blogger-ad-code-converter/)'ıdır.

<!--more-->

Bu yazımızda, PHP ile kendi kod çevirmenimizi nasıl hazırlarız ona bakacağız, ki burda hazır yapılmışı var:

```php
<style>
  body {text-align:center;}
  textarea {border:1px solid #999; width:400px; margin:5px auto;overflow:auto;resize:none;}
  p {border:1px solid #999;padding:5px; width:400px; margin:5px auto;overflow:auto;}
</style>

<form action="code_convert.php" method="post">
  <textarea cols="60" rows="10" name="normal" ></textarea>
  <br/>
  <input type="submit" name="conv" value="Convert!" />
</form>

<?php
if(isset($_POST['conv'])) {
  $normal = htmlspecialchars(htmlspecialchars($_POST['normal']));
  $degismis = nl2br(stripslashes($normal)); 

?>
  <p>Kodunuz: </p>
  <p>
    <code><?php echo $degismis; ?></code>
  </p>
<?php
}
?>
```

Şimdi, kodumuzu inceleyelim biraz. 
Formumuzu oluşturduk, formumuzdaki **textarea** elementi ile kullanıcıdan kodu alıyoruz. 
Gönder butonuna bastığı zaman PHP kodumuz çalışmaya başlıyor. 
PHP kodumuz gelen kodu `$normal` isimli değişkene içindeki 
özel html karakterlerini istediğimiz şekilde çevirip aktarıyor. 
Daha sonra bu çevirmeden kaynaklanan slash karakterlerini temizleyip veriyi 
`$degismis` isimli değişkene aktarıyor. 
Ve son olarak da ekrana yazıyor kodumuzun son halini. 

Burada dikkat etmemiz gereken şey sayfayı **code_convert.php** ismiyle kaydetmek 
veya sayfayı hangi isimle kaydedersek o ismi `<form action=“code_convert.php” method=“post”>` kısmında 
`action` özelliğinin içerisine yazmak.
