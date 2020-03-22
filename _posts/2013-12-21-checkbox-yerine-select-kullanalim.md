---
layout: post
title:  "Checkbox Yerine Select Kullanalım"
date:   2013-12-21 19:27:00 +0300
categories: [Programlama, Javascript]
author: Serdar Kuzucu
permalink: /checkbox-yerine-select-kullanalim
comments: true
post_identifier: checkbox-yerine-select-kullanalim
featured_image: /assets/posts/combo-box.png
---

[netmera]: http://www.netmera.com/
[jsfiddle-demo]: http://jsfiddle.net/sedran/NrG5U/

Uzun zaman olmuş blog yazmayalı. 
Madem frond-end developer olduk, hadi biraz daha Javascript yazalım. 
Geçen gün [Netmera][netmera] için bir sayfa geliştirirken karşılaştığım bir zorluktan bahsetmek istiyorum öncelikle. 
Diyelim kullanıcıya ekranda belirli seçeneklerden istediği kadarını seçebilmesi için bir arayüz hazırlamamız gerekiyor. 
Bunun için genellikle kullanılan ön yüz elemanı genellikle checkbox olur. 
Fakat seçenekler biraz fazla olursa ne olur? 
Ekranda 50-60 tane checkbox'ı alt alta göstermek ister miyiz? 
Bu gibi durumlarda bizim kullandığımız genel yöntem 
kullanıcıya bir tane select (dropdown yada combobox) göstermek 
ve bir tane butonla da daha fazla select elementini ekrana getirebilmesini sağlamak. 
Bu yöntem çok güzel bir şekilde ihtiyacımızı karşılıyor fakat bir sıkıntısı var, 
Javascript ve jQuery ile bunu yönetmesi biraz zor.

<!--more--> 

Bu ekranda alt alta dizeceğimiz açılır kutuların bir takım gereksinimleri karşılaması gerekiyor. 
Gereksinimleri yazdığımda AngularJS kullanıcıları görecek ki aslında jQuery değil,
AngularJS kullanmak daha mantıklı. 
Fakat inat ettim bir türlü öğrenmiyorum.
Belki bir dahaki yazımda aynı şeyi AngularJS ile yapmayı anlatırım.
Şimdi gereksinimler:

1. Ekranda bir select varken kullanıcı tüm seçeneklerden sadece bir tanesini seçebilir.
2. Ekranda bulunan butona basarak ekrana yeni bir select ekleyebilir.
3. Ekrana yeni eklenen select'ler önceden eklenmiş olanlarda seçili olan değerleri bulundurmayacak.
4. Select'lerden herhangi bir tanesinde kullanıcı bir değer seçtiğinde, 
önceden seçmiş olduğu değer diğer select'lere eklenecek, yeni seçtiği değer de diğer select'lerden çıkartılacak.
5. Elimizdeki seçenek sayısından fazla select ekleyemeyecek.

Şimdilik ekrana eklenmiş bir select'in tekrar ekrandan silinmesi kısmına girmeyeceğim. 
Belki yazı kısa olursa onu da eklerim.

Aşağıdaki gibi, kullanıcının karşısına ilk önce ekranda tek seçenekle ve bir butonla çıkalım. 
İsterse daha fazlasını eklesin.

![Asuman Only](/assets/posts/single-checkbox-and-button.png)

```html
<div id="selectContainer">
    <p><select class="my-select"></select></p>
</div>

<p><button id="addOneMore">+ Ekle</button></p>
```

Bu durumdayken kullanıcı "Ekle" butonuna iki kere basarsa ne olur? Onu da aşağıda görelim:

![Three Checkboxes](/assets/posts/three-checkboxes-and-button.png)

Bunu yapabilmek çok mu zor? 
Hayır. Öncelikle elimizdeki tüm seçenekleri ve ekranda seçili olan seçenekleri birer array'de tutuyoruz.
Daha sonra yeni bir select yaratılabilmesi için yapılması gereken `addOption`, `addOptions` 
ve `addSelect` fonksiyonlarını tanımlıyoruz.

### Array'ler

```javascript
var elements = ["Asuman", "Ahmet", "Ali", "Ayşe", "Mehmet"];
var selectedElements = [];
```

### addOption Fonksiyonu:

Bu fonksiyon varolan bir select objesine yeni bir seçenek ekler.

```javascript
/**
 * Adds an option to a select object
 */
function addOption(select, optVal, opt) {
    var opt = $("<option />").attr('value', optVal).text(opt);
    select.append(opt);
}
```

