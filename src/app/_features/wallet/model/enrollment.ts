import { RequestHeader } from 'src/app/_core/model/request-header';

export class Enrollment {
    acceptance:string;
    account_number:string;
    balance:number;
    enrolment:string;
    kyc:Kyc[];
    kyc_status:string;
    wallet_id:number;
    wallet_transaction:WalletTransaction[];
    header: RequestHeader;


}

export class Kyc{
    doc_file_id:string;
    id:string;
    wallet_id:string;
}

export class WalletTransaction{
    transaction_amount:string;
    transaction_date:TransactionDate;
    transaction_type:string;
    wallet_id:string;
    wallet_recharge:WalletRecharge;
    wallet_transaction_id:string;
    wallet_usage:walletUsage;

}

export class TransactionDate{
    date:string;
    day:string;
    hours:string;
    minutes:string;
    month:string;
    nanos:string;
    seconds:string;
    time:string;
    timezoneOffset:string;
    year:string;
}

export class WalletRecharge{
    id:string;
    order_id:string;
    wallet_transaction_id:string;

}

export class walletUsage{
    id:string;
    remarks:string;
    usage_name:string;

}