---
layout: post
title:  "Linux: MySQL Veritabanını Import ve Export Etmek"
date:   2013-08-21 18:14:00 +0300
categories: [Linux, MySQL]
author: Serdar Kuzucu
permalink: /linux-mysql-veritabanini-import-ve-export-etmek/
comments: true
post_identifier: linux-mysql-veritabanini-import-ve-export-etmek
featured_image: /assets/category/database.png
---

Bazen tüm bir MySQL veritabanını tek bir dosya halinde yedek almamız gerekebilir. 
Yada tam tersi, bir dosyadan bir database'i geri yüklememiz gerekebilir. 
Bunun için linux konsolunda doğrudan çalışan mysqldump ve mysql komutlarını kullanabiliriz. 
Bu yazıda kaynak olarak gösterdiğim stackexchange linkini yer imlerime eklemiş 
her ihtiyacım olduğunda oradan bakarak yapıyordum bu işi fakat buraya da not alayım dedim.

<!--more-->

Aşağıdaki şekilde kendi bilgisayarımızdaki veritabanını 
veya eğer ssh ile bir sunucuya bağlıysak oradaki veritabanını bir dosyaya export edebilirsiniz:

```bash
mysqldump -u username -p databasename > filename.sql
```

Bu komutu yazdığınızda size MySQL şifrenizi soracak 
ve girdiğinizde filename.sql isminde bir dosya oluşturarak oraya veritabanını export edecektir.

Aşağıdaki komutla ise bir dosyaya export edilmiş bir veritabanını MySQL'e import edebiliyoruz:

```bash
mysql -u username -p databasename < filename.sql
```

Bu komutla da filename.sql adındaki dosyadan bir veritabanını içeri import etmiş olduk.

Kaynak: [dba.stackexchange.com](http://dba.stackexchange.com/questions/25599/mysql-db-import-export-command-line-in-windows)
