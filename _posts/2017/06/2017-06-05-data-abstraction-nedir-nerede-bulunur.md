---
layout: post
title:  "Data Abstraction Nedir, Nerede Bulunur?"
date:   2017-06-05 10:59:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /data-abstraction-nedir-nerede-bulunur/
comments: true
post_identifier: data-abstraction-nedir-nerede-bulunur
featured_image: /assets/posts/fea-data-abstraction.png
---

Yazılım geliştirme prensiplerinin en önemlilerinden birisi olan **abstraction**, 
yani soyutlama, kendi içinde iki çeşide ayrılıyor. 
Bunlar **procedural abstraction** ve **data abstraction**. 
Bu yazıda kısaca **data abstraction**'ın ne olduğundan bahsetmeye çalışacağım.

Öncelikle **abstraction** ve **encapsulation** terimleri ne anlama geliyor ondan bahsetmek istiyorum 
çünkü bu terimler tanımları çok yakın olduğundan genellikle birbiri ile karıştırılıyorlar.

<!--more-->

**Abstraction:** Gereksiz karmaşıklığın (complexity) gizlenerek oluşturulan bileşenlerin sadece ilgili kısımlarının 
yazılımın diğer kısımlarına sunulması işlemidir. Bu sayede bu bileşenleri kullanan diğer bileşenler alt seviyelerdeki 
kompleks işlemlerin nasıl yapıldığı ile ilgilenmek zorunda kalmaz. Java'da çoğunlukla **interface**, **abstract class** 
gibi konseptleri kullandığımızda bir takım detayları soyutlamış oluruz.

**Encapsulation:** Bir yazılım bileşeninin iç yapısının dış dünyadan gizlenmesidir. Böylece bu bileşenin işleyişinde 
yapılabilecek herhangi bir değişikliğin bileşeni kullanan diğer yazılım bileşenlerini etkilememesi sağlanır. 
Java'da bir sınıfta **private method**, **private field** gibi dışarıya kapalı tanımlar yaptığımızda sınıfımızın 
işleyişini ve iç yapısındaki verileri encapsulate etmiş oluruz. Böylece bu sınıfın işleyişine ileride müdahale 
ettiğimizde bu sınıfı kullanan diğer sınıflara dokunmak zorunda kalmayız.

Abstraction, yazılımımızı farklı seviyelere (layers of abstraction) ayırmamızı sağlar. 
Örneğin, kullandığımız işletim sistemi diskten bir dosyanın nasıl okunması gerektiğini bilir ve bizden birçok 
donanım spesifik detayı gizleyerek sadece ilgili fonksiyonaliteyi soyut olarak bize sunar. 
Java, platform bağımsız bir dil olarak, işletim sistemleri ile iletişime nasıl geçilmesi gerektiği ile ilgili 
detayları bizden gizleyerek, dosya okuma/yazma gibi işlemleri daha da soyut olarak bize çeşitli sınıflar ile sağlar. 
Apache'nin açık kaynak kodlu [POI kütüphanesi][poi-guide], Java'nın temel dosya/okuma yazma bileşenlerini kullanarak 
excel dosya formatının nasıl okunup yazılması gerektiği ile ilgili birçok gereksiz detayı bizden saklar. Bu sayede 
bizim yazılımımız sadece excel'in satırlarına ilgili bilgileri girip dosyayı kaydet komutunu vermekten ibaret olur.

Aşağıda Apache POI kütüphanesinin dökümantasyonundan [örnek bir excel yazma kodu][poi-create-cell] göstermek istiyorum.

```java
Workbook wb = new HSSFWorkbook();
CreationHelper createHelper = wb.getCreationHelper();
Sheet sheet = wb.createSheet("new sheet");

// Create a row and put some cells in it. Rows are 0 based.
Row row = sheet.createRow((short) 0);
// Create a cell and put a value in it.
Cell cell = row.createCell(0);
cell.setCellValue(1);

// Or do it on one line.
row.createCell(1).setCellValue(1.2);
row.createCell(2).setCellValue(createHelper.createRichTextString("This is a string"));
row.createCell(3).setCellValue(true);

// Write the output to a file
FileOutputStream fileOut = new FileOutputStream("workbook.xls");
wb.write(fileOut);
fileOut.close();
```

