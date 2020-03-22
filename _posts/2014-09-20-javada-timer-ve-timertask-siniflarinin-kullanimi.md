---
layout: post
title:  "Java'da Timer ve TimerTask Sınıflarının Kullanımı"
date:   2014-09-20 00:16:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /javada-timer-ve-timertask-siniflarinin-kullanimi
comments: true
post_identifier: javada-timer-ve-timertask-siniflarinin-kullanimi
featured_image: /assets/category/java.png
---

Merhaba arkadaşlar. 
Bu yazımda Java'daki `Timer` ve `TimerTask` sınıflarının kullanımından bahsedeceğim. 
Bu sınıfların ne gibi dertlerimize derman olduğunu kısaca anlatmaya çalışacağım 
ve nacizene birkaç örnek uygulama göstereceğim. 
Öncelikle kemerlerimizi bağlayalım.

<!--more-->

### 1. `java.util.Timer` Sınıfı

`Timer` sınıfı, bize belirli görevlerin belirtilen zamanda bir seferliğine 
veya tekrarlayan aralıklarla arkaplanda (ayrı thread'de) çalıştırılmasını sağlayan 
single-thread bir yapı sunmaktadır. 
Yani yaratacağımız her `Timer` objesi yeni bir `Thread` anlamına geliyor.

### 2. `java.util.TimerTask` Sınıfı

`Timer` nesnelerine yapması gereken işleri Runnable interface'inin bir implementasyonu olan 
`TimerTask` nesneleri şeklinde veriyoruz. 
Bir `Timer` nesnesine birden fazla `TimerTask` nesnesini zamanlayabiliyoruz.
Aşağıya hemen bir örnek kod koyayım:

```java
package com.asosyalbebe.timers;

import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

public class MyFirstTimerApplication {
    public static void main(String[] args) {
        // Create 2 timers
        // which means 2 threads
        Timer timer1 = new Timer("MyTimer-1");
        Timer timer2 = new Timer("MyTimer-2");

        System.out.println("Scheduling tasks...");
        // Schedule the first task on the first timer
        timer1.scheduleAtFixedRate(new SimpleTimerTask("Task1"), 0, 50);
        // Schedule the second task on the second timer
        timer2.scheduleAtFixedRate(new SimpleTimerTask("Task2"), 0, 100);
        // Schedule the third task on the second timer
        timer2.scheduleAtFixedRate(new SimpleTimerTask("Task3"), 5, 100);

        try {
            // Sleep main thread for 500 ms
            // Timer threads continue executing
            Thread.sleep(500);
        } catch (InterruptedException e) {
            System.out.println("Interrupted! Exiting...");
            System.exit(0);
        }

        // Here, main thread woke up
        System.out.println("Main thread woke up!");
        // Cancel all timers
        timer1.cancel();
        timer2.cancel();
        System.out.println("Timers were cancelled!");
    }

    public static class SimpleTimerTask extends TimerTask {
        private String name;

        public SimpleTimerTask(String name) {
            this.name = name;
        }

        @Override
        public void run() {
            String dateStr = String.valueOf(new Date().getTime());
            String currentThreadStr = Thread.currentThread().getName();
            System.out.printf("SimpleTimerTask {name: %s, date: %s, thread: %s}\n", name, dateStr, currentThreadStr);
        }
    }
}
```

Kodda ne yaptığımdan bahsedeyim kabaca. 
Öncelikle iki tane Timer yarattım. 
Timer objelerinin constructor'ına verdiğim parametreler, çalışacak olan Thread'lere verilecek olan isimler. 
Hani demiştim ya her Timer objesi bir yeni Thread yaratır diye, işte o hesap. 
SimpleTimerTask isminde bir sınıf oluşturdum, TimerTask'ı extend edecek şekilde. 
TimerTask sınıfını extend eden bir sınıfın yapmak zorunda olduğu tek şey `run()` methodunu override etmektir. 
Ben bu yazım için geliştirdiğim `SimpleTimerTask` sınıfının `run()` methodunda Task'e verdiğim isimi, 
o anki zamanı ve Task'i çalıştıran Thread'in ismini konsola yazdırmayı tercih ettim. 
Task'lere ve Thread'lere isim vermemin sebebi outputu kolayca takip edebilmemizdi.

Timer nesnelerinin üzerinde TimerTask objelerini `schedule(...)` 
veya `scheduleAtFixedRate(...)` methodlarıyla schedule ediyoruz. 
`schedule(...)` methoduyla zamanlanan task'ler belirtilen zamanda sadece bir kere çalışırken, 
`scheduleAtFixedRate(...)` methoduyla zamanlanan task'ler belirtilen zamanda başlar, 
belirtilen aralıklarla tekrar tekrar çalışırlar. 
Mesela yukarıdaki kod örneğinde ilk task'i 0 milisaniye sonra çalıştır, 
50 milisaniyede bir tekrar et şeklinde ayarladım. 
İkinci task'i 0 milisaniye sonra çalış ve 100 milisaniyede bir tekrar et şeklinde kurdum. 
Son task'i ise 5 milisaniye sonra çalış, 100 milisaniyede bir tekrar et diye kurdum. 
İlk task'i birinci Timer objesine verirken, diğer iki task'i ikinci Timer objesine verdim. 
Yani sistemde 3 adet task, 2 tane Timer thread'i, 1 tane de main thread var. 
Task'ler çalıştıktan sonra main thread'i 500 milisaniye uyumaya davet ettim 
ve uyandığında da Timer'ları iptal etmesini istedim. 
Kodu çalıştırdığımızda alacağımız sonuç şuna benzeyecektir:

```text
Scheduling tasks...
SimpleTimerTask {name: Task2, date: 1411150660445, thread: MyTimer-2}
SimpleTimerTask {name: Task1, date: 1411150660445, thread: MyTimer-1}
SimpleTimerTask {name: Task3, date: 1411150660450, thread: MyTimer-2}
SimpleTimerTask {name: Task1, date: 1411150660495, thread: MyTimer-1}
SimpleTimerTask {name: Task1, date: 1411150660545, thread: MyTimer-1}
SimpleTimerTask {name: Task2, date: 1411150660545, thread: MyTimer-2}
SimpleTimerTask {name: Task3, date: 1411150660550, thread: MyTimer-2}
SimpleTimerTask {name: Task1, date: 1411150660595, thread: MyTimer-1}
SimpleTimerTask {name: Task1, date: 1411150660645, thread: MyTimer-1}
SimpleTimerTask {name: Task2, date: 1411150660645, thread: MyTimer-2}
SimpleTimerTask {name: Task3, date: 1411150660650, thread: MyTimer-2}
SimpleTimerTask {name: Task1, date: 1411150660695, thread: MyTimer-1}
SimpleTimerTask {name: Task1, date: 1411150660745, thread: MyTimer-1}
SimpleTimerTask {name: Task2, date: 1411150660745, thread: MyTimer-2}
SimpleTimerTask {name: Task3, date: 1411150660750, thread: MyTimer-2}
SimpleTimerTask {name: Task1, date: 1411150660795, thread: MyTimer-1}
SimpleTimerTask {name: Task2, date: 1411150660845, thread: MyTimer-2}
SimpleTimerTask {name: Task1, date: 1411150660845, thread: MyTimer-1}
SimpleTimerTask {name: Task3, date: 1411150660850, thread: MyTimer-2}
SimpleTimerTask {name: Task1, date: 1411150660895, thread: MyTimer-1}
SimpleTimerTask {name: Task2, date: 1411150660945, thread: MyTimer-2}
SimpleTimerTask {name: Task1, date: 1411150660945, thread: MyTimer-1}
Main thread woke up!
Timers were cancelled!
```

Kodun çıktısından task'lerin çalışma zamanlarını rahatlıkla görebiliyoruz. 
Ayrıca her TimerTask'in bulunduğu Timer'ın thread'inde çalıştığını görüyoruz. 
Şimdi bir adım derine inelim.

Bir Timer objesinin sadece bir thread kullandığını söylemiştim. 
Yani zamanladığımız her task bir queue'da bekletiliyor ve sırasıyla işleniyor. 
Bunun şöyle bir dezavantajı var; eğer zamanlanan görev çok uzun sürüyorsa, 
o işlem başladığında o Timer'ın thread'ini uzun süre meşgul edeceği için 
sıradaki diğer task'lere zamanında sıra gelmeyebilir. 
Örneğin 10 milisaniyede bir başka bir sunucuya bağlanıp veri transferi yapmak için bir Timer kurarsak, 
network bazlı gecikmelerden dolayı verdiğimiz süre tutmayacaktır. 
Yada bir Timer üzerinde aynı anda çalışmasını istediğimiz iki task'ten birisi diğerine göre daha geç çalışacaktır. 
Bu yüzden genellikle Timer kullanılacağı zaman kısa işler yapmamızı öneriyor üstatlar. 
Aşağıda bir örnek kod göstereyim de tam olsun.

```java
package com.asosyalbebe.timers;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

public class TimerWithLatency {
    public static void main(String[] args) {
        Timer timer = new Timer();
        timer.scheduleAtFixedRate(new LongTimerTask(), 0, 100);

        try {
            System.out.println("Main thread is sleeping.");
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            System.out.println("Oh no! I'm interrupted!");
            System.exit(0);
        }

        System.out.println("Main thread woke up!");
        timer.cancel();
        System.out.println("Timer cancelled!");
    }

    public static class LongTimerTask extends TimerTask {
        @Override
        public void run() {
            // This is a long task
            long startDate = System.currentTimeMillis();
            System.out.println("TaskStarted = " + startDate);
            try {
                File file = new File("test-file.txt");
                for (int i = 0; i &lt; 5000; i++) {
                    FileWriter fileWriter = new FileWriter(file);
                    fileWriter.append("Line" + i + "n");
                    fileWriter.flush();
                    fileWriter.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            long finishDate = System.currentTimeMillis();

            System.out.println("TimePassed = " + (finishDate - startDate));
        }
    }
}
```

Biliyorum, `run()` methodunda çalıştırdığım kod tam bir amelelik, 
fakat sadece yapılacak işin uzun süreceği hissini vermesi için o şekilde yazdım. 
Bu kod çalıştırıldığında vereceği output da şunun gibi birşey olacaktır:

```text
Main thread is sleeping.
TaskStarted = 1411154424309
TimePassed = 1296
TaskStarted = 1411154425605
TimePassed = 1066
TaskStarted = 1411154426671
TimePassed = 1641
TaskStarted = 1411154428312
Main thread woke up!
Timer cancelled!
TimePassed = 1205
```

Gördüğümüz üzere, 
Timer üzerinde 100 milisaniyede bir çalış dediğimiz görev çok uzun olduğu için gecikmeler meydana gelmiş.
100 milisaniyede bir çalışacak olan görev ortalama 1.5 saniyede bir çalışmış.
Ayrıca burada farkına varmanızı istediğim bir diğer nokta da, 
Timer `cancel()` methoduyla iptal edilir edilmez thread sonlanmıyor. 
O an çalıştırmakta olduğu bir task varsa, o bittikten sonra Timer kapanıyor.

Yav bu Timer iyiymiş, hoşmuş da, ne işimize yarayacak bu diye soranlar vardır.
Timer'ı kısaca özetleyecek bir cümle uydurmam gerekseydi sanırım bu cümle 
"arkaplanda zamanlanmış görevlerin çalıştırılması" olurdu. 
Lakin malum biz programcılar cümlelerle değil kodla konuşuruz.
O yüzden yine örnek vereceğim.
Aklıma gelen ilk örnek word/excel gibi ofis uygulamalarında 5 dakikada bir 
kullanıcının değişiklik yaptığı dosyanın otomatik olarak kaydedilmesi oldu.
Fakat bu bana eğlenceli gelmedi.
Hadi kısa süreliğine odun bir developer olmayı bir kenara bırakıp sevgilimize 
iki Task'li basit bir Java süprizi hazırlayalım.

Aşağıdaki kod `I love you ${sevgilinizin adı}` yazısını önce harf harf ekrana yazdıracak,
sonra da bu yazının farklı renklerde görünmesini sağlayacak:

```java
package com.asosyalbebe.timers;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.lang.reflect.InvocationTargetException;
import java.util.Timer;
import java.util.TimerTask;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class TimerForGirlfriend extends JFrame {
    private static final long serialVersionUID = 1L;
    private static final String MESSAGE = "I love you ${GIRLFRIEND_NAME}";

    private CustomJPanel panel;
    private JLabel label;

    public TimerForGirlfriend() {
        super(MESSAGE);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        panel = new CustomJPanel();
        label = new JLabel();
        label.setFont(new Font("Comic Sans MS", Font.BOLD, 25));
        label.setForeground(Color.BLUE);
        panel.add(label);

        setContentPane(panel);
        setSize(new Dimension(500, 100));
        setResizable(false);
        setLocationRelativeTo(null);
    }

    public JLabel getLabel() {
        return label;
    }

    private static class CustomJPanel extends JPanel {
        private static final long serialVersionUID = 1L;

        @Override
        protected void paintComponent(Graphics g) {
            g.setColor(Color.WHITE);
            g.fillRect(0, 0, getWidth(), getHeight());
        }
    }

    private static class WriteTimerTask extends TimerTask {
        private JLabel label;
        private int charIndex = 0;
        private String message = "";

        public WriteTimerTask(JLabel label) {
            this.label = label;
        }

        @Override
        public void run() {
            if (charIndex == MESSAGE.length()) {
                // Whole message was displayed.
                return;
            }
            message += MESSAGE.charAt(charIndex++);

            SwingUtilities.invokeLater(new Runnable() {
                @Override
                public void run() {
                    // Do UI update in event dispatcher thread
                    label.setText(message);
                }
            });
        }
    }

    private static class BlinkTimerTask extends TimerTask {
        private JLabel label;
        private int colorIndex = 0;
        private Color[] colors = new Color[] {
            Color.BLACK, Color.BLUE, Color.RED, Color.YELLOW, Color.MAGENTA, Color.GREEN
        };

        public BlinkTimerTask(JLabel label) {
            this.label = label;
        }

        @Override
        public void run() {
            final Color color = colors[colorIndex % colors.length];
            colorIndex++;

            SwingUtilities.invokeLater(new Runnable() {
                @Override
                public void run() {
                    // Do UI update in event dispatcher thread
                    label.setForeground(color);
                }
            });
        }
    }

    public static void main(String[] args) throws InterruptedException, InvocationTargetException {
        final TimerForGirlfriend frame = new TimerForGirlfriend();

        SwingUtilities.invokeAndWait(new Runnable() {
            @Override
            public void run() {
                // UI code must run in event dispatcher thread
                frame.setVisible(true);
            }
        });

        // Run after the frame is visible
        Timer timer = new Timer();
        int writeTimerTaskEndTime = 200 * (MESSAGE.length() + 2);
        timer.scheduleAtFixedRate(new WriteTimerTask(frame.getLabel()), 200, 200);
        timer.scheduleAtFixedRate(new BlinkTimerTask(frame.getLabel()), writeTimerTaskEndTime, 200);
    }
}
```

Efendim şimdilik benden bu kadar.
Daha eğlenceli kodlar için izlemede kalın.
Yorumlarınızı esirgemeyin.
Kodlu geceler.
