---
layout: post
title:  "Docker ile WordPress Kurulumu ve Https"
date:   2019-02-05 01:42:00 +0300
categories: [Docker, Wordpress, nginx]
author: Serdar Kuzucu
permalink: /docker-wordpress-https-nginx-letsencrypt/
comments: true
post_identifier: docker-wordpress-https-nginx-letsencrypt
featured_image: /assets/posts/docker-group-wp.png
---

Yakın zamanda blogumda bir takım radikal değişiklikler yaptım. 
Bunlardan en önemlisi wordpress altyapısına geçmem oldu. 
Yaklaşık 12-13 yıldır kullandığım Blogger hizmetinden ayrılmanın burukluğu ile bu kadar özgür olduğum bir 
platformda blog yazmanın sevinci birbirine karıştı. 
Hem wordpress ile yazı yazmaya elim alışsın hem de wordpress'e geçiş tecrübelerimi paylaşayım amacıyla 
bu yazıyı yazıyorum.

<!--more-->


## 1. Giriş

Blogumu wordpress altyapısına taşırken, elimdeki sunucuyu her an değiştirme gereksinimi duyabilme ihtimalimi 
ve bu değişikliği en iyi nasıl yönetirim sorusunu ön planda tuttum. 
Bu problemi çözebilmek için elimdeki sunucuya minimum bağımlılığımın bulunması gerekiyordu. 
İhtiyacım olan her yazılımı ve konfigürasyonu doğrudan sunucuya kurarsam taşınmam gerektiğinde neyin nerede olduğunu 
hatırlamam ve bir sürü şeyi tekrar yapmam gerekir. Aynı zamanda farklı farklı yazılımlar aynı ortama kurulduğunda 
birbirlerini konfigüratif olarak etkileyebilirler. Kurduğumuz her yazılım da kapatmamız gereken fakat güvenlik uzmanı 
olmadığımız için varlığından haberimiz olmayacak güvenlik zafiyetleri getirebilecektir.

Bu sebeplerden dolayı sunucuya sadece docker yükleme ve gereken diğer tüm yazılımları kendine has docker container'lar 
üzerinde çalıştırma çözümü üzerinde kendimle mutabık oldum. 
Aşağıdaki PowerPoint ile çizilmiş resimde tasarladığım mimariyi görselleştirdim.

## 2. Mimari

![Mimari](/assets/posts/wp-docker-blog-architecture.png "Mimari")

Bu mimarinin bileşenleri şu şekilde:

