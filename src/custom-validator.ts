import { Transform } from 'class-transformer';
import {
  ValidationOptions,
  IsNotEmpty as _IsNotEmpty,
  MaxLength as _MaxLength,
  Min as _Min,
  Max as _Max,
  IsNumber as _IsNumber,
  IsNumberOptions,
  IsString as _IsString,
  IsLatitude as _IsLatitude,
  IsLongitude as _IsLongitude,
  IsOptional as _IsOptional,
  IsEmail as _IsEmail,
  MinLength as _MinLength,
  ValidationArguments,
  ValidateIf as _ValidateIf,
  IsBoolean as _ISBoolean,
  IsEnum as _IsEnum,
  Matches as _Matches,
  registerDecorator,
} from 'class-validator';
import { IsEmailOptions } from './interfaces/validator-interfaces';
import { faTranslator } from './i18n/fa';
import { enTranslator } from './i18n/en';

const generateMessage = (
  name: string,
  { constraints, property }: ValidationArguments,
): string => {
  let translator: { messages: object; properties: object };
  switch (global.lang) {
    case 'en':
      translator = enTranslator;
      break;
    case 'fa':
    default:
      translator = faTranslator;
      break;
  }

  const { messages, properties } = translator;
  const propertyName = properties[property];
  let message = messages[name];
  message = message.replace('{propertyName}', propertyName || property);
  if (constraints?.length && constraints[0]) {
    message = message.replace('{errorValue}', constraints[0]);
  }

  return message;
};

const generateOptions = (
  name: string,
  validationOptions?: ValidationOptions,
) => {
  return {
    ...validationOptions,
    message(err: ValidationArguments) {
      return generateMessage(name, err);
    },
  };
};

export const IsNotEmpty = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _IsNotEmpty(generateOptions('IsNotEmpty', validationOptions));

export const IsNumber = (
  isNumberOptions?: IsNumberOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _IsNumber(
    { ...isNumberOptions },
    generateOptions('IsNumber', validationOptions),
  );

export const IsString = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _IsString(generateOptions('IsString', validationOptions));

export const IsBoolean = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _ISBoolean(generateOptions('IsBoolean', validationOptions));

export const MaxLength = (
  max: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _MaxLength(max, generateOptions('MaxLength', validationOptions));

export const MinLength = (
  min: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _MinLength(min, generateOptions('MinLength', validationOptions));

export const Min = (
  minValue: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _Min(minValue, generateOptions('Min', validationOptions));

export const Max = (
  maxValue: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _Max(maxValue, generateOptions('Max', validationOptions));

export const IsLatitude = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _IsLatitude(generateOptions('IsLatitude', validationOptions));

export const IsLongitude = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _IsLongitude(generateOptions('IsLongitude', validationOptions));

export const IsOptional = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => _IsOptional(validationOptions);

const defaultEmailOptions: IsEmailOptions = {
  allow_display_name: false,
  allow_ip_domain: false,
  allow_utf8_local_part: true,
  domain_specific_validation: false,
  ignore_max_length: false,
};
export const IsEmail = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _IsEmail(
    { ...defaultEmailOptions },
    generateOptions('IsEmail', validationOptions),
  );
export const ValidateIf = (
  condition: (object: any, value: any) => boolean,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _ValidateIf(condition, generateOptions('ValidateIf', validationOptions));
export const IsEnum = (
  entity: object,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _IsEnum(entity, generateOptions('IsEnum', validationOptions));

export const Matches = (
  pattern: RegExp,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  _Matches(pattern, generateOptions('Matches', validationOptions));


export function TransformAndValidateNumberArray(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    // Register the validation decorator
    registerDecorator({
      name: 'isArrayOrSingleNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Transform the value to an array of numbers
          const transformedValue = Array.isArray(value)
            ? value.map((item) => {
                const numberValue = Number(item);
                return isNaN(numberValue) ? null : numberValue; // Return null if conversion fails
              })
            : [Number(value)];

          // Validate the transformed value
          if (Array.isArray(transformedValue)) {
            return transformedValue.every((val) => val !== null); // Check if all elements are valid numbers
          }
          return transformedValue[0] !== null; // Check if single value is valid
        },
        defaultMessage(args: ValidationArguments) {
          return 'Value must be an array of numbers or a single number';
        },
      },
    });

    // Apply the transformation
    Transform(({ value }) => {
      return Array.isArray(value)
        ? value.map((item) => {
            const numberValue = Number(item);
            return isNaN(numberValue) ? null : numberValue; // Return null if conversion fails
          })
        : [Number(value)];
    })(object, propertyName);
  };
}
