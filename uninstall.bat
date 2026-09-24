@echo off
REM Testclaw uninstaller for Windows — requires Python 3.8+ in PATH.
setlocal
where python >nul 2>nul
if errorlevel 1 (
  echo Python 3 is required. Install it from https://www.python.org/downloads/
  pause
  exit /b 1
)
python "%~dp0uninstall.py" %*
pause
