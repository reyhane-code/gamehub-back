
import { Expose, Transform } from 'class-transformer';

export class AdminIdentityDto {

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    first_name: string;

    @Expose()
    last_name: string;

    @Expose()
    phone: string;

    @Expose()
    active: boolean;

    @Expose()
    role: string;

    @Expose()
    @Transform(({ obj }) => !!obj.password) // Transform based on the presence of password
    hasPassword: boolean;
}

