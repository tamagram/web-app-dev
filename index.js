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

module.exports = {
  requestParse: requestParse,
  getHtmlContent: getHtmlContent,
  createResponse: createResponse,
  imgPathToBase64: imgPathToBase64,
};
