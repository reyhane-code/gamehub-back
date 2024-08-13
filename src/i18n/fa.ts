const messages = {
  IsNotEmpty: 'مقدار {propertyName} نمی تواند خالی باشد',
  IsNumber: 'مقدار {propertyName} باید به صورت عددی باشد',
  IsString: 'مقدار {propertyName} باید به صورت حروف باشد',
  IsBoolean: 'مقدار {propertyName} باید به صورت true یا false باشد',
  MaxLength: 'طول {propertyName} نمی تواند بیشتر از {errorValue} باشد',
  MinLength: 'طول {propertyName} باید حداقل {errorValue} باشد',
  Min: 'مقدار {propertyName} باید حداقل {errorValue} باشد',
  Max: 'مقدار {propertyName} نمی تواند بیشتر از {errorValue} باشد',
  IsLatitude: 'مقدار {propertyName} یک مختصات صحیح نیست',
  IsLongitude: 'مقدار {propertyName} یک مختصات صحیح نیست',
  IsEmail: 'مقدار وارد شده یک ایمیل صحیح نیست',
  Matches: 'مقدار یک {propertyName} معتبر نیست',
  IsEnum: 'مقدار یک {propertyName} معتبر نیست',
  TransformAndValidateNumberArray:
    ' برای {propertyName} باید حداقل یک مقدار وارد کنید',
};
const properties = {
  password: 'رمز عبور',
  passwordConfirm: 'تکرار رمز عبور',
  email: 'ایمیل',
  name: 'نام',
  phone: 'شماره تلفن',
  address: 'آدرس',
  latitude: 'طول جغرافیایی',
  longitude: 'عرض جغرافیایی',
  description: 'توضیحات',
  price: 'قیمت',
  capacity: 'ظرفیت',
  image: 'تصویر',
  images: 'تصویرها',
  titleEn: 'عنوان انگلیسی',
  titleFa: 'عنوان فارسی',
  altEn: 'توضیحات عکس انگلیسی',
  altFa: ' توضیحات عکس فارسی',
  contentEn: 'محتوای انگلیسی',
  contentFa: 'محتوای فارسی',
  category: 'دسته بندی',
  categories: 'دسته بندی ها',
  subCategory: 'زیر دسته بندی',
  subCategories: 'زیر دسته بندی ها',
  platformIds: 'پلتفرم ها',
  genreIds: ' ژانر ها',
  publisherIds: 'پابلیشر ها',
};

export const faTranslator = {
  messages,
  properties,
};
