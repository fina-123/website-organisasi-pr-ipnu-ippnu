@echo off
echo ==========================================
echo  Setup MySQL Database untuk IPNU IPPNU
echo ==========================================
echo.

echo [1/5] Inisialisasi MySQL...
cd "C:\Program Files\MySQL\MySQL Server 8.4\bin"
mysqld --initialize-insecure --console
echo.

echo [2/5] Install MySQL sebagai service...
mysqld --install MySQL80
echo.

echo [3/5] Start MySQL service...
net start MySQL80
echo.

echo [4/5] Buat database...
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS ipnu_ippnu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; SHOW DATABASES;"
echo.

echo [5/5] Import schema...
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root ipnu_ippnu < "%~dp0server\schema.sql"
echo.

echo ==========================================
echo  Setup Database Selesai!
echo ==========================================
echo.
echo Langkah selanjutnya:
echo 1. Jalankan backend: cd server ^& npm install ^& npm start
echo 2. Jalankan frontend: cd .. ^& npm install ^& npm run dev
echo.
pause