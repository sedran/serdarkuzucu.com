---
layout: post
title:  "Visitor Design Pattern"
date:   2017-05-28 05:12:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /visitor-design-pattern/
comments: true
post_identifier: visitor-design-pattern
featured_image: /assets/posts/visitor-pattern-wristband.jpg
---

Bu gece de çirkin kod yazmaktan bıkmış haldeyken 
kendime bir süredir temiz kod yazmak ile ilgili ahkam kesmediğimi hatırlattım. 
Hepimiz inheritance, polymorphism, abstraction, encapsulation 
gibi nesne tabanlı programlama konseptlerini geliştirdiğimiz projelerde bolca kullanıyoruz. 
Belki bir iş mülakatında sorsalar bunlar ne diye bülbül gibi anlatırız da. 
Peki yazılımın kalite çıtasını Allahuekber dağlarına kadar çıkartabilecek olan 
bu güçlü araçları yeterince doğru kullanabiliyor muyuz?

<!--more-->

Misal, bir arayüzün farklı implementasyonlarının nesnelerinden oluşan bir listenin 
elemanları üzerinde çeşitli işlemler yapıyorsunuz ve her sınıf için yapacağınız işlemler 
farklılık gösteriyor. Örneğin aşağıdaki `Shape` arayüzü ve onun altındaki `Circle`, `Rectangle` 
ve `Square` sınıflarını hayalimize yükleyelim.

```java
// Shape
public interface Shape {
}

// Circle
public class Circle implements Shape {
    private int centerX;
    private int centerY;
    private int radius;

    public Circle(int centerX, int centerY, int radius) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
    }

    public int getCenterX() {
        return centerX;
    }

    public int getCenterY() {
        return centerY;
    }

    public int getRadius() {
        return radius;
    }
}

// Rectangle
public class Rectangle implements Shape {
    private int x;
    private int y;
    private int width;
    private int height;

    public Rectangle(int x, int y, int width, int height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }
}

// Square
public class Square extends Rectangle {
    public Square(int x, int y, int length) {
        super(x, y, length, length);
    }
}
```

Şimdi aşağıdaki gibi bir listeye bu şekilleri doldurduğumuzu düşünelim:

```java
List<Shape> shapes = new ArrayList<>();
shapes.add(new Circle(30, 40, 20));
shapes.add(new Square(50, 60, 30));
shapes.add(new Rectangle(10, 10, 20, 30));
```

Bu şekilleri belirli bir formatta konsola yazdırmak isteseydiniz 
(toString formatının dışında), aşağıdaki gibi bir kod yazar mıydınız?

```java
private static void printShapes(List<Shape> shapes, PrintStream out) {
  for (Shape shape : shapes) {
    if (shape instanceof Circle) {
      Circle circle = (Circle) shape;
      out.printf("Circle Center = (%d, %d) and Radius = %d\n", 
        circle.getCenterX(), circle.getCenterY(), circle.getRadius());
    } else if (shape instanceof Square) {
      Square square = (Square) shape;
      out.printf("Square TopLeftCorner = (%d, %d) and SideLength = %d\n", 
        square.getX(), square.getY(), square.getWidth());
    } else if (shape instanceof Rectangle) {
      Rectangle rectangle = (Rectangle) shape;
      out.printf("Rectangle TopLeftCorner = (%d, %d), Width = %d and Height = %d\n", 
        rectangle.getX(), rectangle.getY(), rectangle.getWidth(), rectangle.getHeight());
    }
  }
}
```

Çok acil bir durumda bunu yazmamız istenirse belki böyle yazardık. 
Bir diğer yöntem de her `Shape` arayüzüne `String explainYourself();` gibi bir method ekleyip, 
bu açıklama metinlerini nesnelerin kendilerinin dönmesini sağlayabilirdik. 
Böylece `if/else` ve `instanceof` kullanımlarından kurtulurduk. 
Aşağıdaki gibi bir kod ile konsola yazdırma işlemi tamamlanırdı:

```java
private static void printShapes(List&lt;Shape&gt; shapes, PrintStream out) {
  for (Shape shape : shapes) {
    out.println(shape.explainYourself());
  }
}
```

Peki sonra sizden `java.awt.Graphics` kullanarak tüm bu şekilleri ekrana çizmeniz istenirse? 
O zaman da `Shape` arayüzünün üzerine `paintYourself(Graphics g)` methodunu mu ekleyecektiniz? 
Yoksa bu sefer eski usül aşağıdaki gibi `if/else` ve `instanceof` kullanarak mı çözmeyi uygun bulacaktınız?

