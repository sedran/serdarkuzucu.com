---
layout: post
title:  "Java'da Kendi Border'ımızı Yaratalım"
date:   2012-01-30 06:45:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /javada-kendi-borderimizi-yaratalim/
comments: true
post_identifier: javada-kendi-borderimizi-yaratalim
featured_image: /assets/category/java.png
---

[set-border]: https://docs.oracle.com/javase/7/docs/api/javax/swing/JComponent.html#setBorder(javax.swing.border.Border)
[border-factory]: http://docs.oracle.com/javase/tutorial/uiswing/components/border.html

Merhaba değerli arkadaşlar.
Bu yazımda Java'da swing ile programlarımıza arayüz kazandırırken başvurmak isteyebileceğimiz 
Border interface'ini biraz didikleyeceğim. 
Javadoc'da da görebileceğiniz gibi, 
JComponent class'ında 
[setBorder(Border border)][set-border] imzalı bir method var. 
Swing'deki birçok öge (JPanel, JLabel, JTextField, JTextArea, J...) de JComponent'dan türetildiğine göre, 
genel olarak tüm Swing ögelerine bir Border(kenarlık) ekleyebiliyoruz.

<!--more-->

Oracle'ın kendi sitesinde de bulabileceğiniz,
birçok Border çeşidi mevcut internette ve Swing içerisinde hazır halde. 
[javax.swing.BorderFactory][border-factory] class'ı bu işi çok iyi şekilde yapıyor, sağolsun. 
Lakin peki ya biz kendi kenarlığımızı kendimiz çizmek istiyorsak? 
İşte o zaman Border interface'ini kullanarak, tüm Border fonksiyonlarını elle yazmamız gerekiyor. 
O halde ne duruyoruz? 
Haydi başlayalım.

Öncelikle Border interface'ine kısaca bir bakalım.

```java
/**
 * Border'ın içerisindeki elemanların 
 * kenar boşluklarını verir.
 */
Insets getBorderInsets(Component c);

/**
 * Border'ın görünür olup olmadığını söyler.
 */
boolean isBorderOpaque();

/**
 * Border'ı çizmekten sorumlu. Biz bütün
 * işi bu methotta yapacağız.
 */
void paintBorder(Component c, Graphics g, 
      int x, int y, 
      int width, int height);
```

Yazacağımız Border class'ında üstteki 3 method mutlaka olmak zorunda. 
İçlerine ne yazarsak yazalım, bu isimleri tanımlayacağız. 
Şimdi yavaş yavaş yazmaya başlayalım. 
Yazmadan önce kısa bir plan yapmayı da unutmayalım. 
Benim planım şu:

1. Yaratacağımız Border köşeleri yuvarlanmış olsun. 
Lakin isteyen kişi tek bir işlem ile kare köşeli Border'a geçiş yapabilsin.
2. Benim Border'ımın üzerinde bir yazı olsun, o Border'ın içerisindeki nesnelerin 
genel özelliklerini anlatan bir başlık olabilir.
3. Border'ımızın yazısı, yazı tipi, yazı rengi 
ve çizgi rengi de kullanıcı tarafından istenildiği zaman değiştirilebilmeli.

Bütün bu sıraladığım özellikleri bir araya getirince aşağıdaki resimdeki görüntü ortaya çıkıyor.
Yani benim kafamdaki resim bu.

![Custom Border](/assets/posts/swing-self-border.png)

Üzerinde 'Asosyal' yazan kenarları henüz yuvarlanmamış ama her an yuvarlanabilir gri renkli bir Border. 
İçindeki butonlara takılmayın şimdilik, onlarla işimiz yok bugün.

Kodlarken, önce Border'a kendim kazandırdığım özelliklerin değişken 
ve fonksiyonlarını kodlayacağım, daha sonra Border interface'inin beni yazmaya zorladığı fonksiyonları yazacağım. 
Hadi başlayalım.

Öncelikle Border'ımıza bir isim vermeliyiz. 
Ben bu Border'a `TextBorder` ismini veriyorum ve class'ımı açıyorum. 
Daha sonra Border'ın o an geçerli olan özelliklerini tutacak olan 6 tane private değişkenimi tanımlıyor, 
ve constructor'ımı yazıyorum. 
Görelim:

