@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://127.0.0.1:8000/
  py -m http.server 8000
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://127.0.0.1:8000/
  python -m http.server 8000
  goto :eof
)
echo Python n'est pas installe ou introuvable.
echo Installe Python depuis https://www.python.org/downloads/windows/
echo Puis relance ce fichier.
pause
