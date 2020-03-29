---
layout: post
title:  "jQuery'de Olaylar (Event Handling)"
date:   2013-08-02 03:31:00 +0300
categories: [Programlama, Javascript, jQuery]
author: Serdar Kuzucu
permalink: /jqueryde-olaylar-event-handling/
comments: true
post_identifier: jqueryde-olaylar-event-handling
featured_image: /assets/category/jquery.gif
---

[jQuery Giriş ve Gelişme](/jquery-giris-ve-gelisme) yazısıyla başladığım 
jQuery yazı dizisine olaylar ile devam ediyorum. 
Bilgisayar programlarını ve web sitelerini interaktif hale getiren şeyler aslında olay(event) dediğimiz şeylerdir. 
Örneğin kullanıcı bir linke tıkladığında, 
faresinin imlecini bir butonun üzerine getirdiğinde 
veya klavyeden bir tuşa bastığında biz bunları anlık olarak yakalamak ve tepki vermek isteriz. 
Aslında kullanıcının web sitesinde yaptığı hemen hemen herşeyin bir olay karşılığı vardır 
ve jQuery sayesinde biz bu olayları çok kolay yakalayıp buna karşı bir davranış geliştirebilir, 
bir tavır takınabiliriz.

<!--more-->

<script
  src="//code.jquery.com/jquery-3.4.1.js"
  integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU="
  crossorigin="anonymous"></script>

Misal bir butonumuz var. 
Butona tıklandığında basit bir uyarı (alert) verelim. 
Bunun için daha önceki yazıda anlattığım jQuery seçicilerini kullanarak 
objemizi seçtikten sonra bu objemize click methoduyla bir olay dinleyici (event listener) ekliyoruz.

```html
<!-- HTML Kodumuz -->
<button id="jQueryOrnekBtnClick" 
    class="btn btn-success">Tıkla ve Gör</button>
```

```javascript
/*
 * jQuery Kodumuz
 */
$("#jQueryOrnekBtnClick").click(function () {
    alert("Bu butona tıkladın: " + $("#jQueryOrnekBtnClick").html());
});
```


<div class="card mb-2">
<div class="card-body">
<button id="jQueryOrnekBtnClick" 
    class="btn btn-success">Tıkla ve Gör</button>
<script type="text/javascript">
$("#jQueryOrnekBtnClick").click(function () {
    alert("Bu butona tıkladın: " + $("#jQueryOrnekBtnClick").html());
});
</script>
</div>
</div>


Nasıl çalıştığını görmek için yukarıdaki butona tıklayabilirsiniz.


#### 1. 'this' kullanımı

`this` anahtar sözcüğü ile bir objenin içerisinde kullanılan, 
o objenin kendisine verdiği referanstır. 
Peki jQuery olayları ile ilgisi ne? 
Şöyle ki, bir jQuery olayı olduğunda, o olayı dinleyen fonksiyon, 
o olayın meydana geldiği DOM objesinin bir methoduymuş gibi çağırılır. 
Yani olayı dinleyen fonksiyonun içerisinde kullandığımızda `this` anahtar sözcüğü 
olayın meydana geldiği DOM objesinin referansını alır.

```html
<!-- HTML Kodumuz -->
<button id="jQueryThisOrnek" 
    class="btn btn-warning">This Keyword Example</button>
```

```javascript
/*
 * jQuery Kodumuz
 */
$("#jQueryThisOrnek").click(function () {
    // 'this' burada tıkladığımız buton oluyor.
    alert("className: " + this.className);

    // DOM objesini jQuery objesine çevirelim:
    var that = $(this);

    alert("Bu butona tıkladın: " + that.html());
});
```


<div class="card mb-2">
<div class="card-body">
<button id="jQueryThisOrnek" 
    class="btn btn-warning">This Keyword Example</button>
<script type="text/javascript">
$("#jQueryThisOrnek").click(function () {
    // 'this' burada tıkladığımız buton oluyor.
    alert("className: " + this.className);

    // DOM objesini jQuery objesine çevirelim:
    var that = $(this);

    alert("Bu butona tıkladın: " + that.html());
});
</script>
</div>
</div>


#### 2. 'event' Parametresi

jQuery, bir olayı yakaladığımız zaman, o olayı dinlemesi için 
parametre geçtiğimiz fonksiyona bir event objesi parametre geçer. 
Bu event objesinden biz o olay ile ilgili bilgileri alabiliriz. 
Örneğin aşağıdaki kod parçacığında bir butona tıklandığında yakalanan 
event objesinin üzerinden o butonun konumunun ve olayın zamanının nasıl çekildiğini görebiliriz:

