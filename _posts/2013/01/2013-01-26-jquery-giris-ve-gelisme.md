---
layout: post
title:  "jQuery Giriş ve Gelişme"
date:   2013-01-26 04:31:00 +0300
categories: [Programlama, Javascript, jQuery]
author: Serdar Kuzucu
permalink: /jquery-giris-ve-gelisme/
comments: true
post_identifier: jquery-giris-ve-gelisme
featured_image: /assets/category/jquery.gif
---

[prototype]: http://en.wikipedia.org/wiki/Prototype.js

Günümüzde Javascript'in web programlama alanında ne denli önemli bir dil olduğunu artık açıklamaya gerek yok.
Client tarafında neredeyse her işi artık Javascript ile yapıyor hale geldik.
Aslında, Javascript yaygınlaşmadan önce client tarafında hiçbir şey yapmıyorduk.
Sayfalar düz HTML sayfalarıydı, bir linke veya bir butona tıkladığımızda sayfanın yeniden yüklenmesini bekliyorduk.
Örneğin Facebook'daki like butonuna tıkladığınızda tüm sayfanın yeniden yüklendiğini düşünün.
Tüm o yazılar, resimler, görüntü...
Ne amelelik değil mi?

<!--more-->

İlk Javascript öğrenmeye başladığım zamanlar uzun uzun scriptleri okuyup anlamaya çalışırdım,
her şey birbirine girerdi.
Basit bir animasyon için upuzun kodlar yazılırdı.
Okurken içinde kaybolmamak mümkün değildi.
Daha sonra bu konuda geliştiricilere yardımcı olmak amacıyla bir sürü Javascript kütüphanesi pörtlemeye başladı.
Adını ilk duyduğum kütüphane [prototype.js][prototype] idi. 
O zamanlar popülerdi fakat hiç uğraşıp öğrenmeye çalışmadım. 
Sonra jQuery çıktı. 
Hayatımda işleri bu kadar kolaylaştıran bir library daha görmedim desem çok abartmış olmam bence.

jQuery hem DOM(Document Object Model) nesnelerine erişimi çok kolaylaştırıyor, 
hem de bu nesneleri yönetmeyi. 
CSS seçicilerini kullanarak DOM objelerini seçebiliyor, 
çeşit çeşit jQuery fonksiyonlarıyla bu nesnelere taklalar attırabiliyoruz.
Şimdi jQuery seçicilerinden başlayarak jQuery'ye bir giriş yapalım.


### 1. jQuery Seçicileri(jQuery Selectors)

jQuery seçicilerinin aslında genel olarak CSS seçicilerinden pek bir farkı yok. 
Zaten jQuery'nin temel amacı da bu denilebilir.
Bir HTML objesine CSS ile nasıl erişiyorsak, jQuery ile de o şekilde erişiyoruz.
Örnekler üzerinden inceleyelim.


#### 1.1. Etiket(Tag) Seçicisi

Bir elemanı etiketinden seçebilmek için doğrudan o etiketin ismini yazarız ve başına herhangi bir işaret koymayız.
Javascript'de `getElementsByTagName` komutuyla gerçekleştirilen bu eylem, JQuery ile çok daha basit:

**HTML:**

```html
<div>
    <p>
        <a href="http://netmera.com">netmera.com</a>
    </p>
    <div>
        <b>Bold</b>
        <i>Italic</i>
        <span>
            <p>Text</p>
        </span>
    </div>
</div>
```

**Javascript:**

```javascript
// sayfadaki a elemanlarını seçer
var a = $("a");

// span elemanlarını seçer
var span = $("span");

// div elemanının içindeki p elemanının içinde bulunan
// a elemanını seçer:
var divpa = $("div p a");

// span içerisindeki p elemanını seçer
var spanp = $("span p");

// bir div'in tarafından kapsanan 
// başka bir div tarafından kapsanan i elemanını seçer
var divdivi = $("div div i");
```


#### 1.2. Sınıf(Class) Seçicisi

