import * as borsh from 'borsh';
import { PersonSchema, PersonStruct, PurchaseStruct, SampleSchema, SampleStruct } from './schemata';

export const personInstance = () => {
    return new PersonStruct({
        person_id: 'usr-abc123',
        first_name: 'John',
        last_name: 'Doe',
        purchases: []
    });
};
export const sampleInstance = () => {
    return new SampleStruct({
        basic: 'hii'
    });
};


export const purchaseInstance = () => {
    return [
        new PurchaseStruct({
            purchase_id: 'ord-zzz987',
            name: 'laptop',
            date: '2022-01-25T02:20:42.832Z',
            price: 853,
        }),
        new PurchaseStruct({
            purchase_id: 'ord-yyy654',
            name: 'headphones',
            date: '2022-01-23T14:12:05.631Z',
            price: 63,
        })
    ];
};

export const sampleAccSize = () => {
    return borsh.serialize(
        SampleSchema,
        sampleInstance()).length
}

export const personAccSize = () => {
    const MAX_NAME_LEN = 32;
    const purchaseSample = new PurchaseStruct({
        purchase_id: 'ord-xxxxxx',
        name: 'a'.repeat(MAX_NAME_LEN),
        date: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        price: 9999,
    });
    return borsh.serialize(
        PersonSchema,
        new PersonStruct({
            person_id: 'usr-xxxxxx',
            first_name: 'a'.repeat(MAX_NAME_LEN),
            last_name: 'a'.repeat(MAX_NAME_LEN),
            purchases: [
                purchaseSample,
                purchaseSample,
                purchaseSample]
        })).length;
}