@echo off
rem ---------------------------------------------------------------------------
rem  Atalho de um clique: sobe o servidor local e abre o navegador.
rem  Sem acentos de proposito - o console do Windows nao le UTF-8 por padrao.
rem ---------------------------------------------------------------------------

title Apresentacoes Lesco
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   O Node.js nao foi encontrado nesta maquina.
  echo   Instale em https://nodejs.org e execute este arquivo de novo.
  echo.
  echo   Alternativa sem Node: abra index.html direto no navegador.
  echo.
  pause
  exit /b 1
)

node tools\serve.js 4321 --open
pause
