const
	http = require('http'),
	urlParser = require('url'),
	fs = require('fs'),
	path = require('path'),
	currentDir = process.cwd(),
    currentFolderName = path.basename(currentDir);
const mime = require('mime');


const { exec } = require('child_process');
const os = require('os');

// 运行时参数
const args = process.argv.slice(2);
const port = args[0] || 7001; // 默认端口号为 7001
const webDirectory = args[1] || currentDir; // 默认 web 目录为当前目录下


const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	blue: '\x1b[34m',
};

function logMessage(param) {

	const date = '[' + (new Date()) + ']';
	const coloredDate = colors.green + date + colors.reset;

	const method = '"' + param.request.method + '"';
	const coloredMethod = colors.blue + method + colors.reset;

	const coloredPathname = colors.blue + param.pathname + colors.reset;

	console.log(coloredDate + ' ' + coloredMethod + ' ' + coloredPathname);
	console.log("================================================================================================");
}

function handleRequest(request, response) {
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "OPTIONS, POST, GET",
		"Access-Control-Max-Age": 2592000, // 30 days
		/** add other headers as per requirement */
	};

	var urlObject = urlParser.parse(request.url, true);
	var pathname = decodeURIComponent(urlObject.pathname);


	0&&logMessage({request: request, pathname: pathname})
	// console.log('[' + (new Date()).toUTCString() + '] ' + '"' + request.method + ' ' + pathname + '"');

	var filePath = path.join(webDirectory, pathname);
	// 根据文件路径获取文件的扩展名
	let extname = path.extname(filePath).toLowerCase();

	try {
		// 检查json文件是否存在并可访问
		fs.accessSync(filePath + ".json", fs.constants.F_OK);
		filePath = filePath + ".json";

	} catch (error) {
	}

	fs.stat(filePath, function (err, stats) {
		// 设置允许跨域访问的响应头
		response.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		response.setHeader('Access-Control-Allow-Origin', '*');
		response.setHeader('Access-Control-Allow-Headers', '*')


		if (err) {
			response.writeHead(404, {});
			response.end('File not found!');
			return;
		}

		if (stats.isFile()) {

			fs.readFile(filePath, function (err, data) {

				if (err) {
					response.writeHead(404, {});
					response.end('Opps. Resource not found');
					return;
				}

				// json文件直接打开,不要下载
				if (filePath.indexOf(".json") > 0) {
					extname = "json"
				}
				// 非常规类型,直接下载
				const contentType = mime.getType(extname) || 'application/octet-stream';
				// 设置正确的编码方式
				let charset = ';charset=utf-8';
				response.writeHead(200, {'Content-Type': contentType + charset});

				response.write(data);
				response.end();
			});

		} else if (stats.isDirectory()) {

			fs.readdir(filePath, function (error, files) {

				if (error) {
					response.writeHead(500, {});
					response.end();
					return;
				}

				var l = pathname.length;
				if (pathname.substring(l - 1) != '/') pathname += '/';

				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write('<!DOCTYPE html>\n<html><head><meta charset="UTF-8"><title>' + currentFolderName+" "+request.headers.host + '</title></head><body>');


				response.write(`
				 <style>
				 	body{min-width: 1000px}
					 .ul {
						display: flex;
						flex-wrap: wrap; 
						justify-content: flex-start; 
						list-style:none;font-family:courier new;
					 }

					.ul li {
						flex-basis: calc(10% - 10px); 
						margin-bottom: 20px; 
						text-align: center;
					}
					.ul li a{
						word-break: break-all;
						display: block;
						
					}
					.ul li i{
						display: block;
						margin: 0 auto;
						vertical-align: -9px
					}
					.icon-folder {
					  width: 30px;
					  height: 30px;
					  
					  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Cpath d='M2,5 L14,5 C15.1045695,5 16,5.8954305 16,7 L16,10 L26,10 C27.1045695,10 28,10.8954305 28,12 L28,26 C28,27.1045695 27.1045695,28 26,28 L4,28 C2.8954305,28 2,27.1045695 2,26 L2,5 Z' fill='%23f0d39a'/%3E%3Cpath d='M16,5 L14,5 C12.8954305,5 12,5.8954305 12,7 L12,10 L16,10 L16,5 Z' fill='%23e8c487'/%3E%3Cpath d='M4,26 L26,26 C26.5522847,26 27,25.5522847 27,25 L27,12 C27,11.4477153 26.5522847,11 26,11 L4,11 C3.44771525,11 3,11.4477153 3,12 L3,25 C3,25.5522847 3.44771525,26 4,26 Z' fill='%23f2e6c6'/%3E%3Crect x='7' y='17' width='16' height='2' rx='1' fill='%23EAC674'/%3E%3Crect x='7' y='21' width='16' height='2' rx='1' fill='%23EAC674'/%3E%3Crect x='7' y='13' width='16' height='2' rx='1' fill='%23EAC674'/%3E%3C/svg%3E");
					}
					.icon-file {
					  width: 30px;
					  height: 30px;
					  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Crect width='22' height='26' x='4' y='2' rx='2' fill='%230078D7' stroke='%230078D7' stroke-width='1'/%3E%3Cpath fill='%23FFFFFF' d='M18,2H6C4.897,2,4,2.897,4,4v22c0,1.103,0.897,2,2,2h18c1.103,0,2-0.897,2-2V10L18,2z M20,24H8v-1h12V24z M20,21H8 v-1h12V21z M20,18H8v-1h12V18z M20,15H8v-1h12V15z M20,12H8V11h12V12z' stroke='%230078D7' stroke-width='1'/%3E%3C/svg%3E");
					}

					</style>
				`)


				response.write('<h1>' + filePath + '</h1>');
				response.write('<ul class="ul">');
				files.unshift('.', '..');
				files.forEach(function (item) {

					var urlpath = pathname + item,
						itemStats = fs.statSync(webDirectory + urlpath);

					if (itemStats.isDirectory()) {
						urlpath += '/';
						// 添加文件夹图标
						// html += '<li><img src="folder-icon.png" alt="Folder Icon" width="20" height="20">';
						response.write('<li><a href="' + urlpath + '"><i class="icon-folder"></i>' + item + '</a></li>');
					} else {
						// 添加文件图标
						// html += '<li><img src="file-icon.png" alt="File Icon" width="20" height="20">';
						response.write('<li><a href="' + urlpath + '"><i class="icon-file"></i>' + item + '</a></li>');
					}

					// response.write('<li><a href="'+ urlpath + '">' + item + '</a></li>');
				});

				response.end('</ul></body></html>');
			});
		}
	});


}

http.createServer(handleRequest).listen(port);

require('dns').lookup(require('os').hostname(), function (err, addr, fam) {

	console.log('Running at http://' + addr + ((port === 80) ? '' : ':') + port + '/');
// 在服务器启动后，获取服务器地址和端口
	const url = 'http://' + addr + ((port === 80) ? '' : ':') + port + '/';

// 根据操作系统选择不同的命令
	let command;
	if (os.platform() === 'win32') {
		command = `start "" /b "${url}"`;
	} else if (os.platform() === 'darwin') {
		command = `open -g ${url}`;
	} else {
		command = `xdg-open ${url}`;
	}

	// 使用 child_process.exec 执行命令打开默认浏览器
	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`打开默认浏览器失败: ${error.message}`);
			return;
		}
		console.log('server has started...');
		console.log('Base directory at ' + webDirectory);
	});



});