Sınıf isminin başına nokta(.) koyarak kullanıyoruz.
HTML etiketlerindeki class özelliği kullanılarak HTML elemanlarını seçebilmemizi sağlıyor.
Klasik Javascript'de bunu sağlayan kısa bir komut yok.
Sanırım bir döngüye girip sayfadaki tüm elemanların üzerinde dönmemiz gerekiyor.
JQuery bunu bizim için bu şekilde kolaylaştırıyor:

**HTML:**

```html
<div class="page"></div>
<div class="page item"></div>
<div class="page">
    <div class="item"></div>
</div>
```

**Javascript:**

```javascript
// Sınıfı 'page' olan tüm elemanları seçer.
// Yukarıdaki HTML'deki 3 div'i de kapsıyor.
var pages = $(".page");

// Sınıfı hem page hem de item olan elemanları seçer.
// Yukarıdaki örnekte ikinci sıradaki div'i seçiyor.
var pageItem = $(".page.item");

// Sınıfı page olan elemanların içindeki
// sınıfı item olan elemanları seçer.
// Yukarıda, son div'in içindeki div'i seçti.
var itemInPage = $(".page .item");
```


#### 1.3. Kimlik(id) Seçicisi

HTML elemanlarını id özelliklerini kullanarak seçebilmemize yarar.
Seçerken seçeceğimiz elemanın id'sinin başına sharp(#) işareti koyarız.
Javascript'teki `getElementById` methodunun karşılığıdır.

**HTML:**

```html
<div id="user">
    <h1 id="nameSurname">
        <span id="name">Test</span>
        <span id="surname">User</span>
    </h1>
    <img id="profilePic" src="http:...jpg" />
    <a id="logout">Logout</a>
</div>
```

**Javascript:**

```javascript
// id'si name olan elemanı seçer.
var name = $("#name");

// id'si surname olan elemanı seçer.
var surname = $("#surname");

// id'si user olan elemanın çocuklarından
// id'si profilePic olan elemanı getirir.
var profilePic = $("#user #profilePic");

// id'si user olan elemanın içinden
// id'si logout olan elemanı getirir.
var logoutLink = $("#user #logout");
```

Bu elemanları sınıf seçicileri, kimlik seçicileri ve etiket seçicileri diye gruplandırıp 
ayrı ayrı kullanmamıza gerek yok tabi ki.
Bunların çeşitli kombinasyonlarından oluşan sorgular oluşturarak da eleman bulabiliriz.
Aşağıdaki örnek kodda biraz daha kompleks sorgular bulabilirsiniz:

```html
<!DOCTYPE html>
<html>
<head>
 <script type="text/javascript" src="http//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
 <script type="text/javascript">
  // jQuery Kodunu buraya yazacağız.
 </script>
</head>
<body>
 <div class="outer">
  <div class="inner"></div>
  <div class="inner"></div>
  <div class="inner"></div>
  <div class="inner"></div>
  <div class="inner end">
   <a class="link" id="homeLink" href="#">Home</a>
  </div>
 </div>
</body>
</html>
```

Burada elimizde bir HTML kodu var.
Normal DOM kullanıyor olsaydık eğer, bu HTML objelerine erişmekte biraz sıkıntı yaşayacaktık.
Sıkıntıdan kastım, fazla fazla kod yazacaktık.
Uzun uzun döngüler kuracaktık.
jQuery ile ise istediğimiz yerde istediğimiz HTML elemanına ulaşmak bir satır kodu geçmez genellikle.
Mesela aşağıdaki kod parçasına bakalım:

```javascript
$(document).ready(function() {
    // Sınıfı inner olan elemanları içeren jQuery objesi
    var inner = $(".inner");
 
    // Sınıfı hem inner hem de end olan elemanlar
    var lastInner = $(".inner.end");
 
    // Sınıfı link, tagName'i A olan elemanlar
    var links = $("a.link");

    // id'si homeLink olan eleman
    var homeLink = $("#homeLink");
 
    // tam adres vererek elemana ulaşmak
    var element = $(".outer .inner.end a#homeLink");
 
    // farklı elemanları aynı anda seçmek
    var linkend = $(".inner.link, .inner.end");
});
```

