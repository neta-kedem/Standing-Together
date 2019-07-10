import fetch from 'node-fetch';
const baseDonation = {
    DonorTitle: "test",
    DonorFirstName: '',
    DonorLastName: '',
    DonorAddress1: '',
    DonorAddress2: '',
    DonorCity: '',
    DonorCountryId: '104',
    DonorStateId: '-1',
    DonorZip: '',
    DonorEmail: '',
    DonorTelephone: '',
    DonationSums: '0',
    DonationTargetTypes: '1',
    DonationTargetIds: '515495067',
    DonationFrequency: '2',
    PurchaseSums: '',
    PurchaseTargetTypes: '',
    PurchaseTargetIds: '',
    StoreItemIds: '',
    CurrencyId: '1',
    CardTypeId: '1',
    CreditCardNo: '',
    CVV: '123',
    ExpirationYear: '2024',
    ExpirationMonth: '11',
    IsraeliId: '',
    LanguageId: '1',
    UserId: '',
    Password: '',
    AffilaiteId: '',
    CustomFieldsXML: '',
    CustomFieldsNameValue: '',
    PersoanlMessage: '',
    IsGiftAid: 'false',
    RouteName: '',
    EcardRecipientTitle: '',
    EcardRecipientFirstName: '',
    EcardRecipientLastName: '',
    EcardInMemoryInHonor: '-1',
    EcardIsSamePersonReceivingCard: 'false',
    EcardIsOtherPersonReceivingCardName: '',
    EcardMessage: '',
    EcardNameOfSender: '',
    EcardIsAnonymous: 'false',
    EcardSendToEamil: 'false',
    EcardPostalAdress: '',
    EcardPostalCity: '',
    EcardPostalCountry: '-1',
    EcardPostalState: '-1',
    EcardPostalZipCode: ''
};
const errors = {
    "default": "התרומה נכשלה - וודאו שהפרטים מדוייקים, וצרו איתנו קשר במקרה הצורך"
};
//this is here to block rapid consecutive donations. If you want to display a loading text while the donation is being processed, make another variable
let donationInProcess = false;

function getDonationObject(profileData, paymentData) {
    let donation = JSON.parse(JSON.stringify(baseDonation));
    Object.assign(donation, {
        DonorFirstName: profileData.firstName,
        DonorLastName: profileData.lastName,
        DonorAddress1: profileData.street + ", " + profileData.houseNum + ", " + profileData.apartmentNum,
        DonorAddress2: '',
        DonorCity: profileData.residency,
        DonorEmail: profileData.email,
        DonorTelephone: profileData.phone,
        DonationSums: paymentData.selectedAmount,
        CurrencyId: '1',
        CreditCardNo: paymentData.CreditCardNo,
        CVV: paymentData.CVV,
        ExpirationYear: paymentData.year,
        ExpirationMonth: paymentData.month,
        CardTypeId: paymentData.CardTypeId
    });
    return donation;
}
function donate(profileData, paymentData){
    if(donationInProcess)
        return;
    donationInProcess = true;
    const donation = getDonationObject(profileData, paymentData);
    const form = Object.keys(donation).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(donation[key])).join('&');//new FormData;
    const promise = fetch("https://secured.israelgives.org/DonationAPI/v1.1/DonationAPI.asmx/MakdeDonation", {
        method: 'post',
        mode: 'no-cors',
        body: form,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(res => res.json())
        .then(json => {
            donationInProcess = false;
            return json;
        });
    return promise;
}
export default {
    donate
}
