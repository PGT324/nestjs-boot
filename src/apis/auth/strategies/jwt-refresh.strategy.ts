import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

// import { Strategy } from 'passport-kakao' 카카오 패스포트도 가져와서 사용가능

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      }, //access Token
      secretOrKey: '나의리프레시비밀번호',
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