Yukarıdaki jQuery kodlarından görebileceğimiz gibi, HTML elemanlarına tag isimlerinden(tagName), 
sınıflarından(class), kimliklerinden(id) veya bunların kombinasyonlarını kullanarak ulaşabiliyoruz. 
Bu kodu `$(document).ready();` içerisine yazdık çünkü `document.ready` event'i 
DOM nesneleri sayfaya tamamen yüklendikten sonra tetiklenir. 
Bu event tetiklenmeden önce Javascript ile DOM nesnelerine ulaşmaya çalışırsak hiçbir şey elde edemeyiz.


#### 1.4. Diğer Seçiciler

Büyük nimettir ki JQuery'de sadece bu seçicilere sahip değiliz.
Daha farklı bir sürü JQuery seçicisini aşağıda görebilirsiniz:

<table class="table table-bordered">
<thead>
<tr>
<th>Seçici</th>
<th>Kullanım</th>
<th>Açıklama</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="http://api.jquery.com/all-selector/">*</a></td>
<td>$("*")</td>
<td>Tüm HTML Elemanları</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/multiple-selector/"><em>sel1</em>,<em>sel2</em>,...,<em>selN</em></a></td>
<td>$("h1,div,p")</td>
<td>Tüm h1, div ve p elemanları</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/first-selector/">:first</a></td>
<td>$("p:first")</td>
<td>İlk p elemanı. Tüm dökümanda sadece bir elemanla eşleşir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/last-selector/">:last</a></td>
<td>$("p:last")</td>
<td>Son p elemanı. Dökümanda sadece bir defa eşleşir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/even-selector/">:even</a></td>
<td>$("tr:even")</td>
<td>Tüm çift indexli tr elemanları</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/odd-selector/">:odd</a></td>
<td>$("tr:odd")</td>
<td>Tüm tek indexli tr elemanları</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/first-child-selector/">:first-child</a></td>
<td>$("div p:first-child")</td>
<td>div elemanının içindeki ilk p elemanı</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/last-child-selector/">:last-child</a></td>
<td>$("div p:last-child")</td>
<td>div elemanının içindeki son p elemanı</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/nth-child-selector/">:nth-child(<em>n</em>)</a></td>
<td>$("div p:nth-child(2)")</td>
<td>div elemanının içindeki 2. p elemanı, 1'den başlar.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/only-child-selector/">:only-child</a></td>
<td>$("p:only-child")</td>
<td>parent elemanın tek çocuğu olan p elemanlarıyla eşleşir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/child-selector/">parent &gt; child</a></td>
<td>$("div &gt; p")</td>
<td>Doğrudan bir div elemanının çocuğu olan p elemanlarıyla eşleşir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/next-adjacent-Selector/">element + next</a></td>
<td>$("label + input")</td>
<td>Bir label elemanından hemen sonra gelen input elemanlarıyla eşleşir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/next-siblings-selector/">element ~ siblings</a></td>
<td>$("div ~ p")</td>
<td>div elemanından sonra gelen ve div'in kardeşi(aynı hiyerarşi seviyesinde) olan tüm p elemanlarıyla eşleşir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/eq-selector/">:eq(<em>index</em>)</a></td>
<td>$("ul li:eq(3)")</td>
<td>Listedeki 4. elemanı getirir. İlk elemanın indeksi sıfırdır.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/gt-selector/">:gt(<em>no</em>)</a></td>
<td>$("ul li:gt(3)")</td>
<td>Listedeki indeksi 3'den büyük olan elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/lt-selector/">:lt(<em>no</em>)</a></td>
<td>$("ul li:lt(3)")</td>
<td>Listedeki indeksi 3'den küçük olan elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/empty-selector/">:empty</a></td>
<td>$(":empty")</td>
<td>Boş olan(Çocuğu olmayan) tüm elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/not-selector/">:not(<em>selector</em>)</a></td>
<td>$("input:not(:empty)")</td>
<td>Boş olmayan input elemanlarını getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/header-selector/">:header</a></td>
<td>$(":header")</td>
<td>Tüm başlık elemanlarını seçer: h1, h2...</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/animated-selector/">:animated</a></td>
<td>$(":animated")</td>
<td>Seçicinin çağırıldığı anda animasyon halinde bulunan tüm elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/focus-selector/">:focus</a></td>
<td>$(":focus")</td>
<td>O an seçili olan(focus üzerinde olan) elemanını getirir. Herhangi bir HTML elemanına tıklamak focus'u o elemanın üzerine getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/contains-selector/">:contains()</a></td>
<td>$(":contains('Giriş')")</td>
<td>"Giriş" metinini içeren tüm elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/has-selector/">:has(<em>selector</em>)</a></td>
<td>$("div:has(p)")</td>
<td>p elemanı içeren tüm div elemanlarını getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/parent-selector/">:parent</a></td>
<td>$(":parent")</td>
<td>En az bir çocuğu olan tüm elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/hidden-selector/">:hidden</a></td>
<td>$("p:hidden")</td>
<td>Gizli tüm elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/visible-selector/">:visible</a></td>
<td>$("table:visible")</td>
<td>Gizli olmayan tüm elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/has-attribute-selector/">[<em>attribute</em>]</a></td>
<td>$("[href]")</td>
<td>href özelliği olan tüm elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/attribute-equals-selector/">[<em>attribute</em>=<em>value</em>]</a></td>
<td>$("[href='default.htm']")</td>
<td>href özelliği "default.htm" olan elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/attribute-not-equal-selector/">[<em>attribute</em>!=<em>value</em>]</a></td>
<td>$("[href!='default.htm']")</td>
<td>href özelliği "default.htm" olmayan tüm elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/attribute-ends-with-selector/">[<em>attribute</em>$=<em>value</em>]</a></td>
<td>$("[href$='.jpg']")</td>
<td>href özelliği ".jpg" ile biten tüm elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/attribute-contains-prefix-selector/">[<i>attribute</i>|=<i>value</i>]</a></td>
<td>$("[id|='selam']")</td>
<td>id özelliği "selam" olan veya "selam-" ile başlayan elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/attribute-starts-with-selector/">[<i>attribute</i>^=<i>value</i>]</a></td>
<td>$("[name^='hello']")</td>
<td>name özelliği "hello" ile başlayan elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/attribute-contains-word-selector/">[<i>attribute</i>~=<i>value</i>]</a></td>
<td>$("[name~='hello']")</td>
<td>name özelliği "hello" kelimesini (boşluklarla ayrılmış olarak) içeren elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/attribute-contains-selector/">[<i>attribute*</i>=<i>value</i>]</a></td>
<td>$("[name*='hello']")</td>
<td>name özelliği herhangi bir şekilde "hello" stringini içeren elemanları getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/input-selector/">:input</a></td>
<td>$(":input")</td>
<td>Tüm input elemanlarını (input, textarea, select ve button) getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/text-selector/">:text</a></td>
<td>$(":text")</td>
<td>type özelliği text olan tüm input elemanlarını getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/password-selector/">:password</a></td>
<td>$(":password")</td>
<td>type özelliği password olan tüm input elemanlarını getirir</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/radio-selector/">:radio</a></td>
<td>$(":radio")</td>
<td>type özelliği radio olan tüm input elemanlarını getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/checkbox-selector/">:checkbox</a></td>
<td>$(":checkbox")</td>
<td>type özelliği checkbox olan tüm input elemanlarını getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/submit-selector/">:submit</a></td>
<td>$(":submit")</td>
<td>type özelliği submit olan tüm input elemanlarını getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/reset-selector/">:reset</a></td>
<td>$(":reset")</td>
<td>type özelliği reset olan tüm input elemanlarını getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/button-selector/">:button</a></td>
<td>$(":button")</td>
<td>type özelliği button olan input elemanlarını ve button elemanlarını getirir. Alternatif olarak: $("button, input[type='button']")</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/image-selector/">:image</a></td>
<td>$(":image")</td>
<td>type özelliği image olan input elemanlarını getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/file-selector/">:file</a></td>
<td>$(":file")</td>
<td>type özelliği file olan input elemanlarını getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/enabled-selector/">:enabled</a></td>
<td>$(":enabled")</td>
<td>Tüm geçerli input elemanlarını getirir. Yani disabled özelliği olmayan input elemanlarını getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/disabled-selector/">:disabled</a></td>
<td>$(":disabled")</td>
<td>disabled olan input alanlarını getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/selected-selector/">:selected</a></td>
<td>$(":selected")</td>
<td>Seçili option elemanlarını getirir.</td>
</tr>
<tr>
<td><a href="http://api.jquery.com/checked-selector/">:checked</a></td>
<td>$(":checked")</td>
<td>İşaretli input elemanlarını getirir. İşaretlenebilir elemanlar: checkbox, radio</td>
</tr>
</tbody>
</table>


