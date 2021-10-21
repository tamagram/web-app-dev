const net = require("net");

const statusLine = "HTTP/1.1 200 OK\r\n";
const header = "Host: AppServer\r\n";

const requestParse = (data) => {
  const [requestHeaders, requestParams] = data.split("\n\n");
  const headers = requestHeaders.split("\n");
  const params = requestParams ? requestParams.split("&") : [];

  let event = {};
  [event["httpMethod"], event["path"], event["protocol"]] =
    headers[0].split(" ");

  headers.slice(1).forEach((header) => {
    let [key, ...value] = header.split(":");
    if (value === undefined) {
      value = "";
    } else {
      value = value.join(":");
    }
    value = value.trim();
    event[key] = value;
  });

  if (0 < params.length) {
    event["params"] = {};
    params.forEach((param) => {
      let [key, value] = param.split("=");
      event["params"][key] = value;
    });
  }
  return event;
};

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log(data.toString());
    const event = requestParse(data.toString());

    switch (event["path"]) {
      case "/janken":
    }
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
