import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CreditcardTypeService {

  constructor() { }

  getCardType(cardNumber: string): string {

    // Visa
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cardNumber)) {
      return 'Visa';
    }

    // MasterCard
    if (/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(cardNumber)) {
      return 'MasterCard';
    }

    // AmericanExpress
    if (/^3[47][0-9]{13}$/.test(cardNumber)) {
      return 'AmericanExpress';
    }

    // Discover
    if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(cardNumber)) {
      return 'Discover';
    }

    // DinersClub
    if (/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(cardNumber)) {
      return 'DinersClub';
    }

    // JCB
    if (/^(?:2131|1800|35\d{3})\d{11}$/.test(cardNumber)) {
      return 'JCB';
    }
  }
}