```java
public class TextBorder implements Border {
   // Border'ın üzerindeki başlık
   private String title = "";

   // Border başlığının font'u
   private Font f = new Font("Tahoma", Font.PLAIN, 11);

   // Border içindeki elemanların kenarlara olan uzaklıkları
   private Insets insets = new Insets(23, 9, 9, 9);

   // Border'ın çizgi rengi
   private Color line_color = new Color(148,145,140);

   // Border'ın metin rengi
   private Color text_color = new Color(20,20,20);

   // Border kenarları yuvarlak mı değil mi
   private boolean rounded = false;

   // Border'ı başlığı ile yaratıyoruz
   public TextBorder(String title) {
      this.title = title;
   }
}
```

Kabaca Border'ımızı oluşturduk sayabiliriz kendimizi, 
her ne kadar en zor kısmı olan çizim kısmını yapmamış olsak da. 
En zor dediğime bakmayın zor değil aslında, panik yok.

Şimdi bu yarattığımız 6 private değişkeni düzenleyen ve return eden methodları yazalım:

```java
   // Border metnini değiştir
   public void setText(String text) {
      this.title = text;
   }

   // Border çizgi rengini değiştir
   public void setBorderColor(Color c) {
      line_color = c;
   }

   // Border metin rengini değiştir
   public void setTextColor(Color c) {
      text_color = c;
   }

   // Border köşelerini yuvarlak veya köşeli yap
   public void setRounded(boolean round) {
      rounded = round;
   }

   // Border metninin font'unu değiştir
   public void setFont(Font f) {
      this.f = f;
   }

   // Border font'unu ver.
   public Font getFont() {
      return this.f;
   }

   // Border metnini ver.
   public String getText() {
      return title;
   }
```

Bunlar da tamam.
Artık Border interface'inin methodlarını yazmaya geçebiliriz.
2 tane dandik method var, önce onları yazayım:

```java
// Border uyguladığımız elemanın
// çocuklarının kenarlara olan uzaklığı
public Insets getBorderInsets(Component c) {
   return new Insets(insets.top, insets.left, insets.bottom, insets.right);
}

// Border Opak mı değil mi?
public boolean isBorderOpaque() {
   return true;
}
```

İlk method Border içerisinde kalacak olan elemanların kendilerini yerleştirmek için kullandıkları bir method.
O yüzden Insets çok iyi ayarlanması gereken bir özellik Border tasarlarken.
Ben, private olarak yarattığım insets objesinin bir kopyasını yaratıp return ettim.
O da, üstten 23, sağdan, soldan ve alttan 9 pixel boşluk tanımlayan bir Insets objesi.
Üstteki resime bakacak olursanız, kenarlığın içerisindeki butonların pencereden 
ne kadar içerde dizildiğini görürsünüz. (Pencereden ama, Border çizgisinden değil)

İkinci methodun ne olduğunu ben çözemedim hâla. 
Bir JComponent veya Border yaratırken opaklık söz konusu olduğunda ben hep basitçe true değerini veririm.

Şimdi gelelim zurnanın zırt dediği yere. 
`paintBorder` methodu ile Border'ımızı Component'a çizeceğiz.
Burada hazır çizilmişi var:

```java
public void paintBorder(Component c, Graphics g, int x, int y, int width, int height) {
   // Köşe eğimi yarıçapı
   int roundWidth = rounded ? 15 : 0;

   // Çizgi rengini ayarlayıp, çizgiyi çizelim.
   g.setColor(line_color);
   g.drawRoundRect(x+3, y+10, width-6, height-13, roundWidth, roundWidth);

   // Az önce çizdiğimiz çizginin içine bir de beyaz çizgi çekelim
   g.setColor(Color.WHITE);
   g.drawRoundRect(x+4, y+11, width-8, height-15, roundWidth, roundWidth);

   // Şimdi fontu ayarlayalım
   g.setFont(f);

   // Burada yazıyı yazacağımız koordinatları hesaplıyoruz.
   FontMetrics fm = g.getFontMetrics(f);
   Rectangle2D textsize = fm.getStringBounds(title, g);

   // Yazmadan önce, alttaki Border çizgisinin bir kısmını siliyoruz.
   // Silmek demek, boyamak demek. Border'a parametre olarak gelen elemanın
   // arkaplan rengi ile yazacağımız alanı boyuyoruz
   g.setColor(c.getBackground());
   g.fillRect(x+12, y+9, (int)textsize.getWidth()+6, 4);

   // Şimdi oraya yazımızı yazıyoruz. Bu kadar!
   g.setColor(text_color);
   g.drawString(title, x+15, y+fm.getAscent()+3);
}
```

