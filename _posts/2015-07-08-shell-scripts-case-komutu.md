---
layout: post
title:  "Shell Scripts: Case Komutu"
date:   2015-07-08 02:41:00 +0300
categories: [Bash, Programlama, Linux]
author: Serdar Kuzucu
permalink: /shell-scripts-case-komutu
comments: true
post_identifier: shell-scripts-case-komutu
featured_image: /assets/category/bash.png
---

[Linux Shell Script Geliştirmek](/linux-shell-script-gelistirmek) diye başladığım yazı dizisinin 
bir diğer yazısında daha birlikteyiz. `if/elif/else` komutlarını sık sık kullanmaya başladığınızda farkedeceksiniz ki, 
bir çok zaman tek bir değişkenin değerini kontrol ediyoruz. 
Örneğin komut satırından gelen parametrenin değeri 1 ise şunu yap, 2 ise bunu yap, 3 ise başka birşey yap. 
Böyle tek bir değişkeni kontrol etmemiz gerektiğinde `if/elif/else` yazmak çok sıkıcı bir hale dönüşebiliyor. 
Peki değişkenin ismini sadece bir kere yazsak ve alabileceği her değer için sadece çalışacak kodları söylesek?

<!--more-->

Bu gibi durumlarda işimizi kolaylaştırması için `case` adında hoş bir kontrol komutumuz var. 
Örneğin komut satırından geçilen bir parametrenin değeri "disk" ise disk istatistiklerini, 
"memory" ise bellek istatistiklerini göstermek istiyorsunuz.
Şu şekilde yazabilirsiniz bu programı:

```bash
#!/bin/bash
# HelloWorld Application 7
# case

case $1 in
    disk   ) df ;;
    memory ) free ;;
    *      ) echo "Please enter disk or memory" ;;
esac
```

Bu programı case ismiyle kaydedip daha sonra `./case disk` diye çalıştırırsak, `df` komutu çalışacak. 
`./case memory` şeklinde çalıştırırsak, `free` komutu çalışacak. 

Eğer başka bir parametre ile çağırırsak, hata mesajı gösterilecek. 
En sonraki "*" anahtar kelimesi, disk ve memory dışındaki herşeyle eşleşiyor.

Aşağıdaki şekilde uzun uzun yazmak da mümkün. 
Her bir durum için birden fazla komut girilebilir.

```bash
#!/bin/bash
# HelloWorld Application 8
# case

case $1 in
    disk )
        echo "Disk stats will be printed."
        df 
        echo "Disk stats were printed."
        ;;
    memory )
        echo "Memory stats were printed."
        free
        echo "Memory stats were printed."
        ;;
    * )
        echo "Please enter disk or memory"
        ;;
esac
```

Örneğin komut satırından alacağımız 5 tane parametre olsun fakat bu parametrelerin sırası bizi hiç ilgilendirmesin. 
Mesela bilgisayarımızda o anda çalışan işlemlerin kaydını bir dosyaya yazalım.

* Programımızın ismi processes olsun
* `-f filename` parametresi geçilirse kullanıcının girdiği isimde bir dosya yaratılsın ve output oraya kaydedilsin.
* Dosya ismi parametre geçilmezse, şu anki tarih ve saat ile bir dosya yaratalım.
* `-z` parametresi geçilirse outputu kaydettiğimiz dosyayı gzip ile zipleyelim.
* `-p` parametresi geçilirse outputu ekrana da yazdıralım.
* `-q searchString` parametresi girilirse, içinde sadece aranan keyword geçen processlerin outputu alalım.
* `--help` parametresi girilirse, programın nasıl kullanılacağını anlatan bir metin gösterip diğer parametreleri yoksayacağız.

Anlayacağınız üzere, komut satırından birkaç tane parametre gelişigüzel girilecek. 
Girilip girilmemeleri ve hangi sırayla girilecekleri tamamen kullanıcıya kalmış.

