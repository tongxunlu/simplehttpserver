# simplehttpserver

simplehttpserver 是一个基于 Node.js 的简单静态文件服务器。

## 使用方法

1. 将项目文件直接放到需要的目录中。
2. 执行 start.bat 文件，在执行成功后会自动打开默认浏览器。

你也可以在命令行直接执行以下命令：

node simplehttpserver.js


这将以默认端口运行服务器，并将当前目录作为根目录进行服务。

如果你希望指定端口和根目录，可以使用以下命令：

node simplehttpserver.js <port> <path>


其中 `<port>` 是服务器要监听的端口号，`<path>` 是要作为根目录的路径。

例如，要在端口号 7001 上运行服务器，并将 `C:\path\` 目录作为根目录，可以执行以下命令：

node simplehttpserver.js 7001 C:\path\

或者
node simplehttpserver.js 7001 ../path/


## 注意事项

请确保在运行服务器之前正确安装了 Node.js 环境。
