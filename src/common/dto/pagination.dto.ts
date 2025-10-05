import { Type } from 'class-transformer';
    import { IsNumber, IsOptional, Min } from 'class-validator';

    export class PaginationDto {
      @IsOptional()
      @IsNumber()
      @Type(() => Number) // Transforma a string da query em número
      @Min(1)
      page?: number = 1;

      @IsOptional()
      @IsNumber()
      @Type(() => Number)
      @Min(1)
      limit?: number = 10;
    }