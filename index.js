const net = require("net");

const statusLine = "HTTP/1.1 200 OK\r\n";
const header = "Host: AppServer\r\n";

const server = net.createServer((socket) => {
  console.log("通信きたよ!");

  socket.on("data", (data) => {
    console.log(data.toString());

    let response = "";

    response = statusLine + header + "\r\n" + "HELLO WORLD!\r\n";

    socket.write(response);
    socket.end();
  });
});

server.listen(8080);
