const net = require("net");

const statusLine = "HTTP/1.1 200 OK\r\n";
const header = "Host: AppServer\r\n";

const requestParse = (data) => {
  const requestHeaders = data.split("\n").map((requestHeader) => requestHeader);
  let event = {};
  [event["httpMethod"], event["path"], event["protocol"]] =
    requestHeaders[0].split(" ");
  requestHeaders.slice(1).forEach((header) => {
    let [key, ...value] = header.split(":");
    if (value === undefined) {
      value = "";
    } else {
      value = value.join(":");
    }
    value = value.trim();
    event[key] = value;
  });
  return event;
};

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log(data.toString());

    let response = "";

    response = statusLine + header + "\r\n" + "HELLO WORLD!\r\n";

    socket.write(response);
    socket.end();
  });
});

server.listen(8080);

module.exports = {
  requestParse: requestParse,
};
