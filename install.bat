@echo off
REM Testclaw installer for Windows — requires Python 3.8+ in PATH.
setlocal
where python >nul 2>nul
if errorlevel 1 (
  echo Python 3 is required. Install it from https://www.python.org/downloads/
  echo Make sure "Add python.exe to PATH" is checked during setup.
  pause
  exit /b 1
)
python "%~dp0setup.py" %*
pause
