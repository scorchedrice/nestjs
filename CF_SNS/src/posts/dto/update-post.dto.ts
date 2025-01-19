import {IsOptional, IsString} from "class-validator";
import {CreatePostDto} from "./create-post.dto";
import {PartialType} from "@nestjs/mapped-types";

// partialtype을 사용할 필욘 없음. 상속받는다는 장점이 있긴함.
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}