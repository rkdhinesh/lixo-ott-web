import { RequestHeader } from 'src/app/_core/model/request-header';

// tslint:disable-next-line: class-name
export class updateProfileRequest {
    alternativeEmailId: string;
    primaryEmail: string;
    primaryPhoneNumber: string;
    dateOfBirth: string;
    location: string;
    firstName: string;
    gender: string;
    lastName: string;
    maritalStatus: string;
    marriageDate: string;
    middleName: string;
    profileImageUrl: string;
    secondaryPhoneNumber: string;
    userSecret: string;
    header: RequestHeader;
}