Satır satır inceleyelim.
İlk önce roundWidth diye bir değişken hesapladık.
Hatırlayın, rounded diye bir boolean tutmuştuk private olarak.
Border'ın köşeli mi, yuvarlak mı olduğunu tutuyordu.
Burada da, eğer Border yuvarlak köşeli ise 15 pixellik bir yuvarlama yarıçapı seçtik.
Eğer köşeler yuvarlak olmayacaksa, bunu 0 pixel olarak ayarladık.

Daha sonra, yine yukarıdaki private değişkenlerimizden olan line_color ile çizim rengimizi değiştirip,
ilk çizgimizi çektik.
Bu çizgiyi çizerken, paintBorder methoduna gelen parametrelerden faydalandık.
x değeri, Border'ı çizeceğimiz elemanın sol kenarını ifade etmekte.
Ben soldan 3 pixel uzaklığa çizmek istedim kenarlığımı, x+3 kullandım.
y değişkeni de Border'ın çizildiği elemanın üst kenarının koordinatıdır.
Yazı yüksekliğini de hesaba katmak zorunda olduğumuz için çizgimizi üstten 10 pixel aşağı çizdik,
y+10 kullandık.
Gelelim width ve height değişkenlerine.
Bunlar sırasıyla Border'ı çizeceğimiz elemanın genişlik ve yükseklik değerleri.
Ben sol ve sağ kenardan 3 pixel boşluk bıraktığım için Border'a toplamda (width-6) pixellik bir genişlik kalıyor.
Üstten 10 pixel boşluk bırakacaktık, alttan da 3 pixel boşluk bırakırsak,
Border'ımıza (height-13) pixellik bir yükseklik kalıyor.
Bunları da girdikten sonra köşe yarıçapımızı iki kere yazıp çizgimizi tamamlıyoruz. 
İki kere yazıyoruz çünkü drawRoundRect methodu bize elips şeklinde köşeler çizme fırsatı da veriyor.
Yani farklı yarıçaplar girdiğimizde eliptik bir yüzey elde ediyoruz.

Daha sonra rengimizi beyaz yaptık ve bir çizgi daha çizdik.
Bu çizgiyi önceden çizdiğimiz çizgiden bir pixel içeri aldık ki hoş bir görüntü sağlaya.

Yazıyı yazmaya başlamadan önce, private olarak tanımladığımız Font'umuzu Graphics objemize setFont() ile gösteriyoruz.

FontMetrics ve Rectangle2D objelerini kullanarak yazacağımız yazının ekranda ne kadar yer kaplayacağını
ve hangi koordinatlara yerleştirebileceğimizi hesaplamak için bir takım ölçümler yaptık.

Şimdi bir püf nokta geliyor.
Yazımızı yazacağız, lakin çizdiğimiz çizginin üzerine yazdığımız için hiç güzel görünmeyecek.
Acaba çizginin yazıyı yazacağımız kısmı kesik olamaz mı?
Boyarız, olur.
Boyamak için en önemli kısım boya rengi seçmek.
Çok şükür bu kısım bizi fazla uğraştırmayacak.
paintBorder methodumuza gelen ilk parametreye bakacak olursanız, Border çizdiğimiz eleman olduğunu görürsünüz.
Bir Component'ın en temel özelliklerinden birisi getBackground() methodudur ve bize o elemanın arkaplan rengini verir.
O elemanın arkaplan rengini alıp Graphics objemize uyguladıktan sonra,
yazımızı yazacağımız alandan biraz daha geniş bir alanı boyarsak, yazımız için gereken temiz alanı yaratmış oluruz.
Ve öyle de yaptık.
Yazımızı soldan 15 pixel içeriye yazacağımız için, boyama işlemine de soldan 12 pixel içeride başladık.
Ve benzer şekilde diğer ölçüleri de hesapladık.
Amaç, yazıdan daha geniş bir alanı kapsaması ve yazıya değebilecek herhangi bir şekli ekrandan silmesiydi.

En son olarak da yazımızın rengini private değişkenden alıp Graphics objesine veriyor, ve yazımızı yazdırıyoruz.
Border'ımız tamamen çizilmiş oluyor.

Yukarıda yazdığım kodları 
ve bu kodları kullanan örnek bir swing pencere uygulamasını bir arada bulabileceğiniz link:
[Github Gist](https://gist.github.com/sedran/2683d9045af6118f322044e516a9ce53)

Yazıyı yazdıktan sonra bir daha okuma fırsatım olmadı. 
Hatalıysam yorumlarınızda belirtin, lütfen. 
Kucak dolusu kodlar!