Bu örnekten görüleceği gibi, bir excel dosyasının formatının nasıl olması gerektiği ile ilgili detayları 
kullandığımız kütüphane bizden soyutladı. Diske dosya nasıl yazılır detayını ise Java içerisinde bulunan 
sınıflar bu kütüphaneden soyutladı.

Bu sayede yazılımda kompleks işleri bir üst seviye için kolaylaştıran **farklı soyutlama seviyeleri** ortaya çıktı. 
Yazılım mimarisine eklenen her bir soyutlama seviyesi, yazılımı makine anlayacak seviyeden insan anlayacak seviyeye 
bir adım daha yaklaştırır.

Bir excel dosyası tonla bilgi taşıyan zengin bir içeriğe sahiptir. `HSSFWorkbook` sınıfı bu bilgilerin çoğunu 
ve nasıl manipüle edileceğine ait detayları bizden gizler, bu sayede bu kütüphanede ileriki zamanlarda 
yapılabilecek performans iyileştirmeleri yada refactoring gibi işlemlerde bizim kodumuzu güncellememiz gerekmez. 
Encapsulation da burada bu şekilde kullanıldı.

**Abstraction** yazılımın tasarımı aşamasında yapılan bir çalışmadır. 
**Encapsulation** ise implementasyon aşamasında yapılır.

### Peki Data Abstraction Ne?

Yukarıda verdiğim örnekler genellikle procedural abstraction'a örnekti. Yani bir işin nasıl yapılacağına dair 
detayların soyutlanması idi. Data Abstraction ise, komplex bir datanın nasıl implement edildiğine ait detayın 
bu datayı kullananlardan saklanmasıdır. Data ne kadar abstract ise, o kadar günlük hayatta kullandığımız datalara 
yakın, makine dili olan 1 ve 0'lara uzaktır.

Ben bu konuya **Structure and Interpretation of Computer Programs** isimli kitapta verilen karmaşık sayılar örneği 
ile devam etmek istiyorum çünkü ben de bu kitap sayesinde bu konsept ile tanıştım.

Matematik derslerinden hatırlarsınız karmaşık sayılar diye bir konu vardır, hiç sevememiştim. 
Bir karmaşık sayı kutupsal ve düzlemsel(bu kelime doğru mu emin değilim) olarak iki farklı şekilde gösterilebilir.

![Polar form of complex number](/assets/posts/polar-form-of-cn.gif)

Örneğin yukarıdaki resimdeki z karmaşık sayısı aşağıdaki iki farklı biçimde gösterilebilir 
ve ikisi de sayısal olarak aynıdır:

`z = r ∠ θ`

`z = a + bi`

Buradan anlaşılıyor ki `ComplexNumber` diye bir sınıf geliştirmek istesek, 
bu sınıf içerisinde veriyi iki farklı şekilde tutabiliriz. Birinci yöntem bir açı ve bir büyüklük içeren yani iki adet 
`double` alandan oluşan bir sınıf tasarlamak. İkinci yöntem ise karmaşık sayının reel eksendeki izdüşümünü 
ve sanal eksendeki izdüşümünü tutan yine iki adet `double` alandan oluşan bir sınıf tasarlamak.

Şimdi tek tek iki yöntemin de nasıl tasarlanabileceğine bakalım. 
Öncelikle `ComplexNumber` isimli bir _interface_ tanımlayıp, karmaşık sayılar üzerinde yapılabilecek işlemleri 
tanımlıyoruz. Böylece karmaşık sayıyı kullanacak olan başka yazılım bileşenlerine ihtiyaçları olan methodları 
baştan belirlemiş oluyoruz.

```java
public interface ComplexNumber {
    ComplexNumber sum(ComplexNumber other);
    
    ComplexNumber subtract(ComplexNumber other);

    ComplexNumber multiply(ComplexNumber other);
    
    ComplexNumber divide(ComplexNumber other);
    
    double getRealPart();
    
    double getImaginaryPart();
    
    double getAngle();
    
    double getMagnitude();
}
```

