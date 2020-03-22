---
layout: post
title:  "Swing Uygulamalarında Thread Kullanımı"
date:   2014-09-18 13:46:00 +0300
categories: [Java, Programlama]
author: Serdar Kuzucu
permalink: /swing-uygulamalarinda-thread-kullanimi
comments: true
post_identifier: swing-uygulamalarinda-thread-kullanimi
featured_image: /assets/category/java.png
---

Java'da Swing uygulamalarında, kullanıcı arayüzündeki elementlerde değişiklik yapmak 
ve bu arayüzden gelen eventleri dinlemek için tek thread kullanılır. 
Bu thread'e "event dispatch thread" ismini vermişler. 
Bu thread'in içinde uzun sürecek bir işlem yapmayı şiddetle önermiyoruz 
çünkü bu thread'in kilitlenmesi kullanıcı arayüzünün kilitlenmesi anlamına geliyor.

<!--more-->

Basit bir uygulama ile bu durumu hemen test edebiliriz. 
Örneğin iki butonlu bir pencere geliştirelim ve butonun birisine tıklanınca uzun bir işlem gerçekleştirelim. 
Bu işlem gerçekleşirken diğer butona tıklanamadığına, pencerenin kapatılamadığına, 
yani kullanıcı arayüzünün tamamen kilitlendiğine şahit olacağız.

```java
package com.asosyalbebe.swing;

import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class TwoButtonFrame extends JFrame {
    private static final long serialVersionUID = 1L;
    private JButton longTaskButton = new JButton("Difficult Task");
    private JButton shortTaskButton = new JButton("Easy Task");
    private JLabel label = new JLabel("Task Status: Not Run");

    public TwoButtonFrame() {
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(new Dimension(200, 200));

        JPanel panel = new JPanel(new FlowLayout());
        panel.add(longTaskButton);
        panel.add(shortTaskButton);
        panel.add(label);
        setContentPane(panel);

        longTaskButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // runs in event dispatcher thread
                try {
                    // assume that we are running a job for 10 seconds
                    Thread.sleep(10000);
                    label.setText("Task Status: Run");
                } catch (InterruptedException e1) {
                    e1.printStackTrace();
                }
            }
        });

        setLocationRelativeTo(null);
    }

    public static void main(String[] args) {
        TwoButtonFrame frame = new TwoButtonFrame();
        frame.setVisible(true);
    }
}
```

Kodu çalıştırıp ekrandaki ilk butona tıklarsanız, arayüzün kilitlendiğini göreceksiniz.

#### Yeni Thread Yaratmak

Şimdi butona tıklayınca çalışan ve uzun süren bu işlemi 
event dispatcher thread içerisinden başka bir thread'e taşıyabiliriz. 
Böylece kullanıcı arayüzünün kitlenmemesini sağlar, 
olumsuz kullanıcı deneyimini ortadan kaldırırız. 
Yapmamız gereken, butona tıklama eventinin kodumuza ilk düştüğü yerde 
bir thread yaratıp yapılacak işlemi bu thread'e yaptırmak.

```java
package com.asosyalbebe.swing;

import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class TwoButtonFrame extends JFrame {
    private static final long serialVersionUID = 1L;
    private JButton longTaskButton = new JButton("Difficult Task");
    private JButton shortTaskButton = new JButton("Easy Task");
    private JLabel label = new JLabel("Task Status: Not Run");

    public TwoButtonFrame() {
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(new Dimension(200, 200));

        JPanel panel = new JPanel(new FlowLayout());
        panel.add(longTaskButton);
        panel.add(shortTaskButton);
        panel.add(label);
        setContentPane(panel);

        longTaskButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // runs in new thread:
                Thread thread = new Thread() {
                    @Override
                    public void run() {
                        try {
                            // assume that we are running a job for 10 seconds
                            Thread.sleep(10000);
                            label.setText("Task Status: Run");
                        } catch (InterruptedException e1) {
                            e1.printStackTrace();
                        }
                    }
                };
                thread.start();
            }
        });

        setLocationRelativeTo(null);
    }

    public static void main(String[] args) {
        TwoButtonFrame frame = new TwoButtonFrame();
        frame.setVisible(true);
    }
}
```

