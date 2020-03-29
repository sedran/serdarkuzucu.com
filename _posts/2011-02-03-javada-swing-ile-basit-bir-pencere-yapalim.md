---
layout: post
title:  "Java'da Swing ile Basit Bir Pencere Yapalım"
date:   2011-02-03 03:18:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /javada-swing-ile-basit-bir-pencere-yapalim/
comments: true
post_identifier: javada-swing-ile-basit-bir-pencere-yapalim
featured_image: /assets/posts/Introduction_to_Swing_070807.png
---

O kadar java gördük belki birilerine bi faydamız dokunur. 
Haydi java'da [swing kütüphanesinin][swing] 
ögelerini kullanarak basit bi pencere yapalım.

<!--more-->

Bu yazıda, [JFrame][jframe] sınıfından birkaç method kullanmayı, `JFrame` ile oluşturulan pencereye 
[JLabel][jlabel] ve [JButton][jbutton] eklemeyi, `JLabel` ögesinin font özelliklerini ayarlamayı ve `JButton` ögesine 
[ActionListener][actionlistener] objesini eklemeyi göreceğiz. 
Layout olarak da [BorderLayout][borderlayout] objesinden biraz bahsedeceğim.

Çoğu swing objesini java apisinden öğrenmiş birisi olarak ilk tavsiyem yukarda verdiğim linklere de tıklayıp 
bi ne var ne yok bakmanız.

Önce kodlarımızı yazalım. Sonra konuşuruz üstünde.

```java
package com.asosyalbebe.swing;

import java.awt.BorderLayout;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;

public class Pencere {
    public static void main(String[] args) {
        Pencere pencere = new Pencere();
    }

    public Pencere() {
        JFrame pencere = new JFrame("Basit Bir Pencere Yapıyoruz");
        pencere.setSize(300, 100);
        pencere.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        pencere.getContentPane().setLayout(new BorderLayout());

        JLabel metin = new JLabel("İlk penceremizi yaptık.");
        metin.setFont(new Font("Serif", Font.BOLD, 25));
        pencere.add("North", metin);

        JButton buton = new JButton("Çıkış");
        buton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                System.exit(1);
            }
        });
        pencere.add("South", buton);

        pencere.setVisible(true);
    }
}
```

İlk olarak import kısmından bahsedeyim. Bu kısımda sadece şu üç satırı yazarak da kurtulabilirdiniz:

```java
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
```

Fakat hem neyin hangi paketin içinde olduğunu görmek açısından, 
hem de programın gereksiz import yapıp yavaşlamaması açısından bu şekilde daha faydalıymış, 
burada böyle yaptım. Yoksa ben de yıldızlı yöntemi kullanıyorum :)

Ana methoda(public static void main) bakacak olursak, içerisinde Pencere objesini çağırdığımızı görüyoruz. 
Diğer elemanları neden main'in içinde değil de constructor'un içinde yarattığımın şu anda pek bir önemi yok, 
fakat ileri düzeyde programlar yazmaya çalışırken böyle olması daha müsait oluyor diyelim, 
`main` methodun `static` olması nedeniyle çeşitli yerlerde istenmedik problemler çıkıyor :)

Gelelim Pencere isimli sınıfımızın constructor'ına. 
Burada ilk olarak bir pencere yaratmamız gerekiyor. 
Bunu `JFrame` nesnesi ile sağlıyoruz. 
`JFrame` nesnesini tanımlarken ona penceremizin başlık çubuğunda görüntülenecek olan 
`String`'i parametre olarak gönderiyoruz. 
Bu uygulamada başlık çubuğumuzda "Basit Bir Pencere Yapıyoruz" metni görünecek.

Daha sonra `JFrame` nesnemize verdiğimiz ismi kullanarak onun özelliklerini tanımlıyoruz. 
Ben pencere ismini vermiştim. 
Öyle devam edelim.

