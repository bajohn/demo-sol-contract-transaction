
interface iPurchase {
    purchase_id: string;
    name: string;
    price: number;
    date: string;
};

interface iPerson {
    person_id: string;
    first_name: string;
    last_name: string;
    purchases: iPurchase[];
};


export class PurchaseStruct implements iPurchase {
    purchase_id: string;
    name: string;
    price: number;
    date: string;
    constructor(fields: iPurchase) {
        Object.assign(this, fields);
    };

};


export class PersonStruct implements iPerson {
    person_id: string;
    first_name: string;
    last_name: string;
    purchases: iPurchase[];
    constructor(fields: iPerson) {
        Object.assign(this, fields);
    }
};

export const PersonSchema = new Map<any, any>([
    [
        PersonStruct, {
            kind: 'struct',
            fields: [
                ['person_id', 'string'],
                ['first_name', 'string'],
                ['last_name', 'string'],
                ['purchases', [PurchaseStruct]],
            ]
        }
    ],
    [
        PurchaseStruct, {
            kind: 'struct',
            fields: [
                ['purchase_id', 'string'],
                ['name', 'string'],
                ['price', 'u32'],
                ['date', 'string'],
            ]
        }
    ]
]);


