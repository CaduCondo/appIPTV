@echo off
cd /d "%~dp0"
title Cinema Livre
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8080/
  py servidor.py
  goto :fim
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8080/
  python servidor.py
  goto :fim
)
echo.
echo Python nao encontrado. Instale em https://www.python.org/downloads/ (marque "Add python.exe to PATH")
echo ou abra index.html direto no Chrome e importe a lista por arquivo .m3u.
echo.
pause
:fim