```java
private static class ShapeDrawerPanel extends JPanel {
  private List<Shape> shapes;

  public ShapeDrawerPanel(List<Shape> shapes) {
    this.shapes = shapes;
  }

  @Override
  public void paint(Graphics g) {
    g.setColor(Color.WHITE);
    g.fillRect(0, 0, getWidth(), getHeight());

    for (Shape shape : shapes) {
      if (shape instanceof Circle) {
        g.setColor(Color.RED);
        Circle circle = (Circle) shape;
        g.drawOval(circle.getCenterX() - circle.getRadius(), circle.getCenterY() - circle.getRadius(), 
          circle.getRadius() * 2, circle.getRadius() * 2);
      } else if (shape instanceof Square) {
        g.setColor(Color.GREEN);
        Square square = (Square) shape;
        g.drawRect(square.getX(), square.getY(), square.getWidth(), square.getHeight());
      } else if (shape instanceof Rectangle) {
        g.setColor(Color.BLUE);
        Rectangle rectangle = (Rectangle) shape;
        g.drawRect(rectangle.getX(), rectangle.getY(), rectangle.getWidth(), rectangle.getHeight());
      }
    }
  }
}
```

`Shape` arayüzüne sahip sınıflar ile yapacağımız her farklı işlem için tekrar tekrar 
bu if/else bloklarını yazmak oldukça kötü. Bunu zaten tartışmaya açık görmüyorum.

Her yeni işlem için tüm sınıflara yeni birer method eklemek ise bu sınıfları bir hayli kirletiyor. 
Her yeni operasyonda sisteminizdeki tüm data sınıflarınızı modifiye etmek zorunda kalıyorsunuz. 
Bu da data sınıflarınız ile bu sınıfları kullanan diğer sınıflar arasında yanlış bir bağımlılık oluşturuyor. 
Bir sınıfın kendisini kullanan sınıflara ait detayları bilmemesi gerekiyor. 
`Shape` sınıfına `Graphics` kullanarak kendisini ekrana nasıl çizmesi gerektiği detayını eklersek, 
ona geometrik bir şeklin yerini ve boyutlarını tanımlama amacının dışında farklı bir özellik kazandırmış oluyoruz 
ve sistemi bu şekilde tasarlamaya başlarsak ileride birisi tüm şekilleri XML dosyasına çevir dediğinde 
yazılımın tutarlı olması için bu fonksiyonaliteyi de `Shape` üzerine eklemek zorunda kalırız.

Ben biraz düşünerek bu şekilde bir yazılım tasarladığımızda [SOLID][solid] kurallarının 3 tanesini 
çiğneyebileceğimizi gördüm. Diğer 2 kuralı da bir şekilde bozuyorsak yorum olarak iletebilirsiniz.

* **Single Responsibility:** `Shape` arayüzüne bu kadar fazla sorumluluk ekleyerek ilk önce bu kuralı çiğnemiş oluruz.
* **Open-Closed Principle:** Her yeni talepte `Shape` arayüzüne ve ondan türeyen sınıflara doğrudan müdahale etmek 
zorunda kaldığımız için bu kuralı da ezip geçmiş oluyoruz.
* **Interface segregation principle:** Bu kural bir sınıfın kullanmayacağı bir arayüzü implement etmek zorunda 
bırakılmaması gerektiğini söylüyor. Bizim örneğimizde de belki bazı `Shape` türü sınıfların ekranda çizilmemesi 
veya konsola yazılmaması gerekiyordur fakat ilgili methodları `Shape` arayüzüne koyduğumuz için tüm geometrik 
şekiller bu methodları barındırmak zorunda kalıyor. Bu şekilde zorlarsak bu kuralı da ezmiş oluyoruz.

### Visitor Design Pattern

Yeteri kadar kötü kod gördük diyip asıl amacıma geçiyorum. 
Visitor pattern'ın en önemli avantajı üzerinde çeşitli operasyonlar yapacağımız sınıfları 
hiç modifiye etmeden yeni operasyonlar tanımlayabiliyor olmamız. 
Diğer avantajı ise arayüz kullanarak kaybettiğimiz nesne tiplerini 
(Örneğin `Shape` türündeki değişkende aslında hangi nesne tipi olduğunu bilmiyoruz) 
`instanceof` kontrolü yapmadan geri kazanabiliyor olmamız. 
Böylece nesnenin tipine uygun işlemin yapılmasını sağlıyor.

Bu design pattern'ı uygulayabilmek için öncelikle tüm şekilleri ziyaret edebilecek 
bir `Visitor` arayüzüne ihtiyacımız var. Bunu aşağıdaki şekilde tanımlıyoruz:

```java
public interface ShapeVisitor {
    void visit(Circle circle);

    void visit(Rectangle rectangle);

    void visit(Square square);
}
```

`ShapeVisitor` arayüzünün `Shape` türü nesneleri ziyaret edebilmesi için, 
`Shape` sınıfına aşağıdaki gibi `accept` methodunu ekliyoruz.

```java
public interface Shape {
    void accept(ShapeVisitor visitor);
}
```

Bu method `Shape` alt sınıflarının hepsinde aynı şekilde implement ediliyor. 
O nedenle sadece `Circle` sınıfını burada örnek olarak gösteriyorum.

```java
public class Circle implements Shape {
    private int centerX;
    private int centerY;
    private int radius;

    public Circle(int centerX, int centerY, int radius) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
    }

    @Override
    public void accept(ShapeVisitor visitor) {
        // I accept the visitor and introduce myself
        visitor.visit(this);
    }

    public int getCenterX() {
        return centerX;
    }

    public int getCenterY() {
        return centerY;
    }

    public int getRadius() {
        return radius;
    }
}
```