Daha sonra bu interface'den türeyen _abstract_ bir sınıf tanımlayıp, `sum`, `subtract`, `multiply` ve `divide` 
methodlarını buraya yazıyorum çünkü bu methodlar datanın içeride nasıl tutulduğundan bağımsız methodlar. 
Yani karmaşık sayılar üzerinde yapılan dört işlemde bile karmaşık sayı datasının içeride nasıl tutulduğu 
ile ilgilenmemiş olduk.

```java
public abstract class BaseComplexNumber implements ComplexNumber {
    private final static double EPSILON = 0.00001;

    @Override
    public ComplexNumber sum(ComplexNumber other) {
        double realPart = getRealPart() + other.getRealPart();
        double imaginaryPart = getImaginaryPart() + other.getImaginaryPart();
        return ComplexNumbers.fromRectangularForm(realPart, imaginaryPart);
    }

    @Override
    public ComplexNumber subtract(ComplexNumber other) {
        double realPart = getRealPart() - other.getRealPart();
        double imaginaryPart = getImaginaryPart() - other.getImaginaryPart();
        return ComplexNumbers.fromRectangularForm(realPart, imaginaryPart);
    }

    @Override
    public ComplexNumber divide(ComplexNumber other) {
        double magnitude = getMagnitude() / other.getMagnitude();
        double angle = getAngle() - other.getAngle();
        return ComplexNumbers.fromPolarForm(magnitude, angle);
    }

    @Override
    public ComplexNumber multiply(ComplexNumber other) {
        double magnitude = getMagnitude() * other.getMagnitude();
        double angle = getAngle() + other.getAngle();
        return ComplexNumbers.fromPolarForm(magnitude, angle);
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null || !(obj instanceof ComplexNumber)) {
            return false;
        }

        ComplexNumber other = (ComplexNumber) obj;
        return isZero(getRealPart() - other.getRealPart()) && isZero(getImaginaryPart() - other.getImaginaryPart());
    }

    private boolean isZero(double x) {
        return x + EPSILON > 0 && x - EPSILON < 0;
    }
}
```

Kendisine ait `realPart`, `imaginaryPart`, `angle` ve `magnitude` değerlerini dönme 
veya gerekirse hesaplama işlerini ise datayı asıl tutan sınıfın omuzlarına yükledik, 
çünkü bu işlemler içerideki verinin nasıl saklandığına bağlı değişiklik gösteriyorlar.

Kutupsal gösterimdeki (polar form) şekliyle veriyi tuttuğumuz bir sınıf geliştirecek olursak, 
aşağıdaki gibi bir implementasyon yapabiliriz:

```java
public class PolarComplexNumber extends BaseComplexNumber implements ComplexNumber {
    private final double magnitude;
    private final double angle;

    public PolarComplexNumber(double magnitude, double angle) {
        this.magnitude = magnitude;
        this.angle = angle;
    }

    @Override
    public double getRealPart() {
        return magnitude * Math.cos(angle);
    }

    @Override
    public double getImaginaryPart() {
        return magnitude * Math.sin(angle);
    }

    @Override
    public double getAngle() {
        return angle;
    }

    @Override
    public double getMagnitude() {
        return magnitude;
    }

    @Override
    public String toString() {
        double degrees = Math.toDegrees(angle);
        return  String.format("%.2f x (cos(%.0fu00b0) + i x sin(%.0fu00b0))", magnitude, degrees, degrees);
    }
}
```

Bu sınıf görüldüğü gibi açı ve büyüklük değerlerini tutup, 
realPart ve imaginaryPart değerlerini hesaplayarak hizmet veriyor.

Düzlemsel gösterimdeki (rectangular form) halde veriyi tutmak istersek eğer, 
aşağıdaki gibi bir sınıf geliştirebiliriz:

