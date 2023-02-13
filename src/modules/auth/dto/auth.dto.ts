import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SignInDTO {
    @ApiProperty()
    @Type(() => String)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(60, { message: "Email harus diisi maksimal 60 karakter" })
    @IsEmail({}, { message: 'Format email salah' })
    @IsNotEmpty({ message: "Email tidak boleh kosong" })
    email: string;

    @ApiProperty()
    @Type(() => String)
    @IsString()
    password: string;
}

export class SignUpDTO {
    @ApiProperty()
    @Type(() => String)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(60, { message: "Email harus diisi maksimal 60 karakter" })
    @IsEmail({}, { message: 'Format email salah' })
    @IsNotEmpty({ message: "Email tidak boleh kosong" })
    email: string;

    @ApiProperty()
    @Type(() => String)
    @IsString()
    password: string;
}