Penceremizin boyutunu ayarlamak için `JFrame`'in bize sunduğu [setSize][setsize] methodunu kullanıyoruz. 
Parametre olarak iki tane tamsayıyı sırasıyla genişlik ve yükseklik olarak giriyoruz.

```java
pencere.setSize(int width, int height);
```

Penceremizin sağ üst köşesindeki çarpı tuşuna tıklandığında gerçekleşecek olan eylemi ayarlamak için `JFrame`'in 
[setDefaultCloseOperation][setDefaultCloseOperation] methodunu kullanıyoruz. 
Bu methoda parametre olarak `JFrame.EXIT_ON_CLOSE` sabit değerini atadık. 
Bu sayede çarpı butonuna tıklandığında program kapatılacak. 
Bunu ayarlamayı unutursanız eğer, pencereniz kapatmaya çalıştığınızda kapanmak yerine gizlenir, 
arkaplanda çalışmaya devam eder.

```java
pencere.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
```

Şimdi geldik penceremize layout ayarlamaya. 
Bunun için `JFrame`'in [getContentPane()][jframe.getContentPane] methodunu 
kullanarak bize bir `Container` nesnesi return etmesini sağlayacak, daha sonra da o 
[Container][container] nesnesinin [setLayout][jframe.setLayout] methodunu kullanıp ona bir layout atayacağız. 
Ben burada [BorderLayout][borderlayout] kullandım. 
`BorderLayout` nedir diye merak edenler [şuradan][borderlayout.tutorial] detaylı anlatımına bakabilir. 
Ben kısaca bahsedecek olursam, efenim şimdi, `BorderLayout` ekranı 5 parçaya böler. 
Bu parçalara "North", "South", "Center", "East", ve "West" isimlerini verir. 
BorderLayout ile şekillendirilmiş bir alana bir element ekleyeceğimiz zaman hangi alanına ekleyeceğimizi 
parametre olarak belirtmemiz gerekir. 
Şimdi penceremizi BorderLayout ile şekillendirelim bakalım.

```java
pencere.getContentPane().setLayout(new BorderLayout());
```

Şimdi oluşturduğumuz penceremize bir yazı yazalım. 
Bunun için bir [JLabel][jlabel] nesnesi yaratacağız 
ve yaratırken kullandığımız parametre onun içeriğindeki metin olacak.

```java
JLabel metin = new JLabel("İlk penceremizi yaptık.");
```

Yarattığımız `JLabel` nesnesini metin isimli değişkene verdiğimize göre, şimdi onun üzerinde bir iki oynama yapabiliriz. 
Şimdi yazı tipiyle biraz oynamak istiyorum ben. 
Bunun için [Font][font] nesnesini ve `JLabel` nesnesinin [setFont][setFont] methodunu kullanacağız.

```java
metin.setFont(new Font("Serif", Font.BOLD, 25));
```

`JLabel` nesnemiz üzerindeki düzenlemelerimiz bittiğine göre, şimdi onu penceremize ekleyebiliriz. 
Bunun için `JFrame` içindeki [add][container.add] methodunu kullanacağız. 
Ben bu `JLabel` ögesini pencerenin üst kısmına eklemeyi uygun gördüm, siz değiştirebilirsiniz tabi ki :)

```java
pencere.add("North", metin);
```

Şimdi bir buton oluşturalım ve üzerinde çıkış yazsın. 
Tıklanıldığı zaman da program kapansın. 
Gelişmiş butonlar oluşturabilmemiz için swing kütüphanemiz bize [JButton][jbutton] nesnesini sunar. 
Bir `JButton` nesnesi yaratırken kullandığımız parametre onun üzerindeki metni belirler. 
Şimdi üzerinde çıkış yazan bir `JButton` nesnesi yaratıp onu buton isimli değişkenimize verelim.

```java
JButton buton = new JButton("Çıkış");
```

