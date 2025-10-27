@echo off
echo ========================================
echo Fixing Windows Firewall for Python
echo ========================================
echo.
echo This will allow Python through Windows Firewall...
echo.
pause

netsh advfirewall firewall add rule name="Python Development Server" dir=in action=allow program="%CD%\server.py" enable=yes

echo.
echo ========================================
echo Firewall rule added!
echo Now try running START-SERVER.bat again
echo ========================================
pause