Şimdi başka bir HTML kodu üzerinden yukarıdaki tablodan birkaç jQuery seçicisini daha görelim.

**HTML**

```html
<p>
 <a name="isim" id="kimlik" class="sinif" href="#">Link 1</a>
</p>
<div id="outer">
 <p>p in outer</p>
 <div>
  <p>p in div</p>
 </div>
</div>
<ul id="mainmenu">
 <li>List Item 0</li>
 <li>List Item 1</li>
 <li>List Item 2</li>
 <li>List Item 3</li>
 <li>List Item 4</li>
 <li>List Item 5</li>
</ul>
```

**Javascript**

```javascript
$(document).ready(function() {
 // name özelliği isim olan anchor elemente ulaşmak:
 var anchor1 = $('a[name="isim"]');
 
 // #outer div'inin içindeki bütün p'ler
 // yukarıdaki örnekte, "p in outer" ile "p in div" yazan p'ler seçilir.
 var ps = $("div#outer p");
 
 // #outer div'inin doğrudan çocuğu olan p'ler
 // Yukarıdaki örnekte, "p in outer" yazan p seçilir
 var p = $("div#outer &gt; p");
 
 // List Item 0, List Item 2 ve List Item 4'ü seçelim.
 var lieven = $("ul#mainmenu li:even");
 
 // List Item 1, List Item 3 ve List Item 5'i seçelim.
 var liodd = $("ul#mainmenu li:odd");
 
 // List Item 4'ü seçelim:
 var li4 = $("ul li:eq(3)");
 
 // List Item 3, 4, ve 5'i seçelim
 var li345 = $("ul li:gt(2)");
 
 // List Item 0, 1, ve 2'yi seçelim:
 var li012 = $("ul li:lt(3)");
 
 // İlk List Item'i ve son List Item'i seçelim:
 var lifirst = $("ul li:first");
 var lilast = $("ul li:last");
});
```


