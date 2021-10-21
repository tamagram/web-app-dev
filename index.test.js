const { requestParse } = require("./index");

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
    console.log(got);
    expect(got).toStrictEqual(want);
  });
});
