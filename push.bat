@echo off
title Push PhobDan to GitHub
cd /d "%~dp0"
echo ===========================================
echo   Pushing PhobDan code to GitHub...
echo ===========================================
git push -u origin main
echo.
echo ===========================================
echo   Finished! Press any key to exit.
echo ===========================================
pause
