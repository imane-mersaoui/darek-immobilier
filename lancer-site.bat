@echo off
chcp 65001 >nul
title Darek - serveur local
cd /d "%~dp0"
echo.
echo  Darek - lancement du site sur http://localhost:8000
echo  (laissez cette fenetre ouverte, fermez-la pour arreter le site)
echo.
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8000/index.html
  python -m http.server 8000
  goto :eof
)
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8000/index.html
  py -m http.server 8000
  goto :eof
)
where npx >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8000/index.html
  npx --yes http-server -p 8000 -c-1
  goto :eof
)
echo  Ni Python ni Node.js ne sont installes.
echo  Installez Node.js (https://nodejs.org) ou utilisez l'extension "Live Server" de VS Code.
pause
