export class RequestHeader {
  callingAPI: string;
  channel: string;
  transactionId: string;
  companyId?: string

  constructor() {
    this.callingAPI = "moviepanda-web-ui";
    this.channel = "web";
    this.transactionId = new Date().getTime().toString();
  }
}
