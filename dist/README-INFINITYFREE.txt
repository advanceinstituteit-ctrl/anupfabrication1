==============================================================
ANUP FABRICATION - INFINITYFREE DEPLOYMENT INSTRUCTIONS
==============================================================

Agar aap InfinityFree per website upload kar rahe hain, toh DHYAN SE padhein:

1. InfinityFree File Manager mein login karein.
2. Apne domain ke folder mein jakar "htdocs" folder open karein.
   (Path: /htdocs ya /anupfabrication.infinityfreeapp.com/htdocs)
3. Agar htdocs ke andar pehle se koi default file hai (jaise default.php ya index2.html),
   toh use delete kar dein.
4. IS FOLDER ("dist") KE ANDAR JO BHI HAI, SIRF UNHI KO UPLOAD KAREIN:
   - index.html   --> htdocs/index.html hona chahiye
   - .htaccess    --> htdocs/.htaccess hona chahiye
   - assets/      --> htdocs/assets/ folder hona chahiye

NOTE: Pure project ko ya "dist" naam ke folder ko htdocs mein upload MAT karein!
Sirf dist ke ANDAR ki files ko htdocs ke andar dalna hai.

Agar 403 Forbidden error aaye, toh iska matlab:
- htdocs ke direct root me index.html nahi hai (kisi subfolder me chali gayi hai), YA
- Aapne abhi-abhi domain banaya hai aur InfinityFree ka DNS activate hone me 10-15 minute lagte hain.
==============================================================