```html
<!-- HTML Kodumuz -->
<button id="jQueryClickEventTest"
    class="btn btn-danger">event Parametresi Test</button>
```

```javascript
/*
 * jQuery Kodumuz
 */
$("#jQueryClickEventTest").click(function (event) {
    var t = event.target;
    var time = (new Date(event.timeStamp)).toLocaleString();
    var txt = "Konum: \n\twidth: " + t.offsetWidth 
            + ",\n\theight: " + t.offsetHeight
            + ",\n\ttop: " + t.offsetTop
            + ",\n\tleft: " + t.offsetLeft
            + "\n\n"
            + "Zaman: " + time;
    alert(txt);
});
```


<div class="card mb-2">
<div class="card-body">
<button id="jQueryClickEventTest"
    class="btn btn-danger">event Parametresi Test</button>
<script type="text/javascript">
$("#jQueryClickEventTest").click(function (event) {
    var t = event.target;
    var time = (new Date(event.timeStamp)).toLocaleString();
    var txt = "Konum: \n\twidth: " + t.offsetWidth 
            + ",\n\theight: " + t.offsetHeight
            + ",\n\ttop: " + t.offsetTop
            + ",\n\tleft: " + t.offsetLeft
            + "\n\n"
            + "Zaman: " + time;
    alert(txt);
});
</script>
</div>
</div>