```bash
#!/bin/bash
# Learning case/esac

DATE=$(date +"%Y_%m_%d-%H_%M_%S")
output_file="proc_$DATE"

useGzip="false"
printOutput="false"
searchText=""

# Read all parameters
until [[ "$#" = "0" ]]; do
    case "$1" in
        -f )
            shift
            output_file="$1"
            ;;
        -z )
            useGzip="true"
            ;;
        -p )
            printOutput="true"
            ;;
        -q )
            shift
            searchText="$1"
            ;;
        --help|* )
            echo "Welcome to our little processes program"
            echo "Here are some options you may like:"
            echo "    -f <filename>  : change the name of output file"
            echo "    -z             : gzip the output file"
            echo "    -p             : print the output to the console"
            echo "    -q <searchTxt> : show lines only containing searchTxt"
            echo "    --help         : prints this help message"
            exit
            ;;
    esac
    
    shift
done

processes=""

# Does user want filtering the output?
if [[ "$searchText" = "" ]]; then
    # No filtering
    processes=$(ps -ef)
else
    # Filter lines using grep and searchText
    processes=$(ps -ef | grep "$searchText")
fi

# Should I print output to console?
if [[ "$printOutput" = "true" ]]; then
    echo "$processes"
fi

# Write output to the file
echo "$processes" > "$output_file"

# Should I use gzip?
if [[ "$useGzip" = "true" ]]; then
    # Gzip the output file
    gzip "$output_file"
fi
```

Döngü ile parametreleri okuyup parametreleri `shift` komutuyla kaydırmayı 
[While ve Until Döngüleri](/shell-scripts-while-ve-until-donguleri) isimli yazımda yazmıştım. 
Yukarıdaki until döngüsü de aynı şekilde shift yöntemi ile tüm parametreleri okuyor 
ve parametrelerin değerini kontrol etmek için `case` komutunu kullanıyor. 
Parametrelerin değerlerini kontrol ettikten sonra uygun değişkenlerin değerlerini değiştiriyoruz. 
Örneğin `-p` parametresini gördüğümüzde, `printOutput` isimli değişkenin değerini `true` yapıyoruz. 
Programın ilerleyen kısımlarında bu değişkeni kontrol ediyoruz ve değeri `true` ise çıktıyı ekrana yazdırıyoruz.

Nasıl buldunuz `case` komutunu?
Parametreleri bu şekilde okuduğumuzda hem kullanıcıyı parametreleri belli bir sırayla girmek zorunda bırakmıyoruz, 
hem de kodumuz daha şık görünüyor. 
Bu programı aşağıdaki kombinasyonlarla kullanabilirsiniz:

```text
./processes -f myoutput.txt
./processes -z -p
./processes -q java -p -f javaprocesses.out
./processes --help
./processes -p -f somefile.log -z -q chrome
```

Eğer aynı bir işlemi birden fazla değerle yapmak istiyorsanız, 
bunu da pipe(`|`) işareti kullanarak belirtebiliyorsunuz. 
Mesela yukarıdaki kodda bazı alternatifler ekleyebiliriz. 
Aşağıdaki gibi, parametre seçeneklerimize eşanlamlı seçenekler ekleyelim:

* `-f` yerine `--file` kullanılabilsin.
* `-p` yerine `--print` kullanılabilsin.
* `-q` yerine `--query` kullanılabilsin.
* `-z` yerine `--zip` kullanılabilsin.

Bu durumda yukarıdaki kodun `case` kısmı aşağıdaki gibi şekillenecek:

```bash
case "$1" in
    -f|--file )
        shift
        output_file="$1"
        ;;
    -z|--zip )
        useGzip="true"
        ;;
    -p|--print )
        printOutput="true"
        ;;
    -q|--query )
        shift
        searchText="$1"
        ;;
    --help|* )
        echo "Welcome to our little processes program"
        echo "Here are some options you may like:"
        echo "    -f | --file <filename>    : change the name of output file"
        echo "    -z | --zip                : gzip the output file"
        echo "    -p | --print              : print the output to the console"
        echo "    -q | --query <searchTxt>  : show lines only containing searchTxt"
        echo "    --help                    : prints this help message"
        exit
        ;;
esac
```

Ve bu programı aşağıdaki şekillerde de kullanabiliyoruz artık:

```text
./processes --file myoutput.txt
./processes --zip --print
./processes --query java --print --file javaprocesses.out
./processes --help
./processes --print -f somefile.log -z --query chrome
```

Bu gecelik anlatmak istediklerim de bu kadar sayın seyirciler. 
Umarım işlerinizi çılgınca hızlandırabilecek Shell Script'ler yazabilirsiniz.
