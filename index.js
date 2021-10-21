const net = require("net");
const fs = require("fs");

const statusLine = "HTTP/1.1 200 OK\r\n";
const badRequest = "HTTP/1.1 400 Bad Request\r\n";
const header = "Host: AppServer\r\n";

const requestParse = (data) => {
  const [requestHeaders, requestParams] = data.split("\n\r\n");
  const headers = requestHeaders.split("\n");
  const params = requestParams ? requestParams.split("&") : [];

  let event = {};
  [event["httpMethod"], event["path"], event["protocol"]] =
    headers[0].split(" ");

  headers.slice(1).forEach((header) => {
    let [key, ...value] = header.split(":");
    if (key) {
      if (value !== undefined) {
        value = value.join(":");
        value = value.trim();
        event[key] = value;
      }
    }
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

const getHtmlContent = (path) => {
  try {
    buf = fs.readFileSync(path);
    html = buf.toString();
    return html;
  } catch (e) {
    console.error(e);
  }
};

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    // console.log(data.toString());
    const event = requestParse(data.toString());

    let response = "";
    const [path, method] = [event["path"], event["httpMethod"]];
    switch (path) {
      case "/index.html":
        const path = "./public/index.html";
        response = statusLine + header + "\r\n" + getHtmlContent(path) + "\r\n";
        break;
      case "/janken":
        const getResult = (hand) => {
          const hands = { "グー": 0, "チョキ": 1, "パー": 2 };
          const you = hands[hand];
          const opponent = Math.floor(Math.random() * 3);
          switch (you - opponent) {
            case -1:
            case 2:
              return "勝ち";
            case 1:
            case -2:
              return "負け";
            default:
              return "あいこ";
          }
        };
        if (method === "POST") {
          console.log(event);
          const hand = event["params"]["hand"];
          response = statusLine + header + "\r\n" + getResult(hand) + "\r\n";
        } else {
          response = badRequest + header + "\r\n" + "Bad Request\r\n";
        }
        break;
      default:
        response = statusLine + header + "\r\n" + "HELLO WORLD!\r\n";
    }

    socket.write(response);
    socket.end();
  });
});

server.listen(8080);

module.exports = {
  requestParse: requestParse,
  getHtmlContent: getHtmlContent,
};
