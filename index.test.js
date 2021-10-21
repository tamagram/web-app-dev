const { requestParse } = require("./index");

describe("test requestParse", () => {
  test("should return the request context", () => {
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
    console.log(got);
    expect(got).toStrictEqual(want);
  });
});
