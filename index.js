const net = require("net");
const fs = require("fs");

const statusLine = "HTTP/1.1 200 OK\r\n";
const badRequest = "HTTP/1.1 400 Bad Request\r\n";
const header = "Host: AppServer\r\n";
const htmlPath = "./public/index.html";

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
    const buf = fs.readFileSync(path);
    const html = buf.toString();
    return html;
  } catch (e) {
    console.error(e);
  }
};

const createResponse = (status, body) => {
  return (response = status + header + "\r\n" + body + "\r\n");
};

const imgPathToBase64 = (html) => {
  const target = /img\.png/g;
  const base64data = fs.readFileSync("./public/img.png", {
    encoding: "base64",
  });
  const newHtml = html.replace(target, "data:image/png;base64," + base64data);
  return newHtml;
};

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    // console.log(data.toString());
    const event = requestParse(data.toString());

    let response = "";
    const [path, method] = [event["path"], event["httpMethod"]];
    switch (path) {
      case "/index.html":
        if (method === "GET") {
          let html = getHtmlContent(htmlPath);
          response = createResponse(statusLine, imgPathToBase64(html));
        } else {
          response = createResponse(badRequest, "Bad Request");
        }
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
          const hand = event["params"]["hand"];
          response = createResponse(statusLine, getResult(hand));
        } else {
          response = createResponse(badRequest, "Bad Request");
        }
        break;
      default:
        response = createResponse(statusLine, "HELLO WORLD");
    }

    socket.write(response);
    socket.end();
  });
});

server.listen(8080);

module.exports = {
  requestParse: requestParse,
  getHtmlContent: getHtmlContent,
  createResponse: createResponse,
  imgPathToBase64: imgPathToBase64,
};