Event objesi üzerinde taşınan başka özelliklerin neler olduğunu merak ederseniz, 
şu linke bakabilirsiniz: [jQuery Event Object](http://api.jquery.com/category/events/event-object/)

#### 3. Olay Çeşitleri

İşin temelini kaptığımıza göre, şimdi farklı olayları ve ne anlama geldiklerini görelim.

##### 3.1. click Olayı

Tıklama olayıdır. 
Herhangi bir objeye farenin herhangi bir butonuyla tıklandığında tetiklenir. 
Aşağıda, farenin hangi tuşu ile tıklama yapıldığını algılayan bir kod parçacığı mevcut:

```javascript
$("button#registerUser").click(function (clickEvent) {
    // Fare ile tıklama yapıldı.
    switch (clickEvent.which) {
        case 1:
            alert('Sol tuş tıklandı.');
            break;
        case 2:
            alert('Orta tuş tıklandı.');
            break;
        case 3:
            alert('Sağ tuş tıklandı.');
            break;
        default:
            alert('Bambaşka bir fare tuşu tıklandı.');
    }
});
```

##### 3.2. dblclick Olayı

Farenin çift tıklama olayını yakalayan bir fonksiyon atamamızı sağlar.

```javascript
// Mesela içeriklerimizi klasör simgeleriyle listelediğimiz
// bir web sayfası düşünelim. Klasöre çift tıklandığında
// klasör açılsın istiyoruz.
$("div.folderIcon").dblclick(function () {
    var folder = $(this);
    // Varsayalım ki klasörü açan fonksiyonu daha önceden tanımladık.
    openFolder(folder);
});
```

##### 3.3. mouseover ve mouseenter Olayları

Bu olaylar fare imleci bir elemanın üzerine geldiğinde tetiklenir.
Lakin aralarında ufak bir fark var.
İmleç bir elemanın içerisine girdiğinde hem mouseover hem de mouseenter olayı vuku bulur.
Fakat hala o elemanın içerisindeyken, onun içindeki başka bir elemanın üzerine getirdiğimizde imleci,
dıştaki elemanımızın mouseover olayı tekrar tetiklenir.
Yani mouseenter elemana girince tetikleniyor, mouseover ise
o elemanın içerisindeki elemanlara girip çıkarken de tetikleniyor.
Aşağıdaki kod parçacıklarını bir yerde çalıştırırsanız, siz de sonucu göreceksiniz.

```html
<!-- Sonuçların yazıldığı alan -->
<div class="counter">
    <p>mouseover {outerDiv} = <span id="mouseOverOuter"></span></p>
    <p>mouseover {innterDiv} = <span id="mouseOverInner"></span></p>
    <p>mouseenter {outerDiv} = <span id="mouseEnterOuter"></span></p>
    <p>mouseenter {innerDiv} = <span id="mouseEnterInner"></span></p>
</div>

<!-- En dış div -->
<div id="outerDiv">
    <!-- İç div -->
    <div id="innerDiv">
        <!-- Öylesine div -->
        <div id="innerinner"></div>
    </div>
</div>
```

```css
/**
 * HTML anlaşılır görünsün diye biraz da CSS yazalım.
 */
#outerDiv {
    width: 300px;
    height: 300px;
    padding: 50px;
    background: blue;
}
#innerDiv {
    width: 200px;
    height: 200px;
    padding: 50px;
    background: red;
}
#innerinner {
    background: yellow;
    width: 100%;
    height: 100%;
}
```

```javascript
$(document).ready(function () {
    var outerMouseOver = 0,
        outerMouseEnter = 0,
        innerMouseOver = 0,
        innerMouseEnter = 0;

    $("#outerDiv").mouseover(function () {
        outerMouseOver++;
        $("span#mouseOverOuter").html(outerMouseOver);
    });

    $("#outerDiv").mouseenter(function () {
        outerMouseEnter++;
        $("span#mouseEnterOuter").html(outerMouseEnter);
    });

    $("#innerDiv").mouseover(function () {
        innerMouseOver++;
        $("span#mouseOverInner").html(innerMouseOver);
    });

    $("#innerDiv").mouseenter(function () {
        innerMouseEnter++;
        $("span#mouseEnterInner").html(innerMouseEnter);
    });
});
```

Bu örneği jsFiddle'da görüp denemek için: 
[jsfiddle.net/sedran/Y68fu/](http://jsfiddle.net/sedran/Y68fu/)


##### 3.4. change Olayı

change olayı da bir form alanının değeri kullanıcı tarafından değiştirildiği zaman tetiklenir.
Bu bahsettiğim form alanları input, textarea ve select html tagleriyle oluşturulan alanlardır.
Aşağıda bir örnek yapalım. Mesela iki tane select olsun sayfamızda.
Bunların içerisindeki seçenekler aynı olsun fakat birinde seçilen diğerinde görünmesin.
Yani birisinin değeri değiştiğinde ötekisinde o değeri gizleyeceğiz.
Bunun için ben netmera'da şöyle bir çözüm getirmiştim:

[jsfiddle.net/sedran/Jvf3w/1/](http://jsfiddle.net/sedran/Jvf3w/1/)

Tamam kabul bu biraz uçuk hayvani bir örnek oldu. 
Daha basit bir örnek yazayım.
Bir formdan bir kişi kartı oluşturalım dinamik olarak.
Aşağıda 4 tane `input[type=text]` alan var. 
Bunların hepsinin "listenChange" sınıfına sahip olduğunu görüyoruz.
Dolayısıyla tek bir fonksiyon ile dördünün de değişim olayını yakalayabiliriz.
Daha sonra üzerinde change olayı meydana gelen form elemanının id'sinden, 
içeriğini değiştireceğimiz html elemanının id'sini buluyoruz.

```html
<!-- Form elemanlarının HTML kodları -->
<div>
    <p>Ad Soyad: <input type="text" id="nameInput" class="listenChange" /></p>
    <p>Telefon: <input type="text" id="phoneInput" class="listenChange" /></p>
    <p>Email: <input type="text" id="emailInput" class="listenChange" /></p>
    <p>Adres: <input type="text" id="addressInput" class="listenChange" /></p>
</div>

<!-- Kişi kartının html kodu -->
<div class="card">
    <h1 id="name">Serdar Kuzucu</h1>
    <h2 id="phone">05547865930</h2>
    <h3 id="email">serdar.kuzucu@anymail.com</h3>
    <p id="address">Gül sokak 33 numara aydoğan apartmanı kat xx istanbul sarıyer</p>
</div>
```

```css
/**
 * Kart için CSS kodu
 */
.card {
    width: 400px;
    height: 200px;
    border-radius: 10px;
    background: #eee;
    border: 1px solid #333;
}

.card h1 {
    margin: 5px;
    padding: 0;
    font: bold 30px 'Comic Sans MS';
}

.card h2 {
    margin: 5px;
    padding: 0;
    font: bold 20px 'Comic Sans MS';
}

.card h3, .card p {
    margin: 5px;
    padding: 0;
    font: normal 20px "Open Sans", Helvetica, Arial, sans-serif;
}
```

```javascript
$(document).ready(function () {
    // sınıfı listenChange olan elemanlara tıklanınca çalışacak fonksiyon
    $(".listenChange").change(function () {
        // tıklanan elemanın id'sini al
        var id = $(this).attr("id");
        // tıklanan elemanın değerini al
        var val = $(this).val();
        // tıklanan elemanın id'sinden 'Input' yazısını sil
        // mesela nameInput ise id'si, name kalacak elimizde
        var inputRemoved = id.replace("Input", "");
        // bu id ile bulacağımız elemanın içine input'daki değeri yaz
        $("#" + inputRemoved).html(val);
    });
});
```

Bu örneğin çalışan hali için de jsFiddle linki:
[jsfiddle.net/sedran/Jvf3w/2/](http://jsfiddle.net/sedran/Jvf3w/2/)


##### 3.5. focus ve blur Olayları

Bu olaylar da sayfamızdaki elemanlar focus kazandığında ve kaybettiğinde tetiklenir.
İnput alanlarını düşünün.
Klavyede TAB tuşuna basarak input alanlarının birinden diğerine geçebiliyoruz form doldururken.
Veya fare ile tıklayarak bir input alanının içerisine focus olabiliyoruz.
İşte bu durumlarda içine yazı yazabilir duruma geldiğimiz input alanı focus eventi fırlatır.
İçinden çıktığımız alan ise blur eventi fırlatır.

Eskiden bu blogdaki arama kutusunda bu event şu şekilde kullanılıyordu:
Arama kutusunda varsayılan değer olarak "Tıkla, yaz ve aramaya başla" yazıyordu.
Daha sonra focus eventi tetiklendiğinde bu yazı siliniyordu ve kullanıcı aramak istediği şeyi yazıyordu.
Eğer blur eventi tetiklendiğinde kullanıcı birşey yazmamışsa, oraya tekrar eski yazı yazılıyordu.
Bunu kod ile gösterecek olursak:

```html
<input type="text" id="search" name="q" 
    value="Tıkla, yaz ve aramaya başla!" />
```

```javascript
$(document).ready(function () {
    var $searchBar = $("#search");
    var defaultText = $searchBar.val();
    $searchBar.focus(function () {
        if ($searchBar.val() == defaultText) {
            $searchBar.val("");
        }
    });
    
    $searchBar.blur(function () {
        if ($searchBar.val() == "") {
            $searchBar.val(defaultText);
        }
    });
});
```

Bu kodun çalışan hali için jsFiddle ise burada: 
[jsfiddle.net/sedran/76WNb/](http://jsfiddle.net/sedran/76WNb/)

Şimdi olay çeşitlerini burada kısa kesiyorum 
ve değinmek istediğim birkaç güzel jQuery event methoduna daha değiniyorum.

[hover](http://api.jquery.com/hover/),
[keydown](http://api.jquery.com/keydown/),
[keypress](http://api.jquery.com/keypress/) ve
[submit](http://api.jquery.com/submit/)
gibi daha birçok event çeşidi için 
[jQuery dökümantasyonunun event bölümüne](http://api.jquery.com/category/events/) bakabilirsiniz.


#### 4. preventDefault, stopPropagation ve return false

Amatör olarak eventler ile iş yaparken istenmeyen durumlarla karşılaşabiliriz.
Mesela bir link var, bu link tıklandığında eventi yakalayıp javascript ile asenkron birşey yapmak istiyoruz.
Fakat o da ne, javascript ile yapmak istediğimiz iş yapılmadan tıkladığımız linkin yönlendirdiği web sayfası açılmış.
Yada iç içe gömülü iki html objesinin de tıklama olaylarında farklı işler yapmak istiyoruz
fakat içtekine tıkladığımızda dıştaki de tıklama eventi fırlatıyor.
Böyle durumlarda işlerin karışmasını önlemek için işte bu keywordler var:


#### 4.1. preventDefault

Bir eventi yakaladığımızda, bu event üzerinden çağıracağımız `preventDefault` methodu, 
o html objesi üzerinde o event için default olarak çalışacak olan fonksiyonun çalışmasını engeller. 
Mesela google.com sitesine bağlanan bir link var sitemizde 
ve bu linke tıklandığında google'a gitmesin de sayfada başka birşey yapsın istiyorsunuz. 
Bu durumda browserın otomatik olarak google.com'u açmasını preventDefault methodu ile engelliyoruz.

Mesela aşağıdaki örnekte, kullanıcıya bir soru soruyoruz. 
Başka bir adrese yönlendiriliyorsunuz, onaylıyor musunuz diye. 
Kullanıcı onay vermezse yönlendirme işlemini iptal ediyoruz.

```html
<a href="http://www.google.com" id="googleLink">Google Linki</a>
```

```javascript
$(document).ready(function () {
    $("#googleLink").click(function (event) {
        var confirmation = confirm("Sitemizden çıkıp aşağıdaki adrese yönlendirilmek isteniyorsunuz. " +
         "Onaylıyor musunuz?\n" + this.href);
        if (!confirmation) {
            event.preventDefault();
        }
    });
});
```


##### 4.2. stopPropagation

İç içe iki HTML objesi düşünelim.
İkisinin de kendine has click event handlerı olsun.
Bu durumda ne gibi bir sorun oluşabilir?
Sadece dıştaki html objesine tıkladığımız zaman, sadece dıştaki html objesinin click event handlerı çağırılır.
Fakat içteki html objesine tıkladığımızda, hem içtekinin, hem de dıştakinin event handlerları çağırılır.
Çünkü içtekine tıkladığımız zaman aslında dıştakine de tıklamış oluyoruz.
Bu durum eğer tasarımımızda istenmeyen bir durumsa, istenmeyen sonuçlara yol açıyorsa,
event üzerindeki stopPropagation methodunu çağırarak da bu durumun önünü kesebiliriz.
Böylece, içteki html elemanına tıklandığında eventin dıştaki html elemanına kadar ilerlemesini durdurmuş oluyoruz.

Aşağıda bir menü örneği verdim.
Menü elemanlarından birisine tıklanınca o elemana bir class ekliyoruz.
O elemanın içinde ise o classı silen bir span var.
Ona tıklandığı zaman o menü elemanındaki classın silinmesi lazım.
İçteki elemanın tıklama eventini yakalayıp classı silsek bile,
dıştaki elemanın da tıklama eventi tetikleneceğinden o class tekrar o elemana ekleniyor,
görünümde bir değişiklik olmuyordu normalde.
Fakat stopPropagation methodu bu sorunsalı çözdü.

```javascript
$(document).ready(function () {
    $("ul li").click(function () {
        $(this).addClass("colorful");
    });
    
    $("ul li span").click(function (event) {
        var $parent = $(this).closest("li");
        $parent.removeClass("colorful");
        event.stopPropagation();
    });
});
```

Bu kodun çalışan örneğini görmek isterseniz, 
jsFiddle: [jsfiddle.net/sedran/LEghR/](http://jsfiddle.net/sedran/LEghR/)


##### 4.3. return false

Aynı anda hem `preventDefault` hem de `stopPropagation` methodlarını çağırmamız gerektiğini düşünelim.
Bu bir sorun değil, tabi ki de ard arda ikisini de çağırabiliriz.
Fakat gerek yok.
İkisini birden çağırmak istediğimizde sadece return false yazmamız yeterli.

```javascript
// Aynı anda hem preventDefault
// hem de stopPropagation çağıralım
$("ul li span").click(function (event) {
    event.preventDefault();
    event.stopPropagation();
});

// Yukarıdaki koddan hiçbir farkı yok.
$("ul li span").click(function (event) {
    return false;
});
```

`preventDefault`, `stopPropagation` ve `return false` ile ilgili genel bir örnek için 
jsFiddle: [jsfiddle.net/sedran/updNu/1/](http://jsfiddle.net/sedran/updNu/1/)


#### 5. bind ve unbind methodları

Event dinleyicilerini click, keypress, dblclick gibi kendi isimlerinde yaratılmış fonksiyonlar ile atamak yerine,
bind methoduyla da atayabiliriz.
Bu bize çeşitli faydalar sağlayabilir.
Bunlardan en önemlisi unbind methodu ile bu event dinleyicileri ortadan kaldırabilmektir.
Aşağıdaki örnek kod bind/unbind methodlarının en basit kullanımını göstermektedir.

**HTML Kodu:**

```html
<p></p>
<button id="doit">Click Me</button>
<button id="binder">Bind Listener</button>
<button id="unbinder">Unbind Listener</button>
```

**Javascript Kodu:**

```javascript
$(document).ready(function () {
    // Bind Listener yazan buton tıklandığında 
    // Click Me yazan butona bir click event listenerı bind edelim
    $("#binder").bind('click', function () {
        $("#doit").bind('click', function () {
            var date = new Date();
            // Bu butona tıklandığında ise ekrana birşeyler yazalım.
            $("p").html("Button Clicked On: " + date.toTimeString());
        });
    });
    
    // Unbind Listener yazan butona tıklayınca da 
    // Click Me üzerindeki click event listenerlarını temizleyelim.
    $("#unbinder").bind('click', function () {
        $("#doit").unbind('click');
    });
});
```

Örnekte yaptığımız iş basit.
'Bind Listener' yazan bir buton var.
Bu butona basana kadar 'Click Me' yazan buton hiçbirşey yapmayacak.
Bu butona basıldıktan sonra ise 'Click Me' butonuna bir click event listenerı bind edeceğiz.
Bundan sonra Click Me butonu bir işlev kazanacak ve tıklandığında ekrana birşeyler yazacak.

'Unbind Listener' butonu ise tıklandığı zaman 'Click Me' butonundaki event listenerı etkisiz hale getirecek 
ve böylece 'Click Me' butonu tekrar işlevsiz hale gelecektir.

Bu örneğin çalışan hali için tıklayın: 
[jsfiddle.net/sedran/L6Btr/](http://jsfiddle.net/sedran/L6Btr/)


##### 5.1. Sadece Belirli Bir Fonksiyonu unbind Etmek

Bazen unbind ederek bir eventin tüm dinleyicilerini silmek istemeyiz.
Sadece bir tanesini kaldırmamız gerekebilir.
Bu durumda bir fonksiyon bind ederken elimizde o fonksiyona ait bir referans tutmamız gerekir.
Yani önce ayrı bir yerde fonksiyonu tanımlamamız,
daha sonra bu fonksiyonu ismiyle bind etmemiz
ve unbind ederken de ismi ile unbind etmemiz gerekiyor.

Bu açıklamaya güzel bir örnek şu şekilde geliştirilebilir:

**HTML Kodu:**

```html
<button id="bindAListener">Bind Specific Function</button>
<button id="unbindAListener">Unbind Specific Function</button>
<p>
    <button id="doit">Do It, Click Me</button>
</p>

<p>
    <textarea disabled="disabled" rows="10" cols="35"></textarea>
</p>
```

**Javascript Kodu:**

```javascript
$(document).ready(function() {
    // Bu fonksiyon textarea'nın içeriğini temizler
    function clearTextarea() {
        $("textarea").val("");
    }
    
    // Bu fonksiyon textarea objesine metin ekler
    function append(str) {
        $("textarea").val($("textarea").val() + str);
    }
    
    // Bu fonksiyon textarea içerisine Ahmet yazar
    function writeAhmet() {
       append("Ahmetn");
    }
    
    // Bu fonksiyon textarea içerisine Mehmet yazar
    function writeMehmet() {
        append("Mehmetn");
    }
    
    // Bu fonksiyon textarea içerisine Serdar yazar
    function writeSerdar() {
        append("Serdarn");
    }
    
    // doit butonuna tıklayınca her zaman
    // clearTextarea, writeMehmet, ve writeAhmet
    // fonksiyonları çağırılacak.
    $("#doit").bind("click", clearTextarea);
    $("#doit").bind("click", writeMehmet);
    $("#doit").bind("click", writeAhmet);
    
    // Bind Specific Listener butonuna tıklandıktan sonra
    // doit butonu aynı zamanda writeSerdar
    // fonksiyonunu da tetikleyecek.
    $("#bindAListener").bind("click", function () {
        $("#doit").bind("click", writeSerdar);
    });
    
    // Unbind Specific Function butonuna tıklandıktan sonra
    // doit butonu writeSerdar fonksiyonunu çağırmayı bırakacak
    // Fakat diğer fonksiyonları çağırmaya devam edecek
    $("#unbindAListener").bind("click", function () {
        $("#doit").unbind("click", writeSerdar);
    });
});
```

Çalışan örnek için şu linke göz atabilirsiniz:
[jsfiddle.net/sedran/8XVbx/](http://jsfiddle.net/sedran/8XVbx/)

Bu konuyla ilgili daha önceden yazdığım başka bir örnek için: 
[jsfiddle.net/sedran/nGdSq/1/](http://jsfiddle.net/sedran/nGdSq/1/)


##### 5.2. İsim Uzayı(namespace) Kullanmak

Bazı event dinleyicilerine özel isimler veya sınıflar vermek isteyebiliriz.
Böylece o dinleyicileri kaldırırken onları tanımlayan fonksiyonlara referans vermek zorunda kalmayız.
Bu olayın avantajlarından birisi bir dinleyici birden fazla isim uzayına kaydedebiliyor olmamız
ve kaldırırken de bir isim uzayındaki tüm dinleyicileri kaldırabiliyor olmamız bence.
Aşağıda zor gibi görünen fakat basit bir örnek var.

**HTML Kodu:**

```html
<p>
    <button id="aliGel">Ali Gel</button>
    <button id="aliGit">Ali Git</button>
</p>
<p>
    <button id="veliGel">Veli Gel</button>
    <button id="veliGit">Veli Git</button>
</p>
<p>
    <button id="removeAli">Ali Eventlerini Sil</button>
    <button id="removeVeli">Veli Eventlerini Sil</button>
</p>
<p>
    <button id="removeGel">Gel Eventlerini Sil</button>
    <button id="removeGit">Git Eventlerini Sil</button>
</p>
<p>
    <button id="doit">Do It, Click Me</button>
</p>
 
<p>
    <textarea disabled="disabled" rows="10" cols="35"></textarea>
</p>
```

**Javascript Kodu:**

```javascript
$(document).ready(function() {
    // Bu fonksiyon textarea'nın içeriğini temizler
    function clearTextarea() {
        $("textarea").val("");
    }
     
    // Bu fonksiyon textarea objesine metin ekler
    function append(str) {
        $("textarea").val($("textarea").val() + str + "\n");
    }
    
    $("#doit").bind("click", clearTextarea);
    
    $("#aliGel").click(function () {
        // Burada event listenerımızı
        // ali ve gel adında iki adet isim uzayına ekledik
        $("#doit").bind("click.ali.gel", function() {
            append("Ali Gel");
        });
    });
    
    $("#aliGit").click(function () {
        // Burada event listenerımızı
        // ali ve git adında iki adet isim uzayına ekledik
        $("#doit").bind("click.ali.git", function() {
            append("Ali Git");
        });
    });
    
    $("#veliGel").click(function () {
        // Burada event listenerımızı
        // veli ve gel adında iki adet isim uzayına ekledik
        $("#doit").bind("click.veli.gel", function() {
            append("Veli Gel");
        });
    });
    
    $("#veliGit").click(function () {
        // Burada event listenerımızı
        // veli ve git adında iki adet isim uzayına ekledik
        $("#doit").bind("click.veli.git", function() {
            append("Veli Git");
        });
    });
    
    $("#removeAli").click(function () {
        // Burada ali isim uzayındaki tüm 
        // click event listenerlarını temizliyoruz.
        $("#doit").unbind("click.ali");
    });
    
    $("#removeVeli").click(function () {
        // Burada veli isim uzayındaki tüm 
        // click event listenerlarını temizliyoruz.
        $("#doit").unbind("click.veli");
    });
    
    $("#removeGel").click(function () {
        // Burada gel isim uzayındaki tüm 
        // click event listenerlarını temizliyoruz.
        $("#doit").unbind("click.gel");
    });
    
    $("#removeGit").click(function () {
        // Burada git isim uzayındaki tüm 
        // click event listenerlarını temizliyoruz.
        $("#doit").unbind("click.git");
    });
});
```

Bu örnekte elimizde bir iş yapıcı buton var.
Bu buton ilk olarak işlevsiz.
Biz bu butona diğer butonlar yardımıyla bazı işlevler ekliyoruz.
Burada ekleyebildiğimiz dört tane işlev var.
Bunlar sırasıyla ekrandaki textarea objesine "Ali Gel", "Ali Git", "Veli Gel", ve "Veli Git" yazılarını yazmak.
Bu butonların hepsine basarsak textarea objesine bu dört cümleyi de yazıyor **doit** id'sini dediğim buton.
Fakat ekranda başka butonlar da var.
Mesela "Ali Eventlerini Sil" yazan butona basarsak, "Ali Gel" ve "Ali Git" butonları ile
eklediğimiz dinleyiciler yok olacak.
"Veli Eventlerini Sil" butonuna basarsak "Veli Gel" ve "Veli Git" butonları ile eklediğimiz dinleyiciler uçacak.
"Gel Eventlerini Sil" butonuna bastığımız zaman "Ali Gel" ve "Veli Gel" butonlarıyla eklediğimiz
dinleyiciler kaybolacak ve eğer "Git Eventlerini Sil" butonuna basarsak da "Ali Git" ve "Veli Git"
butonları ile eklediğimiz dinleyiciler ölecek.
Nasıl yaptık bunu? Tabi ki namespace kullanarak.

İşin özeti, "Ali Gel" ve "Veli Gel" butonları "Do It, Click Me" butonuna click eventi dinleyicisi eklerken
sırasıyla "ali", "gel", "veli", "gel" isim uzaylarını kullanarak ekliyorlar.
Dolayısıyla "Gel Eventlerini Sil" dediğimizde "gel" isim uzayında olan bu iki dinleyiciyi yok etmiş oluyoruz.

Bu kodu biraz daha kurcalamadan anlamak zor gelebilir.
O yüzden şu linkten bir göz atın isterseniz:
[jsfiddle.net/sedran/zEmtW/](http://jsfiddle.net/sedran/zEmtW/)


##### 5.3. Dinleyici Fonksiyona Bilgi Göndermek

Fonksiyon kalabalığı yaratmak istemeyebiliriz bazen.
Birden fazla eventi tek bir fonksiyonla dinlemek de mümkün tabi ki.
Tabi buradaki kastım sayfadaki tüm eventleri tek bir fonksiyona göndermek değil,
bu kodumuzun okunabilirliğini oldukça azaltacaktır.
Fakat bazı eventler benzer işlevleri tetikleyebilirler.
Bu eventleri yakalayıp aynı fonksiyona dinlettirdiğimiz zaman da
bu fonksiyon eventin kaynağını algılamakta biraz zorluk çekebilir.
Bu durumlarda bind methodu bize event objesi üzerinde dinleyiciye bilgi gönderebilme altyapısını da sağlıyor.
Ne büyük nimet değil mi? Neyse abartmadan devam edelim.

Mesela bir butona tek tıklayınca bir kutuya "clickd 123",
çift tıklayınca da yine aynı kutuya "double clicked 321" yazsın.
Bunun için click ve dblclick eventlerini tek bir fonksiyona dinlettirip,
kutuya yazılacak olan mesajı da event üzerine ekleyeceğimiz bilgiden okutabiliriz.

**HTML Kodu:**

```html
<button id="clickme">Click or Double Click Me</button>
<hr />
<textarea disabled="disabled" rows="20" cols="40"></textarea>
```

**Javascript Kodu:**

```javascript
$(document).ready(function() {
    // Bu fonksiyon textarea'nın içeriğini temizler
    function clearTextarea() {
        $("textarea").val("");
    }
     
    // Bu fonksiyon textarea objesine metin ekler
    function append(str) {
        $("textarea").val($("textarea").val() + str + "n");
    }
    
    // Tek tıklamayı da çift tıklamayı da 
    // bu fonksiyon yakalasın
    function clickOrDblClick(event) {
        clearTextarea();
        
        // event üzerinde gönderdiğimiz data'dan
        // gelen bilgileri de kutuya yazsın.
        append(event.data.type);
        append(event.data.anyValue);
    }
    
    $("#clickme").bind("click", {type: "clicked", anyValue: 123}, clickOrDblClick);
    $("#clickme").bind("dblclick", {type: "double clicked", anyValue: 321}, clickOrDblClick);
});
```

Yukarıda gördüğümüz gibi, bind methoduna eğer ikinci parametre olarak bir json objesi geçersek, 
bu eventi dinleyen fonksiyona gönderilecek parametreleri içeriyor demektir.

Eventi dinleyen **clickOrDblClick** fonksiyonu da event üzerinde gelen data ne olursa olsun 
aynı işi yapmakla yükümlü bir emir kulu oluyor bu durumda.

Bu örneği çalıştırmak isterseniz de buyrun: 
[jsfiddle.net/sedran/MhtcM/](http://jsfiddle.net/sedran/MhtcM/)


#### 6. one() Methodu: Event Dinleyicinin Sadece Bir Kere Çalışması

Bazı event dinleyicilerin sadece bir kere çalışmasını istediğimiz durumlar olabilir.
Mesela bir butona tıkladığımız zaman sayfaya birşey eklenmesini istiyoruzdur 
fakat ikinci kez tıklandığında eklenmesini istemiyoruzdur.
Çünkü ekleyeceğimiz şeyi zaten eklemişizdir.
Bu iş için amele bir yöntem event dinleyiciyi bind edip, dinleyici fonksiyon çalıştığında da unbind etmektir.
Amele kodu aşağıda görebilirsiniz:

```html
<button id="clickme">Click Me</button>
```

```javascript
$(document).ready(function() {
    $("#clickme").bind('click.appender', function () {
        $("#clickme").after("<p>Butona tıkladın!</p>");
        $("#clickme").unbind("click.appender");
    });
});
```

Amele kodun jsFiddle linki: 
[jsfiddle.net/sedran/XdwQK/1/](http://jsfiddle.net/sedran/XdwQK/1/)

Pek de kötü bir çözüm değil aslında. 
Hatta yaygın bile olabilir. 
Fakat daha iyisi varken neden bunu yazalım değil mi? İşte daha kolayı:

```javascript
$(document).ready(function() {
    $("#clickme").one('click', function () {
        $("#clickme").after("<p>Butona tıkladın!</p>");
    });
});
```

`one` methodu ile eklediğimiz event dinleyici jQuery tarafından sadece event ilk gerçekleştiğinde çalıştırılır 
ve daha sonra otomatik olarak unbind edilir. 
Böylece bu işle biz uğraşmamış oluruz.

İşte çalışan örnek kod:
[jsfiddle.net/sedran/XdwQK/2/](http://jsfiddle.net/sedran/XdwQK/2/)

Böylece aylardır taslak olarak duran bir blog yazımı da sonunda tamamlamış oluyorum.
Buraya kadar okuduysanız sabrınız için teşekkürler.
Umarım faydalı bir iş yapabilmişimdir.
Nasıl desem, bir developer gözlerini tamamen kaybetmeden önce arkasından gelenlere birşeyler bırakabilmeli.
Sorunuz olursa yorumlarınızı bekliyorum.

Kodlu günler :)
