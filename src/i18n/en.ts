const messages = {
  IsNotEmpty: '{propertyName} can not be empty',
  IsNumber: '{propertyName} must be a number',
  IsString: '{propertyName} must be a string',
  IsBoolean: '{propertyName} must be a boolean',
  MaxLength: '{propertyName} length must be more than {errorValue}',
  MinLength: '{propertyName} length must be at least {errorValue}',
  Min: '{propertyName} must be at least {errorValue} characters',
  Max: '{propertyName} can not be more than {errorValue} characters',
  IsLatitude: '{propertyName} is not a valid latitude',
  IsLongitude: '{propertyName} is not a valid longitude',
  IsEmail: '{propertyName} must be a valid email',
  Matches: 'مقدار یک {propertyName} معتبر نیست',
  IsEnum: 'مقدار یک {propertyName} معتبر نیست',
  TransformAndValidateNumberArray:
    'You have to provide at least one value for {propertyName}',
};
const properties = {
  password: 'password',
  passwordConfirm: 'password confirm',
  email: 'email',
  name: 'name',
  phone: 'phone number',
  address: 'address',
  latitude: 'latitude',
  longitude: 'longitude',
  description: 'description',
  price: 'price',
  capacity: 'capacity',
  image: 'image',
  images: 'images',
  category: 'category',
  categories: 'categories',
  subCategory: 'sub Category',
  subCategories: 'sub Categories',
  platformIds: 'platforms',
  genreIs: 'genres',
  publisherIds: 'publishers',
};

export const enTranslator = {
  messages,
  properties,
};