### addOptions Fonksiyonu

Bu fonksiyon varolan bir select objesine elements array'indeki tüm elemanları ekler:

```javascript
/**
 * Adds all available options to a select object
 */
function addOptions(select) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        addOption(select, element, element);
    }
    
    // remove new selected element from available elements
    var e = elements.splice(0, 1)[0];
    // add it to selectedElements array
    selectedElements.push(e);
}
```

### addSelect Fonksiyonu

Bu fonksiyon da Ekle butonuna basıldığında yeni bir select objesini ekrana ekler.

```javascript
/**
 * Adds a new select element when the add button is pressed.
 */
function addSelect() {
    if (elements.length == 0) {
        return;
    }
    var select = $("<select />").addClass("my-select");
    var p = $("<p />").append(select);
    addOptions(select);
    $("#selectContainer").append(p);
}
```

Şimdi bir de bu fonksiyonları çalıştıran bir başlangıç noktası tanımlayalım:

```javascript
/**
 * Loads initial values into initial select objects
 */
function initialize() {
    $(".my-select").each(function () {
        var select = $(this);
        addOptions(select);
    });
}

$("#addOneMore").click(addSelect);
initialize();
```

Bu kod şu haliyle, ilginç bir şekilde, çalışıyor. 
Fakat birkaç eksiği var. Gereksinim 4 ve 5'i sağlamıyor. 
Şimdi yeni bir select eklediğimizde önceki select'lerden yeni select'deki değeri silmek için gereken 
`removeOption` ve `removeOptions` fonksiyonlarını yazalım.

### removeOption Fonksiyonu

Bu fonksiyon verilen bir select objesinden verilen bir değeri siler. 
Artık bu select objesinden bu değer seçilemez.

```javascript
/**
 * Removes an option from a given select object
 */
function removeOption(select, optionValue) {
    var option = select.find('option[value="' + optionValue + '"]');
    option.remove();
}
```

### removeOptions Fonksiyonu

Bu da verilen bir seçeneği verilen bir select objesi hariç tüm select objelerinden siler.
Yani yeni bir select objesi sayfaya eklendiği zaman
bu select objesi hariç diğer tüm select objelerinden bu select objesinde seçili olan değerin silinmesi gerekiyor.
Biraz uzun bir cümle oldu fakat anlaşılabilir bence :)

```javascript
/**
 * Removes an option from all select objects except the given
 */
function removeOptions(optionValue, excludeSelect) {
    var selects = $(".my-select").not(excludeSelect);
    for (var i = 0; i < selects.length; i++) {
        var select = $(selects[i]);
        removeOption(select, optionValue);
    }
}
```

Tabi ki bu fonksiyonları yazdığımıza göre kullanmamız gerekiyor.
Bunun için, yeni yaratılan select objesine seçenekleri eklerken, 
`removeOptions` fonksiyonunu çağırıyoruz. 
Yani yukarıda tanımladığımız `addOptions` fonksiyonunu şu şekilde modifiye ediyoruz:

```javascript
/**
 * Adds all available options to a select object
 */
function addOptions(select) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        addOption(select, element, element);
    }
    
    // remove new selected element from available elements
    var e = elements.splice(0, 1)[0];
    // add it to selectedElements array
    selectedElements.push(e);
    
    removeOptions(e, select);
}
```

Tamamlanmış gibi görünüyor değil mi? 
Hayır. Hala gereksinim 4'ü doğru düzgün karşılayamadık. 
Diyelim ki bu uygulamada 3 tane select objesi var ekranda. 
Yani kullanıcı 2 tane ekledi sonradan. 
Şimdi hepsinin içerisinde 'Ayşe' seçeneği var değil mi? 
Ya 3'ünden de 'Ayşe' seçersek? 
Bu durumun oluşmasını engellemek için de, bir select objesindeki seçim değiştiğinde, 
o select objesinde önceden seçili olan değeri diğer objelere ekleyeceğiz, 
şu anda seçili olan değeri de diğerlerinden sileceğiz. 
Böylece, kullanıcı Ahmet seçeneği seçili olan kutuda Ayşe'yi seçerse,
diğer kutulara Ahmet seçeneğini ekleyeceğiz ve Ayşe seçeneğini sileceğiz.

Bunun için `selectionChange` ve `replaceOptions` isimli iki fonksiyonu ekleyeceğiz.

### replaceOptions Fonksiyonu

