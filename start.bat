@echo off
REM 设置控制台代码页为 UTF-8 编码
chcp 65001 >nul
REM ====================================================================================
REM 端口,绝对路径
REM node simplehttpserver.js 7001 G:\project_home\2023-o2o+yongyou\wuliu-yueche\
REM 端口,相对路径
REM node simplehttpserver.js 7001 ../wuliu-yueche/
REM ====================================================================================

REM 判断 Node.js 环境是否安装了 mime 模块,调用 Node.js 解释器执行命令来检查模块是否已安装
node -e "require('mime')" >nul 2>&1

REM 判断返回值，如果错误级别为 0 表示模块存在
if %errorlevel% equ 0 (
    node simplehttpserver.js
) else (
    echo mime模块没有安装，开始安装...
    REM 使用循环来检查安装状态，直到安装完成为止
    call npm install mime -g
    :waitForInstallation
    REM 调用 Node.js 解释器执行命令来检查模块是否已安装
    node -e "require('mime')" >nul 2>&1
    REM 判断返回值，如果错误级别为 0 表示安装成功，执行 http.js
    if %errorlevel% equ 0 (
        echo mime 安装成功,启动服务器
        node simplehttpserver.js
    ) else (
        ping 127.0.0.1 -n 1 >nul
        goto waitForInstallation
    )
)
echo 结束
REM 暂停运行，以便查看结果
pause
exit /b
