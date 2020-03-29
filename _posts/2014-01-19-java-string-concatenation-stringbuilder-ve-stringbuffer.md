---
layout: post
title:  "Java String Concatenation, StringBuilder ve StringBuffer"
date:   2014-01-19 03:55:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /java-string-concatenation-stringbuilder-ve-stringbuffer/
comments: true
post_identifier: java-string-concatenation-stringbuilder-ve-stringbuffer
featured_image: /assets/category/java.png
---

[javadoc-string]: http://docs.oracle.com/javase/7/docs/api/java/lang/String.html
[javadoc-StringBuilder]: http://docs.oracle.com/javase/7/docs/api/java/lang/StringBuilder.html
[javadoc-StringBuffer]: http://docs.oracle.com/javase/7/docs/api/java/lang/StringBuffer.html
[source-code]: https://app.box.com/s/xxw3aaw3v12szpamuww3
[input-file]: https://app.box.com/s/5v2qzmh0e6ezka7b7f1w

Gece gece canım sıkıldı, yine yerimde duramadım, 
bir benchmark yapıp yazılım camiasında sık sık dile getirilen bir noktaya bir de ben parmak basayım dedim. 
Biliyorsunuz ki Java ile birşeyler geliştirirken sık sık `String`'leri uç uca eklememiz gerekiyor. 
En basit okul ödevinden en komplike web projelerine kadar bu işlemi 
hiç düşünmeden concatenation yöntemi ile yapanlarımız var. 
Hiç düşünür müydünüz bunun bir performans sorunu olarak değerlendirilebileceğini 
ve alternatif yaklaşımlarının bulunduğunu?

<!--more-->

Öncelikle bu işin kökenine inelim. 
Ben ilk olarak Java'da tecrübeli abilerimizden tokat yememek için biraz araştırma yaptım. 
Yine de yanlışlarım olabilir. 
Sonuçta yaşım kaç başım kaç? :)

Java'da karakter dizilerini bizim için anlamlı hale getiren üç temel sınıf var.
Bunlar [String][javadoc-string], [StringBuilder][javadoc-StringBuilder] ve [StringBuffer][javadoc-StringBuffer]. 
Bu üçü hemen hemen benzer işlerde kullanılıyorlar 
fakat ihtiyacınıza göre hangisini kullanmanız gerektiğine karar vermek iyi bir yazılımcı olarak size kalıyor.
Şimdi birazcık farklarına değinelim bunların.

#### String

Java'da yarattığımız her string varsayılan olarak bu türde yaratılır.
Yani iki tırnak içine karakterleri yazıp bunu bir değişkene atayacak olursanız,
bu değişkenin türü `String`'dir.
`String` literatürde immutable, yani değişmez olarak geçer.
Dökümantasyonunda da farkettiyseniz, 
`String`'in değişmesi için çağırabileceğimiz bütün fonksiyonlar yeni bir `String` objesi döner.
Yani orjinal `String` objesine birşeycik olmaz.
Yani aşağıdaki kod parçacığını çalıştırdığınızda elinizde birbirinden farklı 3 adet `String` objesi olur.

```java
String s1 = "aBcD1";
String s2 = s1 + "a."; // s1 değişmeden kaldı
String s3 = s1.toLowerCase(); // s1 yine değişmedi.
```

#### StringBuilder

`StringBuilder` sınıfı `String` objelerinin birleştirme işlemindeki gereksiz bellek 
ve işlemci kullanımını azaltmak için yaratıldı. 
Yazının son kısmında göstereceğim benchmark ile de gösteriyor ki 
döngü içerisinde yapılan `String` concatenation işlemlerinde büyük ölçüde performans sağlıyor. 
Normalde her `String` birleştirme işleminde yeni bir `String` objesi yaratılır 
ve varolan `String` objesi değişmeden kalır. 
Bu işlemler `StringBuilder` sınıfı ile yapıldığında ise tek bir obje ile 
istediğimiz kadar `String`'i birbirine ekleyebiliriz. 
Aşağıda da basitçe `StringBuilder` sınıfı nasıl kullanılır ona bakalım:

```java
StringBuilder builder = new StringBuilder();
// append methodu ile istediğimiz kadar 
// String'i StringBuilder objesine ekleyebiliriz.
builder.append("abcdef");
builder.append("qwerty");
builder.append("zxcvbb");

String str = builder.toString();
// str = "abcdefqwertyzxcvbb";
```

#### StringBuffer

Bu sınıf ile `StringBuilder` yaptıkları iş olarak baktığımızda neredeyse tamamen aynı.
`String` objesinin concatenation işlemlerinde fazladan bellek 
ve işlemci kullanımına karşı ikisi de aynı avantajı sağlar. 
Aralarındaki tek fark, `StringBuffer` bu işi thread safe olarak yapar. 
Thread safety kavramını açıklamanın yeri bu yazı değil fakat kabaca değinmek gerekirse, 
şu şekilde açıklayabilirim: 
eğer bir nesne birden fazla thread tarafından rastgele olarak kullanılıyorsa 
ve bu nesne bir thread kendisiyle işini bitirmeden diğerinin işine başlamıyorsa, 
o nesneye thread safe diyoruz. 
Bir de kaba bir örnek vereyim. 
Mesela `StringBuilder` objesine iki farklı thread aynı anda erişip birisi "abc", 
diğeri de "def" append etmeye çalışırsa, 
en son elde ettiğimiz `String`'in "adefbc", "deabfc" veya "adbecf" olma 
veya sistemin `Exception` fırlatma ihtimalleri var. 
Bu durumda ya synchronized değişkenler kullanarak elle `StringBuilder` objesini koruyacağız, 
ya da kendi kendini koruyabilen `StringBuffer` objesini kullanacağız. 
`StringBuffer` objesinin thread safe yapısı da kendisini `StringBuilder`'a göre biraz yavaş kılıyor. 
Yani eğer sisteminizde birden fazla thread yoksa, `StringBuilder` kullanmanızı tavsiye ederim.

Şimdi yaptığım benchmark uygulamasının kodlarını dökeyim ortaya.
Yaptığım işlem basitçe şu:

1. Lorem ipsum satırlarından oluşan dosyayı okuyup her satırı global bir `ArrayList`'e kaydet.
2. `ArrayList` içindeki elemanları kopyalayıp tekrar ArrayList'e ekleyerek 
1044480 adet String'den oluşan bir ArrayList elde et.
3. Toplamda 100 defa `String` concatenation, `StringBuilder` ve `StringBuffer` kullanarak 
ArrayList içerisindeki `String`'leri birleştir ve sürelerin ortalamalarını hesapla.
4. Oluşan sonuçları her adımda ve programın sonunda konsola yaz.

Dürüst olmak gerekirse `String` concatenation işlemi o kadar uzun sürdü ki, 
ilk stepte programı durdurup `String` ile yaptığım işlemi comment-out ettim 
ve tekrar çalıştırdığımda sadece `StringBuilder` ve `StringBuffer`'ı karşılaştırdım.

`String` işin içine girdiğinde çok daha küçük bir `ArrayList` (16320 cümle) ile çalıştım 
ve döngülerin iterasyon sayılarını da düşük tuttum ki gece bitmeden bir sonuca varabileyim. 
Aşağıda içinde `String` objesinin concatenation operatörünün de kullanıldığı 16320 cümleyi birleştirme süreleri:

```text
Size of WORD_LIST: 16320
Started 1. main iteration...
concatenation: 52424.0 ms.
string builder: 8.0 ms.
string buffer: 9.0 ms.
Finished 1. main iteration...
```

Buradan anlayacağımız üzere, 
16320 tane `String` objesini birleştirmek için kesinlikle `String` concatenation kullanmıyoruz :).
`String` concatenation işlemini uygulamadan kaldırdıktan sonra 
`ArrayList`'in boyutunu arttırıp (1044480 cümle) uygulamamızı 10 sample üretecek şekilde çalıştırırsak 
şu sonuçları elde ediyoruz:

```text
Size of WORD_LIST: 1044480
Started 1. main iteration…
string builder: 302.2 ms.
string buffer: 230.49999999999997 ms.
Finished 1. main iteration…
Started 2. main iteration…
string builder: 143.3 ms.
string buffer: 149.30000000000004 ms.
Finished 2. main iteration…
Started 3. main iteration…
string builder: 155.50000000000003 ms.
string buffer: 150.5 ms.
Finished 3. main iteration…
Started 4. main iteration…
string builder: 143.09999999999997 ms.
string buffer: 160.4 ms.
Finished 4. main iteration…
Started 5. main iteration…
string builder: 159.60000000000002 ms.
string buffer: 198.8 ms.
Finished 5. main iteration…
Started 6. main iteration…
string builder: 161.8 ms.
string buffer: 143.2 ms.
Finished 6. main iteration…
Started 7. main iteration…
string builder: 125.39999999999999 ms.
string buffer: 142.4 ms.
Finished 7. main iteration…
Started 8. main iteration…
string builder: 134.2 ms.
string buffer: 148.2 ms.
Finished 8. main iteration…
Started 9. main iteration…
string builder: 189.5 ms.
string buffer: 170.4 ms.
Finished 9. main iteration…
Started 10. main iteration…
string builder: 150.4 ms.
string buffer: 292.5 ms.
Finished 10. main iteration…
Average time for concatenation: 0.0 ms.
Average time for string builder: 166.49999999999997 ms.
Average time for string buffer: 178.61999999999998 ms.
```

Raporun sonundaki ortalamadan anlayacağımız gibi `StringBuilder` objesi 
`StringBuffer` objesine göre daha hızlı bir şekilde, 
daha kısa sürede işini hallediyor. 
Peki bazı ara steplerdeki anormal sonuçları nasıl açıklayabiliriz?
Nasıl oluyor da bazen `StringBuffer` öne geçiyor? 
Bunu 6 ay önce olsa açıklayamazdım fakat İşletim Sistemleri dersini aldığım için artık açıklayabilirim.
İşletim Sistemleri Multi-Threading/Multi-Processing yapılarından dolayı sürekli olarak bizim işlemimizi yapmıyor.
Büyük bir for döngüsü bitene kadar işlemcide çalışamaz mesela.
İşletim sistemi o işlemi ara sıra duraklatıp bilgisayardaki diğer işlerle de ilgilenmek zorunda kalır.
Hatta bu uygulamada yarattığımız yoğun işlemci kullanımı sebebiye de 
işletim sistemi bizim uygulamamızın önceliğini düşürüyor olabilir.
`StringBuilder` çalışırken bizim işlemimiz işletim sistemi tarafından 10 kere duraklatılmış 
ve `StringBuffer` çalışırken de 8 kere duraklatılmış olabilir.
Bu da `StringBuilder` kullanırken ölçtüğümüz zamanın daha fazla çıktığı stepleri kabaca açıklayabilir.

#### Özet

Çok fazla yazı yazdım fakat hiçbir şey anlatamadım gibi bir his var içimde.
Bir özet geçelim:

1. `String` **immutable(değişmez)** bir sınıftır. 
`String` üzerinden yapacağımız çoğu işlem yeni bir `String` objesi yaratır ve orjinal `String` objesi değişmez.
2. Çok fazla `String` birleştireceksek `String` concatenation kullanmıyoruz. 
Bu işlem **çok uzun sürer, yüksek bellek ve CPU kullanımına** sebep olabilir.
3. **Birden fazla thread** kullanıyorsak ve birden fazla thread aynı `StringBuilder` objesine erişiyorsa, 
istenmedik sonuçlar doğabilir. Bu durumda `StringBuffer` kullanıyoruz.
4. **Birden fazla thread kullanmıyorsak**, performans açısından `StringBuffer` değil `StringBuilder` kullanıyoruz.

Programın kaynak kodlarını indirmek için [buraya tıklayın][source-code].

Yada sadece programda kullandığım test.txt dosyasına ihtiyacınız varsa, [burayı tıklayın][input-file].

##### İşte kodlar:

```java
package com.asosyalbebe.blog;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

public class Prep {
    private static final String FILENAME = "test.txt";
    private static final ArrayList<String> WORD_LIST = new ArrayList<String>(1000);
    private static final int SUB_ITERATION = 10;
    private static final int MAIN_ITERATION = 10;

    public static void main(String[] args) throws FileNotFoundException {
        readFile(FILENAME);

        double averageTimeConcat = 0;
        double averageTimeBuild = 0;
        double averageTimeBuffer = 0;

        for (int i = 0; i < MAIN_ITERATION; i++) {
            System.out.println("Started " + (i + 1) + ". main iteration...");

            // double concat = concatenateBenchmark(WORD_LIST, SUB_ITERATION);
            // System.out.println("concatenation: " + concat + " ms.");
            // averageTimeConcat += concat / MAIN_ITERATION;

            double builderTime = stringBuildBenchmark(WORD_LIST, SUB_ITERATION);
            System.out.println("string builder: " + builderTime + " ms.");
            averageTimeBuild += builderTime / MAIN_ITERATION;

            double bufferTime = stringBufferBenchmark(WORD_LIST, SUB_ITERATION);
            System.out.println("string buffer: " + bufferTime + " ms.");
            averageTimeBuffer += bufferTime / MAIN_ITERATION;

            System.out.println("Finished " + (i + 1) + ". main iteration...");
        }

        System.out.println("Average time for concatenation: " + averageTimeConcat + " ms.");
        System.out.println("Average time for string builder: " + averageTimeBuild + " ms.");
        System.out.println("Average time for string buffer: " + averageTimeBuffer + " ms.");
    }

    private static double concatenateBenchmark(ArrayList<String> wordList, int iteration) {
        double average = 0;
        for (int i = 0; i < iteration; i++) {
            long roundTime = concatenateWordList(wordList);
            average += (double) roundTime / iteration;
        }
        return average;
    }

    private static double stringBuildBenchmark(ArrayList<String> wordList, int iteration) {
        double average = 0;
        for (int i = 0; i < iteration; i++) {
            long roundTime = stringBuildWordList(wordList);
            average += (double) roundTime / iteration;
        }
        return average;
    }

    private static double stringBufferBenchmark(ArrayList<String> wordList, int iteration) {
        double average = 0;
        for (int i = 0; i < iteration; i++) {
            long roundTime = stringBufferWordList(wordList);
            average += (double) roundTime / iteration;
        }
        return average;
    }

    private static long concatenateWordList(ArrayList<String> wordList) {
        long startTime = System.currentTimeMillis();
        String s = "";
        for (String line : wordList) {
            s += line;
        }
        long finishTime = System.currentTimeMillis();
        s.charAt(0); // Just a dummy call
        return finishTime - startTime;
    }

    private static long stringBuildWordList(ArrayList<String> wordList) {
        long startTime = System.currentTimeMillis();
        StringBuilder builder = new StringBuilder();
        for (String line : wordList) {
            builder.append(line);
        }
        String s = builder.toString();
        long finishTime = System.currentTimeMillis();
        s.charAt(0); // Just a dummy call
        return finishTime - startTime;
    }

    private static long stringBufferWordList(ArrayList<String> wordList) {
        long startTime = System.currentTimeMillis();
        StringBuffer buffer = new StringBuffer();
        for (String line : wordList) {
            buffer.append(line);
        }
        String s = buffer.toString();
        long finishTime = System.currentTimeMillis();
        s.charAt(0); // Just a dummy call
        return finishTime - startTime;
    }

    private static void readFile(String filename) throws FileNotFoundException {
        Scanner scanner = new Scanner(new File(filename));
        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            WORD_LIST.add(line);
        }
        scanner.close();

        for (int j = 0; j < 11; j++) {
            int size = WORD_LIST.size();
            for (int i = 0; i < size; i++) {
                String line = WORD_LIST.get(i);
                WORD_LIST.add(line);
            }
        }

        System.out.println("Size of WORD_LIST: " + WORD_LIST.size());
    }
}
```

Buraya kadar katlandığınız için teşekkür ederim efenim, umarım faydalı bir içerik olmuştur. 
Sağlıcakla kalın.
