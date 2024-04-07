import { Show } from "./show";

export class Venue {
  new: boolean;
  mTicketAvailable: boolean;
  latitude: number;
  venueSynopsis: string;
  venueActive: boolean;
  venueName: string;
  companyId: number;
  venueShowTermsFlag: string;
  venueId: number;
  snacksAvailable: boolean;
  addressLine1: string;
  addressLine2: string;
  venueShowTermsFileId: string;
  landmark: string;
  localityId: number;
  venueCategoryId: number;
  longitude: number;
  defaultDaysToPublish: number;
  additionalFare3d: number;
  boxOfficeOnlyFlag: boolean;
  shows: Show[];
}
