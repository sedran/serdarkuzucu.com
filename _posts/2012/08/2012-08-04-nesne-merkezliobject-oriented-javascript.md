---
layout: post
title:  "Nesne Merkezli(Object Oriented) Javascript"
date:   2012-08-04 19:47:00 +0300
categories: [Javascript, Programlama]
author: Serdar Kuzucu
permalink: /nesne-merkezliobject-oriented-javascript/
comments: true
post_identifier: nesne-merkezliobject-oriented-javascript
featured_image: /assets/category/javascript.jpg
---

[javaturk]: http://www.javaturk.org/

Bu yaz yaptığım stajda edindiğim deneyimlerini sıralamam istense şüphesiz ilk sıraya 
[Akın hocam][javaturk]dan aldığım 2 haftalık Java dersini koyardım. 
Hatta öyle bir eğitim oldu ki bu, bütün sıralamayı etkiledi bence.
'Java biliyorum ki ben, hehe' diyerek gittiğim eğitimde her gün ağzımı açık bırakacak,
daha önceden bilmediğim şeyler öğrendim.
Gerek Java syntax'ında olsun, gerekse işin mantığı ve felsefesinde olsun, 
birçok şey keşfettim Akın hocam sayesinde.

<!--more-->

Şimdi akıllara bu kadar Java dedikten sonra niye OOP Javascript başlığı attığım sorusuna.
Ne kadar Java manyağı olursak olalım, bir gün Java ile yaptığımız ürünümüzü tanıtmak için 
tamamen Javascript'te dayalı bir web sayfası kodlamak zorunda kalabiliriz. 
Web artk Javascript. 
Ve benim bu sıralar stajda yaptığım da bu. 
Sadece bu da değil, neden Javascript sorusu başlı başına bir başlık 
ve uzun bir blog yazısına sebep olabilir. 
Bu yüzden bu konuya hiç girmemeyi düşünüyorum.

Öncelikle buraya gelip bu yazıyı okuyan herkesin temelde biraz Javascript bildiğini varsayıyorum. 
Hatta biraz da Nesne Merkezli Programlama temeliniz olduğunu varsayıyorum. 
Eğer Nesne Merkezli ne lan diye bir soru varsa kafanızda, sizi sırasıyla şu linklere gönderiyorum:

