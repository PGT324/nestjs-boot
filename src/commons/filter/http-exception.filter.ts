import { HttpException, ExceptionFilter, Catch } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const message = exception.message;

    console.log(status);
    console.log(message);
  }
}
