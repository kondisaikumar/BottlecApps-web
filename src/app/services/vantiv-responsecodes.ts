export const VantivResponseCodes = {
    'AVSInfo': [
        {
            AVSCode: 'A',
            IsValid: false,
            AVSMessage: 'Your address matches, but not your zip code. Please re-enter your zip code.'
        },
        {
            AVSCode: 'G',
            IsValid: false,
            AVSMessage: 'Address cannot be verified for International transaction (International only).'
        },
        {
            AVSCode: 'N',
            IsValid: false,
            AVSMessage: 'Neither your Address nor your zip code match.  Please verify and re-enter.'
        },
        {
            AVSCode: 'R',
            IsValid: false,
            AVSMessage: 'Address Verification System temporarily unavailable, please retry.'
        },
        {
            AVSCode: 'S',
            IsValid: false,
            AVSMessage: 'Address Verification is not supported by this card/issuer.  Please use a different card.'
        },
        {
            AVSCode: 'U',
            IsValid: false,
            AVSMessage: 'Information for Address Verification is not available.  Please use a different card.'
        },
        {
            AVSCode: 'W',
            IsValid: false,
            AVSMessage: '9 digit zip code matches, but your address does not match.  Please verify and re-enter your address.'
        },
        {
            AVSCode: 'X',
            IsValid: true,
            AVSMessage: ''
        },
        {
            AVSCode: 'Y',
            IsValid: true,
            AVSMessage: ''
        },
        {
            AVSCode: 'Z',
            IsValid: true,
            AVSMessage: ''
        },
        {
            AVSCode: 'E',
            IsValid: false,
            AVSMessage: 'Address verification is not supported.  Please use a different card.'
        },
        {
            AVSCode: 'D',
            IsValid: true,
            AVSMessage: ''
        },
        {
            AVSCode: 'M',
            IsValid: true,
            AVSMessage: ''
        },
        {
            AVSCode: 'P',
            IsValid: false,
            AVSMessage: 'Zip matches but address cannot be verified.'
        },
        {
            AVSCode: '',
            IsValid: false,
            AVSMessage: 'Unable to add card.Please use a different card.'
        },
        {
            AVSCode: 'N',
            IsValid: false,
            AVSMessage: 'Neither your zip code nor your address match.  Please verify and re-enter the information.'
        }
    ],
    'CVVInfo': [
        {
            CVVCode: 'P',
            IsValid: false,
            // tslint:disable-next-line:max-line-length
            CVVMessage: 'The card issuer cannot verify the CVV provided by the merchant.  The verification system is either not functioning, or information needed to verify the CVV value (e.g., expiration date) was not provided.'
        },
        {
            CVVCode: 'M',
            IsValid: true,
            CVVMessage: ''
        },
        {
            CVVCode: 'N',
            IsValid: false,
            // tslint:disable-next-line:max-line-length
            CVVMessage: 'The card issuer was not able to verify the CVV code provided by the merchant.  Please try again, or try a different card.'
        },
        {
            CVVCode: 'S',
            IsValid: false,
            CVVMessage: 'Card issuer was unable to perform CVV verification since CVV is not present on card.  Contact card issuer.'
        },
        {
            CVVCode: 'U',
            IsValid: false,
            CVVMessage: 'Your card issuer does not participate in the CVV process.  Please try a different card.'
        }
    ]
};