### 2 JQuery Methodları

JQuery seçicilerini kullanarak DOM elemanlarını çektik.
Peki ne yapacağız bu DOM objelerini?
Bu noktada JQuery sadece bu objelere erişimi kolaylaştırmakla kalmıyor,
aynı zamanda birçok işlemi yine çok kısa kod parçalarıyla yapabilmemizi sağlıyor.
Bu işlemlere örnek verecek olursak, seçtiğimiz elemana event listenerlar eklemek,
bu elemanı silmek, çoğaltmak, içine birşeyler yazmak, değerini okumak,
özelliklerine erişmek, css özelliklerini değiştirmek, vs...

Hem çok fazla method olduğu için, hem de jQuery sürekli güncellenen bir kütüphane olduğundan ötürü,
bu methodlarının tamamını hiçbir zaman anlatamayacağım.
Genellikle kendim sık kullandığım ve önemli gördüğüm methodlara değiniyor olacağım.


#### 2.1. .append( content [, content ] )

Seçili elemanın içerisindeki içeriğin sonuna herhangi bir içerik eklemek için kullanılır.
Parametresi bir veya birden fazla String, JQuery objesi veya DOM objesi olabilir.

```javascript
// Kullanıcı siteye login olmuş mu?
var isUserLogged = true;

if (isUserLogged) {
    // Login olmuşsa ana menüye logout seçeneği ekleyelim.
    $("ul#mainMenu").append('<li id="logout">Logout</li>');
} else {
    // Login olmamışsa ana menüye login seçeneği ekleyelim.
    $("ul#mainMenu").append('<li id="login">Login</li>');
}
```

