const net = require("net");

const {
  requestParse,
  getHtmlContent,
  createResponse,
  imgPathToBase64,
} = require("./index");

const statusLine = "HTTP/1.1 200 OK\r\n";
const badRequest = "HTTP/1.1 400 Bad Request\r\n";
const header = "Host: AppServer\r\n";
const htmlPath = "./public/index.html";

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
