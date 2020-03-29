---
layout: post
title:  "Bitwise Operatörler"
date:   2012-01-21 17:47:00 +0300
categories: [Programlama, C++]
author: Serdar Kuzucu
permalink: /bitwise-operatorler/
comments: true
post_identifier: bitwise-operatorler
featured_image: /assets/posts/bitwise.jpg
---

Geçenlerde öğrendiğim ve bu döneme kadar daha önce hiç karşıma çıkmamış olan 
bit operatörlerini (Bitwise Operators) ve işlemlerini (Bitwise Operations), 
bir iki örnek üzerinde anlatmaya çalışacağım.

<!--more-->

### Öncelikle bit nedir ne değildir?

C gibi Java gibi programlama dillerinde veri türü olarak bizim karşımıza çıkmaz genellikle bitler.
Biz genellikle en küçük veri türü olarak byte kullanırız.
Mesela C dilinde bir karakter (char) 1 byte yer tutar. 
Biz biliyoruz ki bir byte da 8 bitten oluşur.
Bir bit de bir adet 1 veya 0'dan oluşur.
Örnek vermek gerekirse küçük a harfini tutan karakter şu 8 bitten meydana gelir: `01100001`

Bunu nasıl bulduğuma daha sonra geleceğiz.

Şimdi bytelar üzerinde bit bit işlemler yapabilmemiz için 
kullanabileceğimiz operatörlerden birkaç tanesine değineyim.

<table class="table table-bordered">
<thead>
<tr>
<th>Sembol</th>
<th>Anlamı</th>
</tr>
</thead>
<tbody>
<tr>
<td>&</td>
<td>bitwise AND</td>
</tr>
<tr>
<td>|</td>
<td>bitwise OR</td>
</tr>
<tr>
<td>&lt;&lt;</td>
<td>left shift</td>
</tr>
<tr>
<td>&gt;&gt;</td>
<td>right shift</td>
</tr>
</tbody>
</table>

### Sağa Kaydırma (Right Shift)

Bir bit bloğu üzerinde sağa kaydırma işlemi uyguladığımız zaman 
o blok üzerindeki tüm bitler bir sağ pozisyona geçerler. 
En sağdaki bit kaybolur, en soldan bir adet 0 eklenir. 
Örneğin elimizde 4 bitlik `1011` bloğunun olduğunu düşünelim. 
Bunu bir defa sağa kaydırdığımız zaman elimizdeki blok `0101` olur.

```c++
char c = 'a';    // 01100001
char b = c >> 1; // 00110000
```

Veya yeni bir değişken açmak yerine direk c'nin bitlerini bir birim sağa kaydırmak istiyorsak:

```c++
char c = 'a';
c >>= 1;
```

Bitlerin integer olarak ne anlama geldiğini de anlatalım.
Örneğin `01000101` byte'ını integer olarak açalım:

```text
01000101 = 
   = 0x2^7 + 1x2^6 + 0x2^5 + 0x2^4
      + 0x2^3 + 1x2^2 + 0x2^1 + 1x2^0
   = 0x128 + 1x64 + 0x32 + 0x16
      + 0x8 + 1x4 + 0x2 + 1x1
   = 0 + 64 + 0 + 0 + 0 + 4 + 0 + 1
   = 69
```

Yani bir byte'ı sağa kaydırırsak, onun integer değerini 2'ye bölmüş oluruz.

```text
01000101 = 69
00100010 = 34
```

### Sola Kaydırma (Left Shift)

Bir bit bloğu üzerinde sola kaydırma işlemi uyguladığımız zaman 
o blok üzerindeki tüm bitler bir sol pozisyona geçerler. 
En soldaki bit kaybolur, en sağdan bir adet 0 eklenir. 
Örneğin elimizde 4 bitlik `1011` bloğunun olduğunu düşünelim. 
Bunu bir defa sola kaydırdığımız zaman elimizdeki blok `0110` olur.

```c++
char c = 'a';    // 01100001
char b = c << 1; // 11000010
```

Veya yeni bir değişken açmak yerine direk c'nin bitlerini bir birim sola kaydırmak istiyorsak:

```c++
char c = 'a';
c <<= 1;
```

Bir byte'ı sola kaydırdığımızda, onun integer değerini 2 ile çarpmış oluruz.

```text
01000101 = 69
10001010 = 138
```

### VE Operatörü (Bitwise AND)

İki bit bloğundaki tüm bitleri sırasıyla VE bağlacı ile işleme sokmak için kullanılır. 
Birkaç örnek ile:

```text
0000 & 1111 = 0000
1100 & 1010 = 1000
0101 & 1010 = 0000
```

Bunu `&=` olarak da kullanabilirsiniz.
Örneğin:

```c++
char a = 16; // a = 00010000
char b = 48; // b = 00110000
b &= a;      // b = 00010000
```

### VEYA Operatörü (Bitwise OR)

İki bit bloğundaki tüm bitleri sırasıyla VEYA bağlacı ile işleme sokmak için kullanılır. 
Birkaç örnek ile:

```text
0000 | 1111 = 1111
1100 | 1010 = 1110
0101 | 1010 = 1111
```

Bu operatörü `|=` olarak da kullanabiliyoruz. 
Örnek vermek gerekirse:

```c++
char a = 16; // a = 00010000
char b = 32; // b = 00100000
b |= a;      // b = 00110000
```

Daha başka birçok operatör var bit işlemleri yapabileceğimiz lakin şimdilik bu kadar anlatıcaklarım.
Şimdi biraz örnek problem çözeyim.

**Problem 1:** Verilen bir karakterdeki (8 bit) tüm bitleri ekrana yazdıralım.

**Çözüm 1.1:** Bu konu ile ilgili ilk düşündüğüm şey recursive bir fonksiyon yardımı ile 
karakterin son bitini okuyup, sonra karakteri sağa kaydırmak. 
Sonra tekrar son biti okuyup, tekrar sağa kaydırmak. 
8 defa yaptığımızda bu işlemi, tüm bitleri okumuş olacağız. 
Lakin sondan başa doğru okuduğumuz için önce okuma işlemini yapacağız, sonra ekrana yazma işlemini. 
Recursive burada devreye giriyor. 
Çözüm 1.1 için yazdığım C++ kodunu göstereyim.

```cpp
#include <iostream>

void printBits(char c, int size=8) {
   if(size == 0) return;
   printBits(c>>1, size-1);
   if( (c&1) ) {
      cout << 1;
   } else {
      cout << 0;
   }
}

int main() {
   printBits('a'); // output: 01100001
   printBits(255); // output: 11111111
   return 0;
}
```

**Çözüm 1.2:** Bu yöntemi de üniversitedeki bir asistanımızın yazdığı bir örnek kodu incelerken buldum. 
Recursive kullanmadan, sırasıyla tüm bitleri, o bite denk gelen biti 1 olan bir byte ile 
& yaparak bir döngü ile yazdırıyoruz. 
Bunun için de kullanacağımız byte'lardan oluşan bir integer array'i yarattım. 
C++ koduna bakalım:

```cpp
#include <iostream>
void printBits2(char c) {
   int a[] = {128, 64, 32, 16, 8, 4, 2, 1};
   for(int i=0; i<8; i++) {
      if(c & a[i]) {
         cout << 1;
      } else {
         cout << 0;
      }
   }
}

int main() {
   printBits2('a'); // output: 01100001
   printBits2(255); // output: 11111111
}
```

**Problem 2:** Elimizde bir ve sıfırlardan oluşan bir string olsun. 
Bu string'deki 8 adet biti birbirine ekleyip bir byte elde edelim.

**Çözüm 2.1:** Öncelikle fonksiyonumuz boş bir karakter açacak. 
Boş karakterden kastım, tüm bitleri sıfır olan bir karakter. 
Daha sonra bir döngü içerisinde string'i baştan okuyacak, karaktere sondan ekleyecek. 
Burada anahtar nokta, elimizdeki karaktere sağdan bir bit eklemeden önce onu sola kaydırmak. 
Böylece sağında bir adet yeni bit oluşturuyoruz ve onu string'den gelen değere göre 1 veya 0 yapıyoruz. 
Yazdığım C++ kodunu ekleyeyim:

```cpp
#include <iostream>
char createByte(string s) {
   char rv = 0; // 00000000
   for(int i=0; i<s.length(); i++) {
      rv <<= 1; // Byte'ı sola kaydır.
      if(s[i] == '1') { // Sıradaki bit 1 ise
         rv |= 1; // byte'ın sağına bir ekle.
      }
   }
   return rv;
}

int main() {
   cout << createByte("01100001"); // output: a
   cout << endl;
   cout << createByte("01111000"); // output: x
   cout << endl;
}
```

**Çözüm 2.2:** Birinci problemin çözümünde kullandığımız integer dizisini kullanarak 
farklı bir döngü kurabiliriz mantığından yola çıkınca, böyle bir yöntem ortaya çıkıyor. 
Boş bir karakter yarattıktan sonra, string'i baştan okuyarak, 
karşımıza çıkan değeri 1 olan her bit için, 
integer dizisinde ona karşılık gelen biti 1 olan byte'ı karakterimize OR'luyoruz. 
Kodu göstereyim:

```cpp
#include <iostream>
char createByte2(string s) {
   char rv = 0; // 00000000
   int bits[] = {128, 64, 32, 16, 8, 4, 2, 1};
   for(int i=0; i<8; i++) {
      if( s[i] == '1' ) {
         rv |= bits[i];
      }
   }
   return rv;
}

int main() {
   cout << createByte2("01100001"); // output: a
   cout << endl;
   cout << createByte2("01111000"); // output: x
   cout << endl;
}
```

Bu yazı da buraya kadar. 
Eğer hatalıysam aramayın, yorum yapın, lütfen. 
İyi programlamalar dilerim efendim.