**INPUT ve OUTPUT:**

```html
<!-- Yazdığımız jQuery kodu çalışmadan önceki HTML -->
<ul id="mainMenu">
    <li>Ana Sayfa</li>
    <li>Arama</li>
</ul>

<!-- ve HTML'in son hali: -->
<ul id="mainMenu">
    <li>Ana Sayfa</li>
    <li>Arama</li>
    <li id="logout">Logout</li>
</ul>
```


#### 2.2 .prepend( content [, content ] )

Seçili elemanın içerisindeki içeriğin başına herhangi bir içerik eklemek için kullanılır.
Parametresi bir veya birden fazla String, JQuery objesi veya DOM objesi olabilir.

```javascript
var page = "profilePage";

if (page != "homePage") {
    $("ul#mainMenu").prepend('<li><a href="index.php">Ana Sayfa</a></li>');
}
```

**INPUT ve OUTPUT:**

```html
<!-- Yazdığımız jQuery kodu çalışmadan önceki HTML -->
<ul id="mainMenu">
    <li>Arama</li>
	<li>Logout</li>
</ul>

<!-- ve HTML'in son hali: -->
<ul id="mainMenu">
    <li><a href="index.php">Ana Sayfa</a></li>
    <li>Arama</li>
	<li>Logout</li>
</ul>
```


#### 2.3. .appendTo( target ) ve .prependTo( target )

Bu iki method için append ve prepend'in tersten yazılışı denilebilir.
Seçili elemanı başka bir elemanın içerisine eklemek için kullanılır.
target dediğimiz parametre olarak da jQuery seçicisi, jQuery objesi veya DOM objesi kullanabiliriz.

```javascript
// prependTo
// Parametre olarak jQuery seçicisi kullanabiliriz.
$('<span>surname</span>').prependTo("div#profile");

// jQuery objesi de kullanabiliriz.
var myObj = $("div#profile");
$('<span>name</span>').prependTo(myObj);

// appendTo
$('<p>Lorem Ipsum</p>').appendTo(myObj);
```

**INPUT ve OUTPUT:**

```html
<!-- Yazdığımız jQuery kodu çalışmadan önceki HTML -->
<div id="profile">
    <img src="profilePic.jpg" />
</div>

<!-- ve HTML'in son hali: -->
<div id="profile">
    <span>name</span>
    <span>surname</span>
    <img src="profilePic.jpg" />
    <p>Lorem Ipsum</p>
</div>
```


#### 2.4. hasClass(className), addClass(className), removeClass(className) ve toggleClass(className)

Elemanların CSS özelliklerini genellikle className üzerinden ayarlarız.
Göster/Gizle olayları yada arkaplan rengi gibi olayları dinamikleştirmek adına,
bir elemanın sınıfını programın yaşam döngüsü içerisinde sık sık değiştirmemiz gerekebilir.
Bu methodlar bu konuda çok iyi iş çıkarıyorlar.
Elimizdeki bir jQuery objesinin bir sınıfa ait olup olmadığını `hasClass()` ile sorgulayıp, 
o elemana `addClass()` methodu ile istediğimiz bir sınıfı ekleyebilir veya `removeClass()` methodu ile 
istemediğimiz bir sınıfı o elemandan çıkarabiliriz. 
`toggleClass()` methodu sayesinde ise bu işi biraz daha dinamikleştirerek, 
"sınıf varsa sil, yoksa ekle" işlemini yapabiliriz.