Bu fonksiyon üç parametre alıyor.
Verilen bir select objesi haricindeki tüm select objelerine verilen bir seçeneği ekliyor
ve onlardan verilen bir seçeneği siliyor.

```javascript
/**
 * Adds a value to and remove a value from all selects except the given select
 */
function replaceOptions(addValue, removeValue, excludeSelect) {
    var selects = $(".my-select").not(excludeSelect);
    for (var i = 0; i < selects.length; i++) {
        var select = $(selects[i]);
        removeOption(select, removeValue);
        addOption(select, addValue, addValue);
    }
}
```

### selectionChange Fonksiyonu

Bu fonksiyon ekrandaki select objelerinden birisinin değeri değiştiği zaman çağırılır. 
Görevi select objelerinin ve yukarıda tanımladığımız iki array'in tutarlı kalmalarını sağlamaktır.

```javascript
/**
 * Called when a selection changes
 */
function selectionChange() {
    var select = $(this);
    var index = select.index(".my-select");
    var currentValue = select.val();
    var previousValue = selectedElements[index];
    var indexInArray = $.inArray(currentValue, elements);
    
    replaceOptions(previousValue, currentValue, select);
    elements[indexInArray] = previousValue;
    selectedElements[index] = currentValue;
}
```

Şimdi bu selectionChange fonksiyonunu tetikleyecek bir event listener tanımlamamız gerekiyor. 
Bunu da sayfaya sonradan dinamik olarak eklenecek objeleri de düşünerek şu şekilde yapıyoruz:

```javascript
$(document).on('change', '.my-select', selectionChange);
```

### Final

Şimdi buradaki kodu derleyip toparlayıp tekrar yazacak olursak, günün sonunda şöyle birşey çıkıyor karşımıza:

[JSFiddle'da denemek için tıklayın.][jsfiddle-demo]

```javascript
var elements = ["Asuman", "Ahmet", "Ali", "Ayşe", "Mehmet"];
var selectedElements = [];

/**
 * Adds an option to a select object
 */
function addOption(select, optVal, opt) {
    var opt = $("<option />").attr('value', optVal).text(opt);
    select.append(opt);
}

/**
 * Adds all available options to a select object
 */
function addOptions(select) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        addOption(select, element, element);
    }
    
    // remove new selected element from available elements
    var e = elements.splice(0, 1)[0];
    // add it to selectedElements array
    selectedElements.push(e);
    
    removeOptions(e, select);
}

/**
 * Removes an option from a given select object
 */
function removeOption(select, optionValue) {
    var option = select.find('option[value="' + optionValue + '"]');
    option.remove();
}

/**
 * Removes an option from all select objects except the given
 */
function removeOptions(optionValue, excludeSelect) {
    var selects = $(".my-select").not(excludeSelect);
    for (var i = 0; i < selects.length; i++) {
        var select = $(selects[i]);
        removeOption(select, optionValue);
    }
}

/**
 * Adds a new select element when the add button is pressed.
 */
function addSelect() {
    if (elements.length == 0) {
        return;
    }
    var select = $("<select />").addClass("my-select");
    var p = $("<p />").append(select);
    addOptions(select);
    $("#selectContainer").append(p);
}

/**
 * Adds a value to and remove a value from all selects except the given select
 */
function replaceOptions(addValue, removeValue, excludeSelect) {
    var selects = $(".my-select").not(excludeSelect);
    for (var i = 0; i < selects.length; i++) {
        var select = $(selects[i]);
        removeOption(select, removeValue);
        addOption(select, addValue, addValue);
    }
}

/**
 * Called when a selection changes
 */
function selectionChange() {
    var select = $(this);
    var index = select.index(".my-select");
    var currentValue = select.val();
    var previousValue = selectedElements[index];
    var indexInArray = $.inArray(currentValue, elements);
    
    replaceOptions(previousValue, currentValue, select);
    elements[indexInArray] = previousValue;
    selectedElements[index] = currentValue;
}

/**
 * Loads initial values into initial select objects
 */
function initialize() {
    $(".my-select").each(function () {
        var select = $(this);
        addOptions(select);
    });
}

$("#addOneMore").click(addSelect);
$(document).on('change', '.my-select', selectionChange);
initialize();
```

Bu yöntemi anlatmak içindi.
Bir sonraki yazımda bunu bir jQuery plugin'i olarak yazmayı düşünüyorum.
Belki de AngularJS ile denerim şansımı.
Kendinize iyi bakın efendim, kodlu günler.

Dipnot: Front-End'i küçümsemeyin ;)