[Neden Nesne-Merkezli Programlama? I](http://www.javaturk.org/?p=909)

[Neden Nesne-Merkezli Programlama? II](http://www.javaturk.org/?p=1694)

Böyle bir yazı yazmamın sebebi 
nesne merkezli programlamanın ne kadar güzel bir şey olduğunu göstermek değil, 
ki bunu zaten biliyoruz :) 
Benim gibi manyak OOP'ciler için bir programdaki tüm değişkenleri 
aynı sayfada alt alta dizip belirli bir objeye ait olmayan fonksiyonları da 
onların aralarına serpiştirmek dünyanın en sinir bozucu ve katlanılamaz işi haline gelebilir. 
Hem okunabilirliği düşürür, hem de sayfaya başka bir Javascript dosyası çağrıldığında 
patlayacak mı patlamayacak mı emin olamazsınız. 
Kuşkuyla yaşamak kötüdür. 
Bu yüzden verilerimizi objelere paketleyip 
ortak amaçlar için yaratılmış olanları aynı paketlerde tutmak isteyebiliriz.

Javascript ise obje tanımlama ve instance yaratma konusunda birçok programlama dilinden ayrılıyor. 
Obje tanımlamak için o kadar fazla yöntemimiz var ki, 
isteğe ve ihtiyaca bağlı olarak aynı programın içerisinde birden fazla şekilde objeler tanımlayabilir, 
veya kendinize uygun bir yöntem seçip bunu kendi standardınız haline getirebilirsiniz.

Şimdi olabilecek en basit haliyle bir obje yaratıp onun üzerindeki field'lara ulaşalım.

```javascript
var employee = {
    name: 'Foo',
    surname: 'Bar',
    getFullName: function() {
        return this.name + ' ' + this.surname;
    }
};

function firstTest() {
    console.log(employee.name);
    console.log(employee.surname);
    console.log(employee.getFullName());
}
```

Gördüğünüz gibi, son derece basit. 
Point tarzı basit objeler için sınıf tanımlamaya gerek bırakmayacak kadar basite indirgiyor işlemlerimizi.

Başka bir yöntem ise, Object sınıfının bir instance'ını oluşturup ona özelliklerini ve metotlarını eklemek.

```javascript
var person = new Object();
person.name = 'Foo';
person.surname = 'Bar';
person.getFullName = function() {
    return this.name + ' ' + this.surname;
};

function secondTest() {
    console.log(person.name);
    console.log(person.surname);
    console.log(person.getFullName());
}
```

İlk yönteme çok benzedi değil mi? 
Hatta sonuç olarak tamamen aynı objeyi yarattık aslında. 
İlk yöntem süslü parantezlerin içerisinde yapıldığı için ikinci yönteme göre daha derli toplu görünüyor lakin.

Şimdi ilk yöntemin çakması gibi görünen başka bir yöntem göstereceğim. 
PHP ile uğraşan arkadaşlar bilirler PHP'deki array yapısını. 
Bu da biraz ona benziyor işte.

```javascript
var human = {};
human["name"] = 'Foo';
human["surname"] = 'Bar';
human["getFullName"] = function() {
    return this.name + ' ' + this.surname;
};

function thirdTest() {
    console.log(human["name"]);
    console.log(human.surname);
    console.log(human.getFullName());
}
```

Dikkat ederseniz, test fonksiyonunda da hem nokta ile, hem de köşeli parantez ile objenin özelliklerine erişebildim.
Bu durum sadece bu örnekte veya metotta geçerli değil, yukarıdaki tüm metotlar birlikte de kullanılabilir.
Mesela aşağıdaki kod hata vermez.

```javascript
var asosyalbebe = {
    author: 'Serdar Kuzucu',
    url: 'http://blog.asosyalbebe.com'
};
asosyalbebe.service = 'Blogger';
asosyalbebe['getTitle'] = function() {
    return 'AsosyalBebe!';
};

function fourthTest() {
    console.log(asosyalbebe["author"]);
    console.log(asosyalbebe.url);
    console.log(asosyalbebe.service);
    console.log(asosyalbebe.getTitle());
}
```

Birçok kod gördük, birçok obje yarattık.
Şimdi gelelim yukarıdaki örneklerde neyin eksik olduğuna.

##### 1. Bir class'ın birden fazla instance'ının oluşturulması

Yukarıdaki örneklerde görüldüğü gibi, objeleri yaratıyor ve hemen bir değişkene referanslarını veriyoruz.
Peki aynı objeden bir tane daha yaratmak istersek ne yapmamız gerekiyor?
Aynı kodu kopyalayıp başka bir değişkene vermek.
Bu durumda da obje sayısı arttıkça sayfamızdaki kod sayısı ve kod tekrarı artacak, okunabilirlik azalacak
ve bir şekilde objenin şeklinde yapısında bir değişiklik yapmak istediğimizde
tüm kodları tarayıp yarattığımız tüm objelerin kodlarını elle değiştirmemiz gerekecek.

##### 2. Parametre Alan/Almayan Kurucu(Constructor) Metot

Yukarıdaki sorunun çözümü için yapılması gereken işlem aslında bu.
Objeleri değişken tanımlama sırasında yaratmak yerine önceden sınıf olarak tanımlayabilirsek, 
bir şekilde constructor yaratabilirsek, o objenin her türlü instance'ını yaratabiliriz.

##### 3. Private ve/veya Statik Değişken ve Metotlar

Objemizi yarattık, 
peki ya objemizde dışarıdan erişilmesini istemediğimiz değişken ve metotlar olmasını istersek ne yapacağız?
Ayrıca yine dışarıdan erişilmesini istemediğimiz belirli değişkenlerin
ve metotların tüm objeler tarafından ortak olarak kullanılmasını istersek(statik), 
bu durumu nasıl çözeriz?
Göreceğiz.

##### 4. Parent Sınıftan Kalıtım(İnheritance)

Bir diğer önemli konu da kalıtım.
Javascript'de pek kullanmadım 
fakat OOP kavramının temelini oluşturan kalıtım konusuna da değinmeden bitirmeyeceğim.

Şimdi yukarıda belirttiğim sorunları çözen sınıflar yazmaya başlayalım.
İlk önce 2 boyutlu uzayda bir nokta sınıfı tanımlayalım.

```javascript
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function pointTest() {
    var pt1 = new Point(1, 2);
    console.log(pt1.x); // 1
    console.log(pt1.y); // 2

    var pt2 = new Point(3, 4);
    console.log(pt2.x + " " + pt2.y); // "3 4"
}
```

Görüldüğü gibi, Javascript'te sınıfları function olarak tanımlıyoruz.
Bir sınıf üzerindeki public alanları da isminin önüne this keyword'ünü koyarak belirtiyoruz. 
Daha sonra, 'new' keyword'ü ile istediğimiz kadar instance'ını oluşturabiliyoruz. 
Ne güzel değil mi?

Peki ya bu x ve y değerlerinin obje içerisinde private olarak saklanmasını istiyorsak 
ve sadece tanımlayacağımız getter fonksiyonlar aracılığıyla kullanıcıya ulaşmasını istiyorsak ne yapıyoruz? 
İşte bunu yapıyoruz:

```javascript
function Point(x, y) {
    var _x = x;
    var _y = y;

    this.getX = function() {
        return _x;
    };

    this.getY = function() {
        return _y;
    };
}

function pointTest() {
    var pt = new Point(3, 4);
    console.log(pt._x); // undefined
    console.log(pt._y); // undefined
    console.log(pt.x); // undefined
    console.log(pt.y); // undefined
    console.log(pt.getX()); // 3
    console.log(pt.getY()); // 4
}
```

Gördüğünüz gibi, başına this keyword'ünü yazmadığımız alanlar objenin içinde sır gibi saklanıyor.
Benzer şekilde, objenin içerisinde this kullanmadan tanımlayacağımız fonksiyonlar da private olacaktır.

```javascript
function Point(x, y) {
    var _x = x;
    var _y = y;

    // Private fonksiyon
    function addXtoY() {
        return _x + _y;
    }

    this.getXPlusY = function() {
        return addXtoY();
    };

    this.getX = function() {
        return _x;
    };

    this.getY = function() {
        return _y;
    };
}

function pointTest() {
    var pt = new Point(3, 4);
    /* console.log(pt.addXtoY()); çalışmaz, hata verir */
    console.log(pt.getXPlusY());
}
```

Şimdi statik değişken ve metotlara gelelim.
Öncelikle Point objemizde, o noktadan parametre olarak geçilen başka bir noktaya olan uzaklığı hesaplayan
`distanceFrom` metodunu tanımlayacağız, 
daha sonra ise Point sınıfı üzerinde statik bir değişken olarak orijin'i 
ve statik bir fonksiyon olan `randomPoint()` metodunu tanımlayacağız.
Daha sonra da yarattığımız bir noktanın orijin ve rastgele bir noktaya olan uzaklıklarını hesaplayacağız sırasıyla.

```javascript
function Point(x, y) {
    var _x = x;
    var _y = y;

    this.getX = function() {
        return _x;
    };

    this.getY = function() {
        return _y;
    };

    this.distanceFrom = function(p2) {
        var xx = (_x - p2.getX()) * (_x - p2.getX());
        var yy = (_y - p2.getY()) * (_y - p2.getY());
        return Math.sqrt(xx + yy);
    };
}

Point.origin = new Point(0, 0);
Point.randomPoint = function () {
    var x = Math.random() * 100;
    var y = Math.random() * 100;
    return new Point(x, y);
};

function pointTest() {
    var pt = new Point(3, 4);
    console.log(pt.distanceFrom(Point.origin)); // 5 verir.
    var rpt = Point.randomPoint();
    console.log(pt.distanceFrom(rpt)); // tahmin edilemez, çünkü nokta rastgele.
}
```

Lakin yine bir karın ağrımız var.
Bu statikler feci halde public oldular.
OOP mantığına göre origin ve randomPoint'in zaten public olması gerekiyordu 
fakat ya ben private ve statik alanlar yaratmak istersem? 
Malesef Javascript'de sınıfın sırtına vurduğumuz her metot ve değişken public olur. 
Bu yüzden farklı hileler bulup, sadece Point objesinin içerisinden erişilebilecek 
ve statik alanlar yaratmamız lazım.

Bunun için artık yukarıda kullandığımız obje ve sınıf tanımlamalarını bir kenara bırakıyoruz 
ve bambaşka bir syntax kullanıyoruz.

```javascript
var Point = (function () {
    /* Private Statik Değişken */
    var MAX_RANDOM_POINT = 100;

    /* Private Statik Fonksiyon */
    function point_rand() {
        return Math.random() * MAX_RANDOM_POINT;
    }

    /* Constructor fonksiyon */
    function point_constructor(x, y) {
        var _x = x;
        var _y = y;

        this.getX = function() {
            return _x;
        };

        this.getY = function() {
            return _y;
        };

        this.distanceFrom = function(p2) {
            var xx = (_x - p2.getX()) * (_x - p2.getX());
            var yy = (_y - p2.getY()) * (_y - p2.getY());
            return Math.sqrt(xx + yy);
        };
    }

    /* Public Statik Değişken */
    point_constructor.origin = new point_constructor(0, 0);

    /* Public Statik Fonksiyon */
    point_constructor.randomPoint = function() {
        var x = point_rand();
        var y = point_rand();
        return new point_constructor(x, y);
    };

    return point_constructor;
}());

function pointTest() {
    var pt = new Point(3, 4);
    console.log(pt.distanceFrom(Point.origin));
    var rpt = Point.randomPoint();
    console.log(pt.distanceFrom(rpt));
}
```

Burada Point dediğimiz şey değişken gibi gözükse de, 
karşısına yazdığımız fonksiyonun return değerine baktığımızda 
aslında fonksiyon olduğunu görüyoruz. 
Karşısındaki fonksiyonun içerisinde ne tanımlarsak tanımlayalım, Point, 
ona verdiğimiz return değerinden başka bir şey değil. 
Fakat burada yaptığımız ufak hile, point_constructor fonksiyonunu gizli bir scope içerisinde tanımlayıp, 
sadece bu scope içerisinde erişilebilecek fonksiyon 
ve değişkenler yaratarak bunları private statikmiş gibi kullanmaktan başka bir şey değil.

Şimdi gelelim kalıtıma. Javascript'te inheritance nasıl sağlanır?

Aşağıda `ColorPoint` isminde bir sınıf yazdım 
ve bu sınıfın amacı da renkli nokta oluşturmak. 
İşin 'Nokta' olma kısmını yukarıda tanımladığımız `Point` sınıfı sağlarken, 
`ColorPoint` sınıfını sadece renk ile ilgili bilgileri tutan, 
`Point` objesinin bir çocuk sınıfı olarak tanımlayabiliriz.
Böylelikle bir `ColorPoint` sınıfı instance'ını aynı zamanda 
`Point` sınıfının bir instance'ı olarak da kullanabiliriz.

```javascript
var ColorPoint = (function() {
    var DEFAULT_COLOR = "#000000";

    function colorpoint_constructor(x, y, color) {
        /* Super Constructor'ı Çağırdık */
        Point.call(this, x, y);

        var _color;
        if (color) {
            _color = color;
        } else {
            _color = DEFAULT_COLOR;
        }

        this.getColor = function() {
            return _color;
        };
    }

    colorpoint_constructor.prototype = new Point();

    return colorpoint_constructor;
}());

function CPTest() {
    var cp = new ColorPoint(3, 4, "#900");
    console.log(cp.getX()); // 3
    console.log(cp.getY()); // 4
    console.log(cp.getColor()); // "#900"
    var pt = new Point(6, 8);
    console.log(cp.distanceFrom(pt)); // 5
    console.log(cp instanceof Point); // true
    console.log(cp instanceof ColorPoint); // true
}
```

Javascript'te kalıtım konusunda pek bir yeteneksizdim 
fakat madem OOP ile ilgili bir yazı yazıyorum, 
bunun da bu yazıda olması lazım dedim 
ve bu yazıyı yazmak için araştırıp öğrendim.

Son olarak, `ColorPoint`'ten türetilmiş `HtmlPoint` isminde bir sınıf yazdım 
ve onu kullanarak sayfaya 1000 tane rastgele renkli rastgele koordinatlı nokta yaratıp 
ekleyen örnek bir uygulama yazdım. 
Onu da göstereyim:

```javascript
var Point = (function() {
    /* Private Statik Değişken */
    var MAX_RANDOM_POINT = 1000;

    /* Private Statik Fonksiyon */
    function point_rand() {
        return Math.random() * MAX_RANDOM_POINT;
    }

    /* Constructor fonksiyon */
    function point_constructor(x, y) {
        var _x = x;
        var _y = y;

        this.getX = function() {
            return _x;
        };

        this.getY = function() {
            return _y;
        };

        this.distanceFrom = function (p2) {
            var xx = (_x - p2.getX()) * (_x - p2.getX());
            var yy = (_y - p2.getY()) * (_y - p2.getY());
            return Math.sqrt(xx + yy);
        };
    }

    /* Public Statik Değişken */
    point_constructor.origin = new point_constructor(0, 0);

    /* Public Statik Fonksiyon */
    point_constructor.randomPoint = function() {
        var x = point_rand();
        var y = point_rand();
        return new point_constructor(x, y);
    };

    return point_constructor;
}());

var ColorPoint = (function() {
    var DEFAULT_COLOR = "#000000";

    function colorpoint_constructor(x, y, color) {
        Point.call(this, x, y);

        var _color;
        if (color) {
            _color = color;
        } else {
            _color = DEFAULT_COLOR;
        }

        this.getColor = function() {
            return _color;
        };
    }

    colorpoint_constructor.prototype = new Point();

    return colorpoint_constructor;
}());

var HtmlPoint = (function() {
    var array = ['A', 'B', 'C', 'D', 'E', 'F', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    function random_color() {
        var color = "#";
        for (var i = 0; i &lt; 6; i++) {
            var randIndex = Math.ceil(Math.random() * (array.length - 1));
            color += array[randIndex];
        }
        return color;
    }

    function _construct(x, y, color) {
        ColorPoint.call(this, x, y, color);

        var element = document.createElement("div");
        element.className = "htmlPoint";
        element.style.backgroundColor = this.getColor();
        element.style.position = "absolute";
        element.style.left = this.getX() + "px";
        element.style.top = this.getY() + "px";
        element.style.width = "6px";
        element.style.height = "6px";
        element.style.borderRadius = "3px";

        var _isVisible = false;

        this.draw = function() {
            if (!_isVisible) {
                document.body.appendChild(element);
                _isVisible = true;
            }
        }
    }

    _construct.prototype = new ColorPoint();
    _construct.randomHtmlPoint = function (xmax, ymax) {
        var randx = Math.ceil(Math.random() * xmax);
        var randy = Math.ceil(Math.random() * ymax);
        var randColor = random_color();
        return new _construct(randx, randy, randColor);
    };

    return _construct;
}());

/**
 * İşleri kapalı bir scope içinde yapmak bazen daha güvenlidir.
 * Bazen de sadece artistik görünsün diyedir.
 */ 
(function() {
    var xmax = window.innerWidth;
    var ymax = window.innerHeight;

    /**
     * Parametre geçilen total sayısı kadar HtmlPoint yaratıp ekrana çizen fonksiyon
     */
    function createPattern(total) {
        for (var i = 0; i &lt; total; i++) {
            var htmlpt = HtmlPoint.randomHtmlPoint(xmax, ymax);
            htmlpt.draw();
        }
    }

    /**
     * Çağrılınca ekrana 1000 tane node ekleyelim ve arkaplanı siyah yapalım.
     */
    function init() {
        document.body.style.backgroundColor = "#000";
        createPattern(1000);
    }

    /**
     * Herşey hazır olduğunda, biz başlayalım.
     */
    window.addEventListener("load", init, false);

}());
```

Ve bu da sonuç:

![Color points simulation](/assets/posts/js-color-points.png)

Yukarıdaki Javascript kodunu kullanan örnek Html uygulamasını şu linkte bulabilirsiniz:

[Download](https://www.box.com/s/1c0935a347ec53963343)

Bir yazının daha sonuna geldik, umarım bu yazıdan sonra dünya artık daha güzel bir yerdir.

Kucak dolusu kodlar.