```javascript
// hasClass kontrolü yapmadan da removeClass yapabiliriz.
// Herhangi bir hata vermez.
if ($("div#firstDiv span#sp1").hasClass("blue")) {
	$("div#firstDiv span#sp1").removeClass("blue");
}

$("div#secondDiv").addClass("blue");

// Bir sınıfa ait bir elemana o sınıfı tekrar atamamızda da
// herhangi bir sakınca yoktur. Duplicate oluşmaz.
$("div#secondDiv").addClass("yellow");

// Seçili elemanlarda yellow sınıfı varsa sil, yoksa ekle.
$("#sp2, #sp3").toggleClass("yellow");
```

**INPUT ve OUTPUT:**

```html
<!-- Yazdığımız jQuery kodu çalışmadan önceki HTML -->
<div id="firstDiv">
    <span id="sp1" class="red blue"></span>
    <span id="sp2" class="blue yellow"></span>
    <span id="sp3" class="blue"></span>
</div>
<div id="secondDiv" class="yellow">
</div>

<!-- ve HTML'in son hali: -->
<div id="firstDiv">
    <span id="sp1" class="red"></span>
    <span id="sp2" class="blue"></span>
    <span id="sp3" class="blue yellow"></span>
</div>
<div id="secondDiv" class="yellow blue">
</div>
```


#### 2.5. .attr(key [, value]) ve .removeAttr(key)

Bu methodlar da HTML elemanından herhangi bir özelliğe ulaşmaya, 
o özelliği eklemeye, değiştirmeye veya silmeye yarayan methodlar.

```javascript
var homeLink = $("a#homeLink");
var name = homeLink.attr("name");

// Konsola AnaSayfaLinki yazar.
console.log(name);

// Linkin href özelliğini değiştirelim:
homeLink.attr("href", "index.html");

if (homeLink.attr("target") == "_blank") {
    // Link yeni pencerede açılmaya çalışıyorsa,
    // target özelliğini silelim
    homeLink.removeAttr("target");
}
```

**INPUT ve OUTPUT:**

```html
<!-- Yazdığımız jQuery kodu çalışmadan önceki HTML -->
<a href="index.php" target="_blank" id="homeLink" 
     name="AnaSayfaLinki">Ana Sayfa</a>

<!-- ve HTML'in son hali: -->
<a href="index.html" id="homeLink" name="AnaSayfaLinki">Ana Sayfa</a>
```


#### 2.6. .after(content [, content ]), .before(content [, content ]), .insertAfter(target) ve .insertBefore(target)

Bir elemandan sonra veya önce eleman eklememize yarar. 
`append` ve `prepend` methodlarıyla karıştırılabilir.
Aradaki fark, `append` ve `prepend` methodları seçilen elemanın içerisine eklerken, 
`after` ve `before` methodları seçili elemanın dışına, kardeş olarak eklerler.

```javascript
$("span#x").after("<i>After:x</i>");
$('<p>insertAfter:y</p>').insertAfter("span#y");
$('span#z').before('<p>before:z</p>');
$('<p>insertBefore:z</p>').insertBefore("span#z");
```

**INPUT ve OUTPUT:**

```html
<!-- Yazdığımız jQuery kodu çalışmadan önceki HTML -->
<div id="container">
    <span id="x"></span>
    <span id="y"></span>
    <span id="z"></span>
</div>

<!-- ve HTML'in son hali: -->
<div id="container">
    <span id="x"></span>
    <i>After:x</i>
    <span id="y"></span>
    <p>insertAfter:y</p>
    <p>before:z</p>
    <p>insertBefore:z</p>
    <span id="z"></span>
</div>
```


#### 2.7. .show(), .hide() ve .toggle()

Seçilen bir elemanı gizlemek ve tekrar göstermek için kullanılırlar. 
`toggle()` methodu eleman görünür ise gizle, görünmez ise göster işini yapar. 
Bu methodlara "normal", "slow" veya "fast" gibi parametreler geçerek 
bu işlemlerin animasyonlar ile yapılmasını da sağlayabiliriz.