Şimdi bu butonumuza [addActionListener][addActionListener] methodunu ve [ActionListener][actionlistener] 
sınıfını kullanarak bir dinleyici ekleyelim. 
`ActionListener` methodundaki [actionPerformed][actionPerformed] methodu, bir action gerçekleştiği zaman bir 
[ActionEvent][actionevent] parametresi ile çağırılır. 
Biz de `actionPerformed` methodunun içerisine butona tıklandığında gerçekleşecek olan eylemleri kodlayacağız. 
Ben burada `System.exit(1);` komutu ile programı kapatmayı tercih ettim, basit bir şey olsun diye.

```java
buton.addActionListener(new ActionListener() {
  public void actionPerformed(ActionEvent e) {
    System.exit(1);
  }
});
```

Butonumuzu da ayarladığımıza göre, onu da penceremize ekleyebiliriz. 
Yine aynı işlem, fakat bunu pencerenin aşağı kısmına ekliyoruz.

```java
pencere.add("South", buton);
```

Ve en son olarak da penceremizin görünür olması için `JFrame` nesnesinin 
[setVisible][setVisible] methodunu kullanacağız. 
Bunu penceremize bütün eklemeleri yaptıktan sonra çalıştırmamızda fayda varmış. 
Hiç çalıştırmazsak da penceremiz görünmüyor.

```java
pencere.setVisible(true);
```

Penceremizin son halini de koyalım buraya tam olsun:

![java swing window frame](/assets/posts/java-swng-300x100.png)

Bu yazının sonuna geldik. 
Umarım faydalı bir iş çıkarmışımdır swing'e yeni başlayanlar için. 
Başka bir yazıda görüşmek üzere, yorumlarınızı beklerim :)

[swing]: https://docs.oracle.com/javase/7/docs/api/javax/swing/package-summary.html
[jframe]: https://docs.oracle.com/javase/7/docs/api/javax/swing/JFrame.html
[jlabel]: https://docs.oracle.com/javase/7/docs/api/javax/swing/JLabel.html
[jbutton]: https://docs.oracle.com/javase/7/docs/api/javax/swing/JButton.html
[actionlistener]: https://docs.oracle.com/javase/7/docs/api/java/awt/event/ActionListener.html
[borderlayout]: https://docs.oracle.com/javase/7/docs/api/java/awt/BorderLayout.html
[borderlayout.tutorial]: https://docs.oracle.com/javase/tutorial/uiswing/layout/border.html
[setsize]: https://docs.oracle.com/javase/7/docs/api/java/awt/Component.html#setSize(int,%20int)
[setDefaultCloseOperation]: https://docs.oracle.com/javase/7/docs/api/javax/swing/JFrame.html#setDefaultCloseOperation(int)
[setVisible]: https://docs.oracle.com/javase/7/docs/api/java/awt/Component.html#setVisible(boolean)
[addActionListener]: https://docs.oracle.com/javase/7/docs/api/javax/swing/AbstractButton.html#addActionListener(java.awt.event.ActionListener)
[actionlistener]: https://docs.oracle.com/javase/7/docs/api/java/awt/event/ActionListener.html
[actionPerformed]: https://docs.oracle.com/javase/7/docs/api/java/awt/event/ActionListener.html#actionPerformed(java.awt.event.ActionEvent)
[actionevent]: https://docs.oracle.com/javase/7/docs/api/java/awt/event/ActionEvent.html
[container.add]: https://docs.oracle.com/javase/7/docs/api/java/awt/Container.html#add(java.awt.Component)
[font]: https://docs.oracle.com/javase/7/docs/api/java/awt/Font.html
[setFont]: https://docs.oracle.com/javase/7/docs/api/javax/swing/JComponent.html#setFont(java.awt.Font)
[jframe.setLayout]: https://docs.oracle.com/javase/7/docs/api/javax/swing/JFrame.html#setLayout(java.awt.LayoutManager)
[jframe.getContentPane]: https://docs.oracle.com/javase/7/docs/api/javax/swing/JFrame.html#getContentPane()
[container]: https://docs.oracle.com/javase/7/docs/api/java/awt/Container.html
