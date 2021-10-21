const { requestParse, getHtmlContent, createResponse } = require("./index");

describe("test requestParse", () => {
  test("should return the get request context", () => {
    const data = `GET / HTTP/1.1
Host: localhost:8080
User-Agent: curl/7.68.0
Accept: */*`;
    const want = {
      "httpMethod": "GET",
      "path": "/",
      "protocol": "HTTP/1.1",
      "Host": "localhost:8080",
      "User-Agent": "curl/7.68.0",
      "Accept": "*/*",
    };
    const got = requestParse(data);
    // console.log(got);
    expect(got).toStrictEqual(want);
  });

  test("should return the post request context", () => {
    const data = `POST / HTTP/1.1
Host: localhost:8080
User-Agent: curl/7.68.0
Accept: */*
Content-Length: 11
Content-Type: application/x-www-form-urlencoded
\r
hand=グー`;
    const want = {
      "httpMethod": "POST",
      "path": "/",
      "protocol": "HTTP/1.1",
      "Host": "localhost:8080",
      "User-Agent": "curl/7.68.0",
      "Accept": "*/*",
      "Content-Length": "11",
      "Content-Type": "application/x-www-form-urlencoded",

      "params": {
        "hand": "グー",
      },
    };
    const got = requestParse(data);
    // console.log(got);
    expect(got).toStrictEqual(want);
  });
});

describe("test getHtmlContent", () => {
  test("should return html content", () => {
    const path = "./public/index.html";
    const want = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Hello, World!</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
`;
    const got = getHtmlContent(path);
    expect(got).toBe(want);
  });
});

describe("test createResponse", () => {
  test("should return http response", () => {
    const status = "HTTP/1.1 200 OK\r\n";
    const body = "hello world";
    const want = "HTTP/1.1 200 OK\r\nHost: AppServer\r\n\r\nhello world\r\n";
    const got = createResponse(status, body);
    console.log(got);
    expect(got).toBe(want);
  });
});