```javascript
$("div#content").hide(); // Elemanı görünmez  yaptık.
$("div#content").show(); // Elemanı tekrar görünür yaptık.
```

**INPUT ve OUTPUT:**

```html
<!-- Yazdığımız jQuery kodu çalışmadan önceki HTML -->
<div id="content">İçerik</div>

<!-- hide() yaptıktan sonraki hali -->
<div id="content" style="display: none;">İçerik</div>

<!-- show() yaptıktan sonraki hali -->
<div id="content" style="display: block;">İçerik</div>
```


#### 2.8. .find(query), .parent(query), .parents(query) ve .closest(query)

Bazen elimizde bir jQuery objesi vardır ve hali hazırda elimizde bu varken, 
bu objenin ebeveynlerinden veya çocuklarından olduğunu bildiğimiz bir elemanı getirmek için 
tüm DOM ağacını taramaya ihtiyacımız olmadığını biliriz. 
İşte bu durumlarda bu 4 method yardımımıza koşuyor.

* `.find(query)` ile elimizdeki jQuery objesinin çocuklarının arasında arama yapıyoruz.
* `.parent(query)` ile elemanın ilk parent'ına çıkıyoruz 
ve eğer bir parametre geçmişsek elemanın parentı o seçiciye uyuyor mu onu kontrol ediyor.
* `.parents(query)` ile elemanın tüm parentlarından, belirttiğimiz seçiciye uyanlar geliyor.
* `.closest(query)` ile elemanın parentlarının girilen seçiciye uygun olanlardan elemana en yakın olanı geliyor.

```javascript
// farzedelim ki elimizde bu var:
var elem = $("div#con");

// Bu elemanın çocuklarından birisi #userId kimliğine sahip:
var userid = elem.find("#userId");

// Bu elemanın parent'ı admin sınıfına sahipse gizlememiz gerekiyor:
var parent = elem.parent();
if (parent.hasClass("admin")) {
    parent.hide();
}

// Bu elemanın ilk parent'ı değil de, 
// birkaç level yukarıdaki parent'ı da admin olabilir:
var parents = elem.parents(".admin");
parents.hide();

// Bu yeterli değil, biz elemana en yakın 
// .admin elemanını bulmak istiyoruz.
var parentc = elem.closest(".admin");
parentc.hide();
```


#### 2.9. .val(value) ve .html(value)

Bu methodlar da HTML elemanlarındaki gözle görülür datalara müdahale edebilmemizi sağlıyor. 
`val()` methodu ile input elemanlarının değerlerini okuyup değiştirebiliyorken, 
`html()` methodu ile ise HTML elemanlarının içeriklerini okuyup değiştirebiliyoruz.

```javascript
// input alanından kullanıcı adını okuyalım:
var username = $("#username").val();

// okuduktan sonra input alanından temizleyelim:
$("#username").val("");

// okuduğumuz kullanıcı adını #board 
// içerisindeki .username alanına yazalım
$("#board .username").html(username);

// .test div'inin içerisini değiştirelim:
var oldValue = $(".test").html();
$(".test").html(oldValue + oldValue);
```

**INPUT ve OUTPUT:**

```html
<!-- Önce -->
<div class="login">
    <input type="text" name="username" id="username" value="sedran" />
</div>

<div class="test">
    aliBaba
</div>

<div id="board">
    <span>Username:</span>
    <span class="username"></span>
</div>

<!-- Sonra -->
<div class="login">
    <input type="text" name="username" id="username" value="" />
</div>

<div class="test">
    aliBabaaliBaba
</div>

<div id="board">
    <span>Username:</span>
    <span class="username">sedran</span>
</div>
```

Ne yazık ki jQuery methodları yazmakla bitmiyor fakat zaman bitiyor.
Bu gecelik bu kadar.
İleriki günlerde kısmet olursa jQuery objesinin üzerindeki static methodlara da değinmeye çalışacağım.

Şimdilik sağlıcakla kalın.

