import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common'

// 모든 Pipe는 Injectable이며, PipeTransform 을 implements해야한다. (docs 확인)
@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > 8) {
      throw new BadRequestException('Password must have at least 8 characters')
    }
    return value.toString();
  }
};

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly length : number) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > this.length) {
      throw new BadRequestException(`최대 ${this.length} 글자의 password를 넣을 수 있습니다.`)
    }
    return value.toString();
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly length : number) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length <= this.length) {
      throw new BadRequestException(`Password must have at least ${this.length} characters`)
    }
    return value.toString();
  }
}
