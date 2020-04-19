---
layout: post
title:  "Bootstrap 4 - Grid Sistemi"
date:   2019-02-10 21:03:00 +0300
categories: [Bootstrap, Frontend, HTML]
author: Serdar Kuzucu
permalink: /bootstrap-4-grid-system/
comments: true
post_identifier: bootstrap-4-grid-system
featured_image: /assets/posts/bootstrap-4-logo.png
---

Çoğunlukla yazılımcılar için ön yüz geliştirmek bir baş belası haline gelir. 
Asıl işimiz bu olmadığı için bir türlü derinlemesine öğrenmeyiz.

Eğer üzerinde çalışmakta olduğumuz proje geniş bir kitleye hitap etmiyorsa, arayüzünün başkalarından farklı ve daha şık 
olmaya ihtiyacı yoksa, önemli olan kullanılabilirlikse; ben genellikle [Bootstrap](https://getbootstrap.com/) üzerine 
geliştirilmiş ücretsiz bir tema bulup özelliklerimizi onun üzerine entegre ediyorum. Böylece ön yüz geliştirmedeki 
zamandan ettiğimiz tasarruf ile daha sağlam bir backend geliştirebiliyoruz.

<!--more-->

<div class="alert alert-info" markdown="1">

Ücretsiz Bootstrap temalarına [buraya](https://startbootstrap.com/themes/) 
veya [buraya](https://bootstrapmade.com/) tıklayarak göz atabilirsiniz.

Ücretli tasarımları incelemek isterseniz [buraya tıklayın](https://wrapbootstrap.com/themes).
</div>

Bootstrap kütüphanesini web sayfanıza eklediğiniz anda bazı özellikler siz kullanmasanız bile çalışıyor. 
Bu özellikler Bootstrap'in sitesinde [Content](https://getbootstrap.com/docs/4.2/content/reboot/) başlığı altında anlatılmış. 
Bunu yapmasının amacı siz web sitenizde hiçbir CSS kodu yazmasanız bile kullandığınız HMTL taglerinin farklı tarayıcı 
ve işletim sistemlerinde aynı görüntüyü vermesini sağlamaktır. 
Örneğin siz bir `<h1></h1>` tagi kullandığınız zaman Bootstrap kullanmazsanız bu bütün tarayıcılarda farklı görünecektir. 
Bunu sağlamak için eskiden [Eric Mayer'in CSS Reset](https://meyerweb.com/eric/tools/css/reset/) yöntemini kullanırdık. 
Artık Bootstrap kullanarak da default HTML stilini tüm tarayıcılarda aynı görünecek şekilde konfigüre edebiliyoruz.

CSS reset dışında kullanabileceğiniz birçok güzel özellik ile donatılmış Bootstrap kütüphanesini bu blogun arayüzünü 
geliştirirken bolca kullandım. Bu yazıda Bootstrap kütüphanesinde kullanmaktan en çok zevk aldığım özellik olan 
[Grid yapısını](https://getbootstrap.com/docs/4.2/layout/grid/) ele alacağım. 


> <h5>Grid system</h5>
> Use our powerful mobile-first flexbox grid to build layouts of all shapes and sizes thanks to a
> twelve column system, five default responsive tiers, Sass variables and mixins, and dozens of predefined classes.
> <footer class="blockquote-footer">
>   <cite title="Bootstrap Grid System">
>     <a href="https://getbootstrap.com/docs/4.2/layout/grid/" target="_blank" 
>       rel="nofollow">Bootstrap Grid System</a>
>   </cite>
> </footer>

Grid yapısında en beğendiğim özelliklerden birisi mobile-first mottosuyla geliştirilmiş olması ve bize 5 adet 
responsive kırılım sunması. Bu kırılımların 4 tanesinin kendi isimleri varken, en küçük ekranlar için kullanacağımız 
kırılımın bir ismi bulunmamakta. Yani herhangi bir kırılımı ismiyle çağırmadığımız sürece en küçük ekranlar için 
tasarlıyoruz diye düşüneceğiz. En küçük ekran için tasarımı belirledikten sonra eğer sitemiz daha büyük ekranlarda 
farklı görünsün istiyorsak, tek tek bu kırılımları belirteceğiz. Öncelikle bu 5 kırılımı ve kısaltmalarını şöyle 
bir tanıyalım:

<table class="table table-bordered">
<thead class="thead-dark">
<tr>
<th></th>
<th>Extra Small</th>
<th>Small</th>
<th>Medium</th>
<th>Large</th>
<th>Extra Large</th>
</tr>
</thead>
<tbody>
<tr>
<th class="table-dark">Kısaltma</th>
<td>Yok</td>
<td>sm</td>
<td>md</td>
<td>lg</td>
<td>xl</td>
</tr>

<tr>
<th class="table-dark">Ekran Genişliği</th>
<td>&lt;576px</td>
<td>≥576px</td>
<td>≥768px</td>
<td>≥992px</td>
<td>≥1200px</td>
</tr>

<tr>
<th class="table-dark">.container Genişliği</th>
<td>%100 (auto)</td>
<td>540px</td>
<td>720px</td>
<td>960px</td>
<td>1140px</td>
</tr>
</tbody>
</table>

### `.container` Nedir?

Eğer sitemizin yatay olarak tüm ekrana yayılmasını istemiyorsak tüm HTML kodumuzu 
aşağıdaki gibi `class` özelliği `container` olan bir `div`'in içine alabiliriz.

```html
<div class="container">
    Geri kalan her şey buraya 
</div>
```

Container içeriğin sayfanın ortasında olmasını sağlar ve genişliğini sınırlar. 
Yukarıdaki tabloda farklı ekran genişliklerinde container boyutunun ne kadar olduğunu görebilirsiniz. 
Örneğin, 576 pikselden küçük ekranlarda container ekranın tamamını kaplarken, 
genişliği 576 piksel ile 768 piksel arasındaki bir ekranda container 540 piksel alan 
kaplayıp sayfanın tam ortasında yer alacaktır.

Eğer içerik her zaman sayfanın tüm genişliğini kapsasın istiyorsanız, `container` yerine 
`container-fluid` sınıfını kullanmanız yeterli.

### Satır ve Sütunlar

Grid system satır ve sütunlardan oluşur. 

Satırlar `row` sınıfı ile oluşturulur ve sayfada alt alta görünürler. 
Sütunlar dışında içerik barındırmamalıdır.

Satırların içerisine doğrudan sütunlar gelir. 
Sütunlar responsive kullanım tarzınıza bağlı olarak yan yana veya alt alta gelebilirler. 
Sütun oluşturmak için `col`, `col-{boyut}` veya `col-{kırılım}-{boyut}` sınıflarını kullanırız.

Bootstrap grid sistemini kullandığınız alanı 12 eşit parçaya böler. 
Bu parçaları birleştirerek kullanarak sütunlarımızın genişliklerini belirleriz. 
Satırdaki sütunlarımızın genişliklerinin toplamı 12 olursa satırda boş alan bırakmamış oluruz. 

Örneğin satırımızın solunda 4 parça genişliğinde bir sütun olsun 
ve sağında da 8 parça genişliğinde bir sütun olsun istersek aşağıdaki gibi yazabiliriz:

```html
<div class="row">
    <div class="col-4">Sol</div>
    <div class="col-8">Sağ</div>
</div>
```

Bu şekilde yazdığımızda en küçük ekrandan en büyük ekrana kadar tüm ekranlarda sayfanın 
genişliğinin 4/12 kadarı sol tarafına, 8/12 kadarı sağ tarafına ayrılır.

Eğer extra small ve small ekranlarda sütunlar alt alta görünsün ve 100% genişlikte olsun, 
medium ekranlardan itibaren 4 ve 8 parça boyutlarında yan yana olsun istiyorsak, 
sütunları boyutlarını belirterek aşağıdaki gibi ayırabiliriz:

```html
<div class="row">
    <div class="col-md-4">Sol</div>
    <div class="col-md-8">Sağ</div>
</div>
```

Tüm sütunlar eşit genişlikte olsun istiyorsak, güzel haber, 
sütunların boyutlarını belirtmek zorunda değiliz. Aşağıdaki gibi yazabiliriz:

```html
<!-- Yan yana eşit genişlikte iki sütun -->
<div class="row">
    <div class="col">Sol</div>
    <div class="col">Sağ</div>
</div>

<!-- Yan yana eşit genişlikte üç sütun -->
<div class="row">
    <div class="col">Sol</div>
    <div class="col">Orta</div>
    <div class="col">Sağ</div>
</div>
```

Yine tüm sütunlar eşit genişlikte olsun fakat sadece medium ve daha büyük ekranlarda böyle olsun istiyorsanız, 
aşağıdaki gibi sütunları kırılım belirterek yazabilirsiniz. 
Bu sayede medium boyutundan daha küçük ekranlarda sütunlar alt alta gözükürler.

```html
<!-- Medium ve daha geniş ekranlarda yan yana eşit genişlikte iki sütun -->
<!-- Small ve Extra Small ekranlarda alt alta iki div -->
<div class="row">
    <div class="col-md">Sol</div>
    <div class="col-md">Sağ</div>
</div>

<!-- Medium ve daha geniş ekranlarda yan yana eşit genişlikte üç sütun -->
<!-- Small ve Extra Small ekranlarda alt alta üç div -->
<div class="row">
    <div class="col-md">Sol</div>
    <div class="col-md">Orta</div>
    <div class="col-md">Sağ</div>
</div>
```

Farklı kırılımları bir arada kullanabiliyoruz. 
Sütunumuzun her ekran boyutunda farklı bir genişliğe sahip olmasını sağlayabiliriz. 
Aşağıdaki örnekte soldaki sütun her ekran boyutunda farklı genişlikte olacak 
ve sağdaki sütun da satırda geri kalan alanı dolduracak şekilde konumlandırıldı.

```html
<div class="row">
    <!-- Her çözünürlükte farklı bir genişlik tayin edildi -->
    <!-- Ekstra Small: 5 parça -->
    <!-- Small: 4 parça -->
    <!-- Medium: 3 parça -->
    <!-- Large: 2 parça -->
    <!-- Ekstra Large: 1 parça -->
    <div class="col-5 col-sm-4 col-md-3 col-lg-2 col-xl-1">Sol</div>

    <!-- Satırda geri kalan boş alanın tamamını kaplar -->
    <div class="col">Sağ</div>
</div>
```

Sadece bir sütunun genişliğini belirtip gerisine sadece `col` sınıfını verirsek, 
genişliği belirtilmemiş olan sütunlar kendilerine kalan alanı eşit ölçülerde paylaşırlar.

```html
<div class="row">
    <!-- Extra small & small: (12 - 6) / 2 = 3 parça -->
    <!-- Medium & large & extra large: (12 - 8) / 2 = 2 parça -->
    <div class="col">Sol</div>

    <!-- Extra small & small: 6 parça -->
    <!-- Medium & large & extra large: 8 parça -->
    <div class="col-6 col-md-8">Orta</div>

    <!-- Extra small & small: (12 - 6) / 2 = 3 parça -->
    <!-- Medium & large & extra large: (12 - 8) / 2 = 2 parça -->
    <div class="col">Sağ</div>
</div>
```

Eğer bir sütunun genişliğine sütunun içeriği karar versin istiyorsak, 
`col-auto` veya `col-{kırılım}-auto` sınıfını kullanabiliriz. 
Örneğin 200 pixel genişliğinde bir içeriği tutan sütuna `col-auto` sınıfını verirsek 
bu sütun 200 pixel genişliğinde olur. 
Aynı satırda `col` sınıfına sahip bir sütun varsa o sütun da geri kalan tüm alanı doldurur.

```html
<div class="row">
    <!-- Solda içeriğinin genişliği (200px) kadar yer kaplayan sütun -->
    <div class="col-auto">
        <div style="width:200px;">Sol</div>
    </div>

    <!-- Ortada 2 parça genişliğinde sütun -->
    <div class="col-2">Orta</div>

    <!-- Sağda kalan alanın tamamını kaplayan sütun -->
    <div class="col">Sağ</div>
</div>
```

### Bitirirken

Bootstrap'in grid sistemi ile ilgili önemli gördüğüm birçok noktaya parmak bastığımı düşünüyorum. 
Bootstrap birçok faydalı bileşen barındıran büyük bir kütüphane. 
Birçok bileşenini kullanmasanız da sadece grid sistemi için bile kullanılabilir.
