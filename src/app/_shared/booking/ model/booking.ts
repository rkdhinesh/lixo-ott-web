import { SelectedSeatLayout } from './seat-layout';
import { Genres, Movie } from 'src/app/_features/shows/model/movie';
import { UnblockSeat } from 'src/app/_features/booking/model/unblock-seat-status';

export interface Booking {
  customerEmail: string;
  customerName: string;
  customerPhone: number;
  city: string;
  movieId: number;
  trailerUrl: any;
  recommanded: any;
  screenId: number;
  venueId: number;
  venueName: string;
  addressLine1: string;
  addressLine2: string;
  movieName: string;
  movieConsent: string;
  venueConsent: string;
  classId: number;
  className: string;
  classPublishedId: number;
  seat_layout: SelectedSeatLayout;
  seatLayout: UnblockSeat;
  genres: Genres[];
  orderId: string;
  orderAmount: number;
  bookingId: string;
  posterUrl: string;
  overAllRating: number;
  language: string;
  censorCertificate: string;
  duration: string;
  paymentMode: number;
  companyId: number;
  showPublishedId: number;
  seatCount: number;
  venueShowTermsFlag: string;
  venueShowTermsFileId: number;
  movieShowTermsFileId: number;
  movieShowTermsFlag: string;
  showTime: string;
  showDate: string;
  userPreferenceGenreId: number;
  userVenuePreferenceId: number;
  selectedvenueterm: boolean;
  selectedmovieterm: boolean;
  trailer: Movie;
  ticketTotal: number;
  payment_id: string;
  amount: string;
  method: string;
  fromVenue: boolean;
  onSummary: boolean;
  boxOfficeOnlyFlag: boolean;
}
