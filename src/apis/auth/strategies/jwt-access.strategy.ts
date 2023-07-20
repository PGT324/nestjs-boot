import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// import { Strategy } from 'passport-kakao' 카카오 패스포트도 가져와서 사용가능

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      //   jwtFromRequest: (req) => {
      //     const temp = req.headers.Authorization; // Bearer adfejfiwfjkdls
      //     const accessToken = temp.toLowercase().replace('bearer ', '');
      //     return accessToken;
      //   }, //access Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '나의비밀번호',
    });
  }

  validate(payload) {
    console.log(payload); // { sub: 우리가 넣은 데이터 }
    return {
      id: payload.sub,
    };
    // => req.user = { id: payload.sub }
  }
}