```java
public class RectangularComplexNumber extends BaseComplexNumber implements ComplexNumber {
    private final double realPart;
    private final double imaginaryPart;

    public RectangularComplexNumber(double realPart, double imaginaryPart) {
        this.realPart = realPart;
        this.imaginaryPart = imaginaryPart;
    }

    @Override
    public double getRealPart() {
        return realPart;
    }

    @Override
    public double getImaginaryPart() {
        return imaginaryPart;
    }

    @Override
    public double getAngle() {
        return Math.atan2(imaginaryPart, realPart);
    }

    @Override
    public double getMagnitude() {
        return Math.sqrt(realPart * realPart + imaginaryPart * imaginaryPart);
    }

    @Override
    public String toString() {
        return String.format("%.2f + i x %.2f", realPart, imaginaryPart);
    }
}
```

Görüldüğü üzere bu sınıf da realPart ve imaginaryPart değerlerini tutup, 
angle ve magnitude değerlerini hesaplayarak hizmet veriyor.

`BaseComplexNumber` sınıfında factory method olarak kullandığımız `ComplexNumbers.fromPolarForm` 
ve `ComplexNumbers.fromRectangularForm` methodları bu iki gösterimden herhangi birisini seçip 
onu dönecek şekilde geliştirilebilir. `ComplexNumbers` aracılığı ile başka yazılım bileşenlerinin 
elde edebileceği tek nesne tipi `ComplexNumber` olacaktır. 
Yani datanın nasıl represent edildiğini datayı kullananlardan soyutlamış olduk.

Ben hazır yazmışken iki sınıfı da kullanayım dedim ve ortaya şöyle bir sınıf çıktı:

```java
public class ComplexNumbers {
    public static ComplexNumber fromRectangularForm(double realPart, double imaginaryPart) {
        return new RectangularComplexNumber(realPart, imaginaryPart);
    }

    public static ComplexNumber fromPolarForm(double magnitude, double angle) {
        return new PolarComplexNumber(magnitude, angle);
    }
}
```

Buradan çıkarmamız gereken sonuç tabi ki de bir sistemde aynı veriyi birçok farklı şekilde tasarlamak gerektiği değil. 
Bir yazılımda kompleks bir veri tipi (karmaşık sayı gibi) yaratıyorsanız, 
bu veri tipini kullanan yazılımın diğer bileşenleri için önemli olan iki soruyu cevaplamanız gerekmektedir.

Bunlardan birincisi, bu veriyi nasıl yaratacakları. 
Bu örneklerde, `ComplexNumbers` sınıfı içerisindeki iki factory method ile verinin kolayca yaratılmasını sağladık.

İkinci önemli soru da bu veri üzerindeki gerekli bilgilere nasıl erişecekleri. 
Açtığımız `ComplexNumber` arayüzü ile karmaşık sayı ile ilgili bilgilere 
nasıl erişeceklerini de diğer yazılım bileşenlerine anlatmış olduk.

Bundan gerisi bizim içeride veriyi nasıl 
ve ne formatta sakladığımız ve bu da bizden başkasını ilgilendirmez. 
Biz istersek içeride byte dizisi olarak tutalım, 
istersek String olarak tutalım, ya da çok daha kötü bir yapı kuralım. 
Dış dünyaya aynı interface'i çalışır durumda verebiliyorsak 
verimizin iç dünyasını istediğimiz biçimde şekillendirebiliriz.

### Finito

Bu yazıda birçok soyut kavrama değindiğim için tonla hata yapmış olabilirim. 
Böyle durumlarda yorumlarınız ile beni düzeltmekten geri kalmayın.

Yazıda bir ara ismini zikrettiğim muhteşem kitabın görselini de ekleyeyim. 
Çok uzun uğraşlar sonucu keşfettiğim bir kitap değil zaten, şu tarz listelerden buluyorum böyle kitapları: 
[What is the single most influential book every programmer should read?][books-to-read]{:target="_blank"}

![Structure and Interpretation of Computer Programs](/assets/posts/saiocp_cover.jpg){:width="221px"}

[poi-guide]: https://poi.apache.org/spreadsheet/quick-guide.html
[poi-create-cell]: https://poi.apache.org/spreadsheet/quick-guide.html#CreateCells
[books-to-read]: https://stackoverflow.com/questions/1711/what-is-the-single-most-influential-book-every-programmer-should-read/1713
