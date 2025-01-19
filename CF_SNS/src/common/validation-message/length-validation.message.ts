import { ValidationArguments } from 'class-validator';

export function lengthValidationMessage(args: ValidationArguments) {
  if (args.constraints.length === 2) {
    return `${args.property}는 ${args.constraints[0]} - ${args.constraints[1]} 글자를 입력해주세요.`;
  } else {
    return `${args.property}는 최소 ${args.constraints[0]}자 입력해주세요.`;
  }
}
