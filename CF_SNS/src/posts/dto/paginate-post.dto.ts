import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginatePostDto {
  // 이전의 마지막 id, 해당 id부터 값을 가져옴
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  // 정렬
  @IsIn(['ASC'])
  @IsOptional()
  order__createdAt: 'ASC' = 'ASC';

  // 몇개를 응답으로 받을 것이냐.
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
