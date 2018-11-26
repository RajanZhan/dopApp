@echo off
call npm run build-server
call  copy %cd%\config.json %cd%\build\config.json /A
call  copy %cd%\package.json %cd%\build\package.json /A
call  Xcopy %cd%\static %cd%\build\static\ /S /A /Y
call echo finished.
call pause