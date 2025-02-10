import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class BasePaginationDto {
  // page값이 있다 => 페이지 기반의 pagination
  @IsNumber()
  @IsOptional()
  page?: number;
  // 이전의 마지막 id, 해당 id부터 값을 가져옴
  // @Type => 타입을 변환하는 것 (class transformer)
  // 근데, 그냥 main.ts 에서 transformer option 추가해서 이를 자동화할 수 있다.
  @IsNumber()
  @IsOptional()
  where__id__more_than?: number;

  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  // 정렬
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'ASC';

  // 몇개를 응답으로 받을 것이냐.
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
