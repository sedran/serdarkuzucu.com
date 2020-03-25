---
layout: post
title:  "Java'da Kendi LayoutManager'ımızı Yaratalım"
date:   2012-02-01 20:22:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /javada-kendi-layoutmanagerimizi-yaratalim
comments: true
post_identifier: javada-kendi-layoutmanagerimizi-yaratalim
featured_image: /assets/category/java.png
---

[layout-manager]: http://docs.oracle.com/javase/tutorial/uiswing/layout/visual.html

Selam coderlar!
Bu yazıda, Java'da sık sık kullanılan fakat pek adı geçmeyen LayoutManager interface'ine değineceğim.
LayoutManager'lar, swing'de bir Container'ın içerisindeki Component'ların
diziliminin belirli bir kurala göre ayarlanmasını sağlar.
LayoutManager interface'inden türetilmiş hali hazırda birçok class olduğu için,
insanlar bu küçük interface'in adını pek anmazlar.

<!--more--> 

Hali hazırdaki LayoutManager'lar için:
[A Visual Guide to Layout Managers][layout-manager]

Peki neden biz de küçük bir LayoutManager yazmayalım?
Bir nedenimiz yok.
Öyleyse başlayalım.

Öncelikle LayoutManager interface'inde ne var ne yok bir bakalım:

```java
/**
 * Parent Container'a başka bir Component eklenince
 * LayoutManager'a da haber verilir
 */
void addLayoutComponent(String, Component);

/**
 * Parent Container'dan bir Component silindiğinde
 * bize haber eder. remove veya removeAll methodları
 * bu methodu tetikler.
 */
void removeLayoutComponent(Component);

/**
 * Parent Container'ın getPreferredSize() methodu
 * tarafından çağırılır. Container'ın ideal
 * boyutlarını return etmesi beklenir.
 */
Dimension preferredLayoutSize(Container);

/**
 * Parent Container'ın getMinimumSize() methodu
 * tarafından çağırılır. Container'ın minimum
 * boyutlarını return etmesi beklenir.
 */
Dimension minimumLayoutSize(Container);

/**
 * Parent Container'ın tüm Component'larının
 * boyutlarını ve pozisyonlarını ayarlaması
 * beklenen method.
 */
void layoutContainer(Container);
```

Şimdi örnek olarak yazacağım LayoutManager'da, 
ben `removeLayoutComponent` ve `addLayoutComponent` methodlarını kullanmayacağım.
Benim LayoutManager'larım genellikle elemanların listesini tutmaz 
ve sonradan eklenen elemanlara göre ekstra işlem yapmaz. 
Genellikle işlemleri `layoutContainer` ve `minimumLayoutSize` methodlarında yaparım.
Şimdi bir LayoutManager yazmaya başlayalım.
Bu LayoutManager'ın ismi AltAlta ve özelliği de herşeyi alt alta dizmesi.
Alt alta dizerken de tüm elemanların genişliğini sabit ve eşit tutuyor.
Yükseklik değerlerini ise hiç değiştirmeden olduğu gibi kullanıyor.

Bu AltAlta layout'u kenarlardan beşer pixellik boşluklar bırakıyor 
ve elemanların arasında da belirli miktarda bir boşluk bırakıyor. 
Önce constructor'lara ve private alanlara bakalım.

```java
public class AltAlta implements LayoutManager {
    // Elemanlar arası boşluk
    private int gap = 5;

    // Kenar boşlukları
    private int myInsets = 5;

    public AltAlta() {}

    public AltAlta(int gap) {
        this.gap = gap;
    }
```

Şimdi AltAlta layout'unun zihnimizde canlanması için bir fotoğraf yükleyeyim:

![Alt Alta Layout Manager](/assets/posts/layout-manager-alt-alta.png)

Gördüğünüz gibi, tüm elemanlar kendi yüksekliklerine sahipler 
fakat hepsinin genişliği eşitlenmiş durumda. 
Şimdi bunu sağlayan `layoutContainer` methodunu inceleyelim.

`layoutContainer` methodunda yapmamız gereken öncelikle parent Container'ın içindeki 
tüm Component'ların genişlik değerlerine bakıp maksimumu bulmak. 
Bunu basit bir döngüyle hallediyoruz:

```java
public void layoutContainer(Container parent) {
    int nComp = parent.getComponentCount();
    Dimension d = null;
    int maxWidth = 0;
    for(int i = 0; i < nComp; i++) {
        d = parent.getComponent(i).getPreferredSize();
        if(d.width > maxWidth) {
            maxWidth = d.width;
        }
    }
```