Ve bitti. 
Bundan sonra `Shape` ve ondan türeyen tüm sınıflara bir daha müdahale etmiyoruz. 
Ne zaman `Shape` nesneleri ile nesne tipine bağımlı bir işlem yapmak gerekirse 
o zaman `ShapeVisitor` arayüzünden yeni bir sınıf yaratıp işlemleri onun içinde hallediyoruz. 
Böylece ne `Shape` nesnelerinin kendilerini kullanan koda bağımlılığı kalıyor, 
ne de ana kodun nesne tiplerini bilmeye ihtiyacı kalıyor.

Örneğin aşağıda şekillerin açıklamalarını konsola yazan kodu `ShapeVisitor` kullanarak yeniden yazalım:

```java
public class PrinterShapeVisitor implements ShapeVisitor {
  private PrintStream out;

  public PrinterShapeVisitor(PrintStream out) {
    this.out = out;
  }

  @Override
  public void visit(Circle circle) {
    out.printf("Circle Center = (%d, %d) and Radius = %d\n", 
      circle.getCenterX(), circle.getCenterY(), circle.getRadius());
  }

  @Override
  public void visit(Rectangle rectangle) {
    out.printf("Rectangle TopLeftCorner = (%d, %d), Width = %d and Height = %d\n", 
      rectangle.getX(), rectangle.getY(), rectangle.getWidth(), rectangle.getHeight());
  }

  @Override
  public void visit(Square square) {
    out.printf("Square TopLeftCorner = (%d, %d) and SideLength = %d\n", 
      square.getX(), square.getY(), square.getWidth());
  }
}
```

Bunun kullanımı ana kodda aşağıdaki şekilde yapılıyor ve tüm `if/else` 
ve `instanceof` kontrollerinden bizi kurtarıyor.

```java
private static void printShapes(List<Shape> shapes, PrintStream out) {
    PrinterShapeVisitor visitor = new PrinterShapeVisitor(out);
    shapes.forEach(shape -> shape.accept(visitor));
}
```

Verdiğim bir diğer örnek ise `Graphics` sınıfına çizim yapmaktı. 
Bunu da aşağıdaki sınıfı yaratarak halledebiliriz:

```java
public class GraphicsShapeVisitor implements ShapeVisitor {
  private Graphics g;

  public GraphicsShapeVisitor(Graphics graphics) {
    this.g = graphics;
  }

  @Override
  public void visit(Circle circle) {
    g.setColor(Color.RED);
    g.drawOval(circle.getCenterX() - circle.getRadius(), circle.getCenterY() - circle.getRadius(), 
      circle.getRadius() * 2, circle.getRadius() * 2);
  }

  @Override
  public void visit(Rectangle rectangle) {
    g.setColor(Color.BLUE);
    g.drawRect(rectangle.getX(), rectangle.getY(), rectangle.getWidth(), rectangle.getHeight());
  }

  @Override
  public void visit(Square square) {
    g.setColor(Color.GREEN);
    g.drawRect(square.getX(), square.getY(), square.getWidth(), square.getHeight());
  }
}
```

Ve bunun kullanımı da aşağıdaki şekilde tüm `if/else` 
ve `instanceof` kontrollerinden kurtulmuş halde yapılabiliyor:

```java
private static class ShapeDrawerPanel extends JPanel {
  private List<Shape> shapes;

  public ShapeDrawerPanel(List<Shape> shapes) {
    this.shapes = shapes;
  }

  @Override
  public void paint(Graphics g) {
    g.setColor(Color.WHITE);
    g.fillRect(0, 0, getWidth(), getHeight());

    GraphicsShapeVisitor visitor = new GraphicsShapeVisitor(g);
    shapes.forEach(shape -> shape.accept(visitor));
  }
}
```

Visitor pattern'ın en sevdiğim yönü beni bir çok defa type-check ve type-cast yapmaktan kurtarıyor olması. 
Geliştirdiğim sınıfların birbirine bağlılıklarını düşürerek onları tekrar kullanılabilir parçalar 
(resusable components) haline dönüştürmesi kodun kalitesi için inanılmaz bir artı.

Kaliteli kod yazımında design pattern kullanmanın önemi çok büyük. 
Kullanınız, kullandırtınız.

Ben boş vaktim kaldıkça çeşitli bloglardan farklı design pattern'ları inceliyorum. 
Bunu biliyorum dediklerimi dahi tekrar tekrar açıp farklı kaynaklardan okuyorum. 
Hatta geçen gün bu camiada herkesin parmakla gösterdiği aşağıdaki kitabı sipariş ettim, 
elime geçmesini sabırsızlıkla bekliyorum.

Ben kıçımı kaldırıp yeni bir yazı yazıncaya kadar eliniz temiz koddan kirli koda değmesin.

**Design Patterns: Elements of Reusable Object-Oriented Software**

![Design Patterns: Elements of Reusable Object-Oriented Software](/assets/posts/gof_dps.jpg){:width="256px"}

[solid]: https://scotch.io/bar-talk/s-o-l-i-d-the-first-five-principles-of-object-oriented-design
