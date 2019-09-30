import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsUppercase,
  Max,
  MaxDate,
  MaxLength,
  MinDate,
  MinLength
} from "class-validator";

export class Trade {
  id: number;

  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsAlphanumeric()
  @IsUppercase()
  @IsNotEmpty()
  nameStd: string;

  @IsString()
  @MinLength(4)
  @MaxLength(12)
  @IsNotEmpty()
  brn: string;

  @IsOptional()
  @IsPhoneNumber("MY")
  telNo: string;

  @IsOptional()
  @IsPhoneNumber("MY")
  faxNo: string;

  @IsOptional()
  coord: string;

  @IsPositive()
  @Max(99999999)
  tradeValue: number;

  @MinDate(new Date(2014, 1))
  @MaxDate(new Date(2020, 12))
  tradeDate: Date;

  @IsOptional()
  address: string;
}