**Docker:** Tüm sistemi ayakta tutan platform. Docker üzerinde çalıştırdığımız her bir container ana makinadan izole 
sanal bir makina gibidir fakat bir sanal makinadan çok daha hafif ve temizdir. Docker ile ilgili daha fazla bilgi 
edinmek için resmi sitesine [buraya tıklayarak](https://docs.docker.com) ulaşabilirsiniz.

**Docker Compose:** Birden fazla docker container'ını bir arada tanımlamamıza, konfigüre etmemize ve aynı anda 
başlatıp kapatabilmemizi sağlayan araç.

**nginx:** İnternet üzerinden sunucumuzdaki 80 (http) ve 443 (https) portlarına gelen trafiği karşılayıp, 
wordpress container'ındaki 80 portuna reverse-proxy yöntemiyle iletecek olan web server.

**letsencrypt:** HTTPS protokolü kullanmak istiyorsanız ve sertifikaya para vermek istemiyorsanız; ücretsiz ve 
güvenli bir SSL sertifikası oluşturabilmenizi sağlayan kuruluş. 
İncelemek isterseniz [buraya tıklayabilirsiniz](https://letsencrypt.org/).

**apache:** Wordpress kurulumunu çalıştıracak olan web server.

**mysql:** Wordpress'in ihtiyaç duyduğu veritabanı.

**wordpress:** Açık kaynak kodlu, PHP diliyle geliştirilmiş, özelleştirmeye açık meşhur blog 
ve içerik yönetim sistemimiz.

---


## 3. Hazırlık

### 3.1. Sunucunun Alınması

Yazıyı daha az hatayla yazabilmek için [DigitalOcean](https://www.digitalocean.com/) üzerinden ucuz bir makina aldım.

İşletim sistemi olarak CentOS 7.5 seçtim.

DigitalOcean yeni sunucuma IP adresi olarak 188.166.59.76 atadı. 
Sunucunuzun IP adresini kaybetmeyin, sık sık lazım olacaktır. 
Kişisel bilgisayarımızda kullandığımız işletim sistemine göre kendimize bir SSH programı buluyoruz 
ve sunucumuza ssh ile giriş yapıyoruz.

Örneğin ben linux kullandığım için doğrudan terminalden aşağıdaki şekilde sunucuma ulaşabildim:

```shell
ssh root@188.166.59.76
```


### 3.2. DNS Yönlendirmesi

Kullanacağımız domain için, domain'imizi satın aldığımız şirketin arayüzünden DNS ayarlarımızı güncelliyoruz 
ve yeni almış olduğumuz IP adresimiz için bir adet 
[A kaydı](https://support.dnsimple.com/articles/a-record/#whats-an-a-record) oluşturuyoruz. 
**A kaydı** spesifik bir domain adresine gelen bir isteğin belirli bir IP adresine iletilmesini sağlar. 
Ben de **demoblog.serdarkuzucu.com** alt alan adını **188.166.59.76** IP adresine yönlendiren A kaydını oluşturdum.


### 3.3. Docker ve Docker Compose Kurulumu

Tüm sistemin çalışabilmesi için sunucumuza kurmamız gereken yegane araçlar docker ve docker-compose. 
Aşağıya adımları yazıyorum fakat ilerleyen zamanlarda docker kurulumunda değişiklikler yapılır ihtimaline karşı 
dökümantasyon linklerini de ekliyorum:
[docker](https://docs.docker.com/install/linux/docker-ce/centos/),
[docker-compose](https://docs.docker.com/compose/install/)

Aşağıdaki komut ile önce docker kurmak için gereken diğer araçları kuruyoruz:

```shell
sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
```

Aşağıdaki komut ile docker yazılımının indirileceği repository'yi sistemimize tanıtıyoruz:

```shell
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```
    
Ve aşağıdaki komut ile docker sunucumuza kuruluyor:

```shell
sudo yum install docker-ce docker-ce-cli containerd.io
```

Docker kuruldu fakat henüz ayakta değil. Ayağa kaldırmak için şu komutu çalıştırıyoruz:

```shell
sudo systemctl start docker
```

Aşağıdaki komut da sunucu yeniden başladığında docker da otomatik olarak ayağa kalksın amacıyla kullanılıyor. 
Bunu da çalıştıralım.

```shell
sudo systemctl enable docker
```


Şimdi sıra docker-compose kurmaya geldi. Aşağıdaki komut ile başlıyoruz:

```shell
sudo curl \
  -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
```

Daha sonra indirdiğimiz dosyaya aşağıdaki komutla gerekli yetkileri veriyoruz:

```shell
sudo chmod +x /usr/local/bin/docker-compose
```

Bu yazıda anlattığım mimari docker swarm modunda çalışmaktadır. 
Bu sebeple aşağıdaki komutu çalıştırarak docker kurulumunu swarm moduna geçirmemiz gerekiyor. 
Komuttaki IP adresine sunucumuzun IP adresini yazmayı unutmayalım.

```shell
docker swarm init --advertise-addr=188.166.59.76
```


### 3.4. Data Dizinlerinin Oluşturulması

Docker container'lar host makinadan izole şekilde çalışır. 
Her container datasını kendine özel volume adı verilen alanlarda tutar. 
Bu sebeple bir docker container silinirse veri kaybına uğrayabiliriz. 
Bunu engellemek için container oluştururken container'ların içinde önemli verilerin tutulduğu dizinleri 
host makinadaki uygun bir dizin ile eşleştiriyoruz. 
Böylece container silinip tekrar aynı dizini görecek şekilde yeni container oluşturulursa veriler korunmuş olur. 
Aynı zamanda yerini iyi bildiğimiz bu dizinleri başka bir sunucuya geçmek istediğimizde sıkıştırıp 
kolayca taşıyabiliriz.

Bu mimaride 3 adet container kullanacağız. 
Tüm data bir arada bulunsun amacıyla sunucunun root dizininde `/docker-storage` isminde bir dizin oluşturacağım 
ve her container için bu dizinin altında ekstra dizinler açacağım. 
Dikkatinizi çekerim, `docker-storage` özel bir isim değil, ben uydurdum. 
Siz başka bir dizin de kullanabilirsiniz.

```shell
mkdir -p /docker-storage/nginx
mkdir -p /docker-storage/wordpress
mkdir -p /docker-storage/mysql
chmod -R 777 /docker-storage
```

Dizin yetkilendirmesi için 777 kötü bir parametre fakat sistem uzmanı olmadığımdan dolayı 
kurulum kolaylığı için şimdilik görmezden gelelim.


## 4. Mimarinin YAML Formatında Hazırlanışı

Yavaş yavaş sunucumuzu ısıtmaya başlıyoruz. 
Öncelikle sunucumuzun uygun bir dizininde `docker-compose.yml` dosyasını barındıracak olan bir dizin yaratıyoruz. 
Ben root user ile girdiğim için home dizinim `/root` olarak tayin edilmiş. 
Bu dizine gidiyor ve `demoblog` isminde bir dizin oluşturuyorum ve içerisinde `docker-compose.yml` isminde 
bir boş dosya yaratıyorum.

```shell
mkdir /root/demoblog
cd /root/demoblog
touch docker-compose.yml
```

Daha sonra favori text editörümüz ile (nano, vi, vs) `docker-compose.yml` dosyasını açıp aşağıdaki içeriği yapıştıralım.

Bu dosyanın sizin için çalışır hale gelmesi için sadece `EMAIL=demoblog@serdarkuzucu.com` 
ve `URL=demoblog.serdarkuzucu.com` alanlarını değiştirmeniz yeterli olacaktır.

```yaml
version: "3.6"

services:
  db:
    image: mysql:5.7
    volumes:
      - type: bind
        source: /docker-storage/mysql
        target: /var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 43C61277714C73D141646AEB5F134B51
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: 43C61277714C73D141646AEB5F134B51
    networks:
      - blognet

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    volumes:
      - type: bind
        source: /docker-storage/wordpress
        target: /var/www/html
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: 43C61277714C73D141646AEB5F134B51
    networks:
      - blognet

  nginx:
    image: linuxserver/letsencrypt
    ports:
      - "80:80"
      - "443:443"
    networks:
      - blognet
    restart: always
    environment:
      - PGID=1001
      - PUID=1001
      - EMAIL=demoblog@serdarkuzucu.com
      - URL=demoblog.serdarkuzucu.com
      - VALIDATION=http
      - TZ=Europe/Istanbul
    volumes:
      - type: bind
        source: /docker-storage/nginx
        target: /config
    cap_add:
      - NET_ADMIN

networks:
  blognet:
    driver: overlay
```


## 5. İlk Çalıştırma

Gerekli docker imajlarının docker-hub'dan indirilmesi ve sistemin ilk çalışması için `docker-compose.yml` 
dosyasının bulunduğu dizine gidip `docker-compose up` komutunu çalıştırıyoruz:

```shell
cd /root/demoblog
docker-compose up
```

Önce aşağıdakine benzer loglar göreceksiniz konsolda. 
Bu loglar ilgili imajların sunucunuza download edilmesi ve container'ların yaratılmasını gösteriyor:

```text
WARNING: The Docker Engine you're using is running in swarm mode.

Compose does not use swarm mode to deploy services to multiple nodes in a swarm. All containers will be scheduled on the current node.

To deploy your application across the swarm, use `docker stack deploy`.

Creating network "demoblog_blognet" with driver "overlay"
Pulling db (mysql:5.7)...
5.7: Pulling from library/mysql
5e6ec7f28fb7: Pull complete
4140e62498e1: Pull complete
e7bc612618a0: Pull complete
1af808cf1124: Pull complete
ff72a74ebb66: Pull complete
3a28cb03e3dc: Pull complete
2b52dda3bd7d: Pull complete
dd1e5bc08c44: Pull complete
2cbf322d346d: Pull complete
7193a395fe03: Pull complete
d177f9940737: Pull complete
Pulling wordpress (wordpress:latest)...
latest: Pulling from library/wordpress
5e6ec7f28fb7: Already exists
cf165947b5b7: Pull complete
7bd37682846d: Pull complete
99daf8e838e1: Pull complete
ae320713efba: Pull complete
ebcb99c48d8c: Pull complete
9867e71b4ab6: Pull complete
936eb418164a: Pull complete
5d9617dfb66b: Pull complete
8dd7afaae109: Pull complete
8f207844da7e: Pull complete
adb3ae5e4987: Pull complete
44d7d07029db: Pull complete
fb91064652b0: Pull complete
82c9b5a8edaa: Pull complete
e4dd0c780baf: Pull complete
7fffc6e7f6c5: Pull complete
f0ae5fa697b5: Pull complete
97328ab7f1f4: Pull complete
Pulling nginx (linuxserver/letsencrypt:)...
latest: Pulling from linuxserver/letsencrypt
238a51429c53: Pull complete
0683a10793b6: Pull complete
de3626289736: Pull complete
95c6c6a9162f: Pull complete
d406f0fb0060: Pull complete
acf94a921b10: Pull complete
66ea58380f91: Pull complete
Creating demoblog_db_1    ... done
Creating demoblog_nginx_1     ... done
Creating demoblog_wordpress_1 ... done
```

Daha sonra container'ların logları görülecek. 
5-6 dakika gibi uzunca bir süre beklemeniz gerekebilir çünkü nginx container'ının letsencrypt.org'dan 
sertifika oluşturması biraz zaman alıyor.

Tüm container'lar ayağa kalktığında en son şu logu göreceksiniz:

```text
nginx_1      | [services.d] done.
nginx_1      | Server ready
```

Bu aşamadan sonra tarayıcımızda blog adresimize https şemasıyla gidersek aşağıdaki gibi bir sayfa göreceğiz:

![nginx is up](/assets/posts/nginx-is-up-https.png)

Adres çubuğundaki yeşil kilit simgesi ne de güzel parlıyor değil mi? 
Bu letsencrypt üzerinden aldığımız sertifikanın başarıyla alan adımıza kurulduğunu gösteriyor.

Peki şimdiye kadar ne elde ettik? Bir bakalım:

* Geçerli bir ssl sertifikası ile https üzerinden iletişim kurabildiğimiz bir nginx sunucumuz var 
fakat wordpress ile iletişim halinde değil.
* Eğer https yerine http ile blogumuza erişmek istersek nginx'in http portunu dinlemediğini göreceğiz. 
Bu da adresinizi ezbere bilen okuyucularınızın yanlışlıkla http adrese girdiklerinde blogunuza 
ulaşamamasına sebep olacaktır.
* Bir wordpress/apache kurulumumuz var fakat dışarıya açmadığımız için tarayıcımızdan erişemiyoruz.
* Wordpress tarafından okunabilen bir mysql sunucumuz var, bunu da dışarıya açmadığımız için 
kendi hallerinde takılıyorlar.

Yazının devamında bu eksiklikleri gidereceğiz.


## 6. Reverse Proxy ve Http-&gt;Https Yönlendirme

Öncelikle yukarıdaki adımlarda geldiğimiz son noktada `docker-compose up` demiştik 
ve terminalimizde hala bu işlem açık durumda bekliyor. Klavyemizdeki `CTRL + C` tuşlarına birlikte 
basarak bu işlemi sonlandırıyoruz. 
Böylece açık olan uygulamalarımız da kapanmış oluyor.

Öncelikle Wordpress'in https reverse-proxy üzerinden gelen isteklerde sapıtmaması için `wp-config.php` dosyasında 
aşağıdaki satırları buluyoruz. `wp-config.php` dosyası şurada: `/docker-storage/wordpress/wp-config.php`

```php
/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
```

Bulduğumuz bu satırların hemen **üzerine** aşağıdaki kodu yapıştırıyoruz. Aman URL'leri değiştirmeyi unutmayın.

```php
# Begin: Modified by hand for https reverse-proxy
if ($_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')
    $_SERVER['HTTPS']='on';

if (isset($_SERVER['HTTP_X_FORWARDED_HOST'])) {
    $_SERVER['HTTP_HOST'] = $_SERVER['HTTP_X_FORWARDED_HOST'];
}
if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $list = explode(',',$_SERVER['HTTP_X_FORWARDED_FOR']);
    $_SERVER['REMOTE_ADDR'] = $list[0];
}
define('WP_HOME','https://demoblog.serdarkuzucu.com');
define('WP_SITEURL','https://demoblog.serdarkuzucu.com');
define('FORCE_SSL_ADMIN', true);
# End: Modified
```

`wp-config.php` dosyasıyla işimiz bu kadar. Kaydedip dosyayı kapatabilirsiniz.

Şimdi sıra nginx konfigürasyonunu düzeltmeye geldi. 
Şu dosyayı favori text editörümüzle açalım: `/docker-storage/nginx/nginx/site-confs/default`

İçindeki her şeyi silip aşağıdaki kodu yapıştıralım. 
Adresleri yine değiştirmeyi unutmayın aman diyeyim.

```nginx
# Redirect all http:80 requests to https!
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;
        return 301 https://$host$request_uri;
}

# Default Server will redirect us to demoblog.serdarkuzucu.com
server {
        listen 443 ssl default_server;
        server_name _;
        # all ssl related config moved to ssl.conf
        include /config/nginx/ssl.conf;
        return 301 https://demoblog.serdarkuzucu.com;
}

# Blog Reverse Proxy
server {
        listen 443 ssl;
        server_name demoblog.serdarkuzucu.com;

        # all ssl related config moved to ssl.conf
        include /config/nginx/ssl.conf;

        client_max_body_size 0;

        location / {
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Host $host;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_pass http://wordpress:80;
        }
}
```

Bu dosyayı da kaydedip kapatalım. Şimdi sistemi ayağa kaldırma vakti. 
`docker-compose.yml` dosyamızı koyduğumuz yeri unutmadınız değil mi? 
O dizine `cd /root/demoblog` komutuyla geri dönüyoruz ve aşağıdaki komutla sistemi başlatıyoruz. 
Bu sefer tüm logları terminalde görmeyeceğiz çünkü detached modda başlatıyoruz.

```shell
docker-compose up -d
```

Terminalde sadece şu logları göreceğiz, sonra komut terminal oturumumuzu özgür bırakacak:

```text
WARNING: The Docker Engine you're using is running in swarm mode.

Compose does not use swarm mode to deploy services to multiple nodes in a swarm. All containers will be scheduled on the current node.

To deploy your application across the swarm, use `docker stack deploy`.

Starting demoblog_nginx_1 ... done
Starting demoblog_db_1    ... done
Starting demoblog_wordpress_1 ... done
```

Bir süre container'lar açılsın diye bekledikten sonra blog adresimizi tarayıcımızda açarsak artık nginx 
hata sayfası yerine wordpress kurulum ekranının açıldığını göreceğiz.

![Worpress is up](/assets/posts/wp-is-up-https.png)

Wordpress kurulumunda bundan sonrasını siz halledersiniz. Gerisi next, next, next :)

Eğer aynı adrese http şemasıyla girersek, 
nginx'e yaptığımız konfigürasyon sayesinde sitenin https'e yönlendirdiğini görebiliriz.

Biraz daha ileri gidip, `reboot` komutu ile sunucuyu yeniden başlattım. 
Sunucu tekrar açıldığında tüm container'ların da açılmış olduğunu 
ve sistemin çalışır vaziyette olduğunu test etmiş oldum.


## 7. Bitirirken

Pek çok teknolojiyi detaylarına pek az hakim olarak bir arada çalıştırdık. 
Ufak tefek birkaç not düşüp konuyu artık daha fazla uzatmayacağım.

Mysql container'ından hiçbir portu dışarıya açmadık. 
Bu doğrudan veritabanınıza gelebilecek saldırıları engeller.

Wordpress/Apache container'ının üzerinden de hiç bir portu dışarıya açmadık. 
Böylece IP:PORT şeklinde sunucunuzdaki apache'ye doğrudan saldırganların gelmesini engellemiş olduk.

Letsencrypt üzerinden oluşturulan sertifikaların geçerlilik tarihi 90 gündür. 
nginx container'ını oluştururken kullandığımız `linuxserver/letsencrypt` imajını oldukça başarılı hazırlamışlar, 
sertifika bitiş tarihi gelirken otomatik olarak sertifikayı yeniliyor. 
Böylece sertifika yenileme ile de uğraşmamış oluyoruz.

Sunucunuzu yeni aldığınızda root kullanıcısı dışında sudo yetkisi olan başka bir kullanıcı oluşturun 
ve mümkünse root kullanıcısını ssh ile login olmaya kapatın. 
Sunuculara yapılan otomatikleştirilmiş saldırıların çoğu root kullanıcısına gelir.

Bu gecelik söyleyeceklerim veya söylemeyi planladıklarımdan hatırlayabildiklerim bu kadar. Kodlu geceler.
