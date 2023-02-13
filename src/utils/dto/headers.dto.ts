import { IsNumber, Min, IsOptional, IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HeadersDTO {
  @ApiProperty({ enum: ['web', 'mobile']})
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  platform: Platform;
}

export enum Platform {
	web = "web",
	mobile = "mobile"
}