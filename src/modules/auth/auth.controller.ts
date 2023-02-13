import { Body, Controller, Get, Headers, Logger, Post, Response, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HeadersDTO } from 'src/utils/dto/headers.dto';
import { payloadResponse } from 'src/utils/response';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dto/auth.dto';
import { Tokens } from './jwt-token/payload';

@ApiTags('Authentication')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ){}
    
  @Post('/signin')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Sign in to the application' , 
    description: 'Use this endpoint to sign in to the application. Provide your email and password to obtain an authorization token',
  })
  async signin(@Headers() headers: HeadersDTO, @Body() data: SignInDTO, @Response() res):Promise<Tokens> {

    let response : any = {
      code : 500,
      message : null
    };

    try {

      // VALIDATE USER BY EMAIL
      let checkEmail = await this.authService.findUserByEmail(data.email);
      if (!checkEmail) {
        response.code = 204;
        response.message = 'Failed find user email';
        return res.json(payloadResponse(response.code, response.message)).status(response.code)
      }

      // Verify Argon
      let matchesPassword = await this.authService.argonVerify(checkEmail.token, data.password);
      if (!matchesPassword) {
        response.code = 403;
        response.message = 'Password not match';
        return res.json(payloadResponse(response.code, response.message)).status(response.code)
      }

      // Get Token User
      let getToken = await this.authService.getTokens(checkEmail._id, data.email);
      if (!getToken) {
        response.code = 204;
        response.message = 'Failed find token user';
        return res.json(payloadResponse(response.code, response.message)).status(response.code)
      }

      // Update Refresh Token
      await this.authService.updateRtHash(checkEmail._id, getToken.refresh_token);

      response.code = 200;
      response.message = getToken;
      return res.json(payloadResponse(response.code, response.message)).status(response.code)

    } catch (error) {

      response.code = 500;
      response.message = null;
      Logger.error("[AUTH][CONTROLLER][SIGNIN][ERROR]:", error);
      return res.json(payloadResponse(response.code, response.message)).status(response.code)

    }
  }

  @Post('/signup')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Sign up to the application' , 
    description: 'Use this endpoint to sign up to the application. Provide your email and password to obtain an authorization token',
  })
  async signup(@Headers() headers: HeadersDTO, @Body() data: SignUpDTO, @Response() res):Promise<Tokens>{

    let response : any = {
      code : 500,
      message : null
    };

    try {
      // VALIDATE USER BY EMAIL
      let checkEmail = await this.authService.findUserByEmail(data.email);
      if (checkEmail) {
        response.code = 204;
        response.message = 'User already exist';
        return res.json(payloadResponse(response.code, response.message)).status(response.code)
      }

      // Hash The Password
      let hashPassword = await this.authService.argonHashing(data.password);
      if (!hashPassword) {
        response.code = 400;
        response.message = 'Failed generate token';
        return res.json(payloadResponse(response.code, response.message)).status(response.code)
      }

      // Register / create user
      let createUser = await this.authService.createUser(data,hashPassword);
      if (!createUser) {
        response.code = 400;
        response.message = 'Failed create user';
        return res.json(payloadResponse(response.code, response.message)).status(response.code)
      }

      // Get Token User
      let getToken = await this.authService.getTokens(createUser._id, data.email);
      if (!getToken) {
        response.code = 204;
        response.message = 'Failed find token user';
        return res.json(payloadResponse(response.code, response.message)).status(response.code)
      }

      // Update Refresh Token
      await this.authService.updateRtHash(createUser._id, getToken.refresh_token);

      response.code = 200;
      response.message = getToken;
      return res.json(payloadResponse(response.code, response.message)).status(response.code)

    } catch (error) {

      response.code = 500;
      response.message = null;
      Logger.error("[AUTH][CONTROLLER][SIGNUP][ERROR]:", error);
      return res.json(payloadResponse(response.code, response.message)).status(response.code)

    }
  }

}
