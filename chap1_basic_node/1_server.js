const http = require('http');
const url = require('url');

// localhost => 127.0.0.1 : loop back => 서버를 실행한 컴퓨터
const host = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
  const path = url.parse(req.url).pathname;
  // url을 사용해서 path를 가져올 수 있다. 이 path에 따라 다른 값을 res 해줄 수 있겠지.
  // 아래처럼 계속 하면 복잡하지 않을까? => express, nest 등 프레임워크의 필요성
  if (path === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello World!</h1>');
  } else if (path === '/home') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello Home!</h1>');
  }
});

server.listen(port, host, () => {
  console.log('server running on localhost 3000')
});