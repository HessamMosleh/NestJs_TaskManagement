import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
// @UseGuards(AuthGuard()) We can use it here to apply to whole controller
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() authcredentials: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authcredentials);
  }

  @Post('/signing')
  @UsePipes(ValidationPipe)
  signIn(
    @Body() authcredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signing(authcredentials);
  }
}
