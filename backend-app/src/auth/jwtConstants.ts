export class JwtConstants {
  static secret = `mysecret${new Date().getDay()}`;
  static expireTime = `120s`;
}