Böylece `maxWidth` isimli bir değişkende maksimum genişliği yakalamış olduk. 
Şimdi tüm Component'ları bu genişlikte birbirinin altına yerleştirelim. 
LayoutManager yazarken dikkat etmemiz gereken bir diğer nokta da `Insets`. 
Insets çok önemlidir. 
Eğer Container bir [Border](java-swing-custom-border-yaratalim) içeriyorsa, 
bu bize bir Insets objesi olarak bildirilir. 
Elemanları yerleştirirken, onları kenara dayamadan önce, 
kenarda bir border var mı yok mu bakmamız gerekir. 
`layoutContainer` methodumuzun geri kalan kısmı da şu şekilde olacak:

```java
     Insets borders = parent.getInsets();
     int top = borders.top + myInsets;
     for(int i = 0; i < nComp; i++) {
          Component c = parent.getComponent(i);
          d = c.getPreferredSize();
          c.setBounds(borders.left + myInsets, top, maxWidth, d.height);
          top += d.height + gap;
     }
}
```

Burada yaptığımız işlem, her elemanı sayfaya eklediğimizde, 
bir sonraki elemanın yukarıya ne kadar uzaklıkta olacağını hesaplamak(`int top` değişkeni) 
ve elemanı `maxWidth` genişlikte tutmak. 
`setBounds(int x, int y, int width, int height)` methodu ile elemanımızı 
parent Container içerisinde konumlandırıyoruz.

Şimdi `minimumLayoutSize` methoduna bakalım.
Burada yapmamız gereken, parent Container'ımızın ne kadar yer kaplayacağını hesaplayıp bunu return etmek.
Yine en önemli noktalardan birisi Border'ları, yani Insets'i hesaba katmayı unutmamak.
Öncelikle yine bir `maxWidth` değişkeni tutarak elemanların genişliklerinin maksimumunu hesaplayacağız.
Aynı zamanda tüm elemanların yüksekliklerinin de toplamını hesaplayacağız.
Daha sonra `private int gap` olarak tuttuğumuz elemanlar arası boşlukları 
ve border yüksekliklerini bu yüksekliğe ekleyeceğiz. 
Hesapladığımız maksimum eleman genişliğine de border genişliklerini ekleyeceğiz. 
Ben bu yükseklik ve genişlik değerlerine bir de private olarak tuttuğum `myInsets` değişkenini ekliyorum,
benim Layout Manager'ım kenarlardan 5 pixel fazla boşluk bıraksın istediğim için.
Şimdi kodu görelim:

```java
public Dimension minimumLayoutSize(Container parent) {
   Insets borders = parent.getInsets();
   int nComp = parent.getComponentCount();
   Dimension d = null;
   int maxWidth = 0;
   int sumHeight = 0;
   for(int i = 0; i < nComp; i++) {
        d = parent.getComponent(i).getPreferredSize();
        if( d.width > maxWidth ) {
          maxWidth = d.width;
        }
        sumHeight += d.height;
   }
   int height = sumHeight + borders.top + myInsets * 2 + borders.bottom + gap * (nComp - 1);
   int width = maxWidth + borders.left + borders.right + myInsets * 2;
   return new Dimension(width, height);
}
```

Şimdi bahsetmediğimiz bir method kaldı.
`preferredLayoutSize` methodunda da Container'ımız için tercih ettiğimiz genişlik 
ve yükseklik değerini vermemiz gerekiyor.
Ben bunun `minimumLayoutSize`'dan pek farklı olacağını düşünmediğim için 
doğrudan diğer fonksiyona yönlendiriyorum. 
Yani şöyle:

```java
public Dimension preferredLayoutSize(Container parent) {
   return minimumLayoutSize(parent);
}
```

Bu konu hakkında söylemek istediklerim de bu kadar.
Yazmadığım ve havada kalan birşeyler varsa bana yorum bırakın, lütfen.
Son olarak AltAlta sınıfının tam halini ve onu kullanan,
yukarıdaki resimde gördüğünüz mini uygulamayı da paylaşayım.

AltAlta.java -> [Github Gist](https://gist.github.com/sedran/a7fc0e6b1cdb8021b64accd0550e64b4)

Pencere.java -> [Github Gist](https://gist.github.com/sedran/36f8c5eb7f97c45bff02122efc9c8b8f)

İlerleyen günlerde Java'da Swing ile ilgili daha derin konulara iniyorken bulabiliriz kendimizi.
Bu yazılık bu kadar, kalın sağlıcakla.