Yukarıdaki kod sorunumuzu önemli bir ölçüde çözdü.
Lakin bir büyük hata yaptık.
Event dispatcher thread dışında başka bir thread üzerinden bir arayüz elementine(label) müdahale ettik.
Yukarıda yarattığımız thread'in içerisinde `label.setText("Task Status: Run")` kodunu çağırmak 
bu proje için bir sorun teşkil etmeyebilir fakat büyük sistemler için büyük bir sorundur.
Çünkü arayüz elemanlarının sadece arayüz thread'i tarafından değiştirilmesi gerekir.
Aksi takdirde birden fazla threadin aynı anda modifikasyonu 
bu eleman üzerinde istemeyeceğimiz bir datanın görünmesine sebep olabilir.

#### Bir Thread'den Arayüz Thread'ine İstekte Bulunmak

Yukarıda belirttiğim sorunun çözümü için Swing bize şık bir yöntem sunuyor.
Bu sayede arayüz thread'inde yapılması gereken işi arayüz thread'ine gönderebiliyoruz.
Kod örneğimizi yine gösterelim.

```java
package com.asosyalbebe.swing;

import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class TwoButtonFrame extends JFrame {
    private static final long serialVersionUID = 1L;
    private JButton longTaskButton = new JButton("Difficult Task");
    private JButton shortTaskButton = new JButton("Easy Task");
    private JLabel label = new JLabel("Task Status: Not Run");

    public TwoButtonFrame() {
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(new Dimension(200, 200));

        JPanel panel = new JPanel(new FlowLayout());
        panel.add(longTaskButton);
        panel.add(shortTaskButton);
        panel.add(label);
        setContentPane(panel);

        longTaskButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // runs in new thread:
                Thread thread = new Thread() {
                    @Override
                    public void run() {
                        try {
                            // assume that we are running a job for 10 seconds
                            Thread.sleep(10000);
                            SwingUtilities.invokeLater(new Runnable() {
                                @Override
                                public void run() {
                                    // this line will be run by event dispatcher thread
                                    label.setText("Task Status: Run");
                                }
                            });
                        } catch (InterruptedException e1) {
                            e1.printStackTrace();
                        }
                    }
                };
                thread.start();
            }
        });

        setLocationRelativeTo(null);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                // Application startup code also must be in event dispatcher thread
                TwoButtonFrame frame = new TwoButtonFrame();
                frame.setVisible(true);
            }
        });
    }
}
```

Yukarıdaki kod örneğinde gördüğümüz gibi, `SwingUtilities.invokeLater(Runnable r)` methodunu kullandık.
Bu method, parametre olarak verdiğimiz Runnable objesini 
event dispatcher thread'inin işlem sırasına(EventQueue) sokuyor.
Bu queue'daki işlemler de sırayla event dispatcher thread tarafından çalıştırıldığı için,
Runnable objemizin run methodunda yazdığımız kod event dispatcher thread içerisinde çalışmış oluyor.
Böylece multithread bir uygulamada arayüz işlemlerinin single thread olmasını sağlamış oluyoruz.

Ayrıca kodda dikkatimizi çekmesi gereken bir ayrıntı daha var.
main methodun içerisindeki kodları da event dispatcher thread'e gönderdik.
Evet, kullanıcı arayüzünün startup kodunu da bu şekilde çalıştırmamız gerekiyor.

#### Özet

1. Uzun süren işlemler event dispatcher thread içerisinde yapılmamalıdır! Ayrı thread kullanılmalıdır.
2. Arayüz elementlerini modifiye eden işlemlerin event dispatcher thread dışından çağırılmaması gerekiyor.
3. Event dispatcher thread tarafından çalıştırılmasını istediğimiz işlemleri 
`SwingUtilities.invokeLater(Runnable r)` methodunu kullanarak çalıştırıyoruz.

#### Kaynaklar

1. [Javamex - Threading with Swing](http://www.javamex.com/tutorials/threads/swing_ui.shtml)
2. [Javamex - Threading with Swing (ctd): SwingUtilities.invokeLater()](http://www.javamex.com/tutorials/threads/invokelater.shtml)
