export default interface IOrder{
    id: number;
    name: string;
    price: number;
    quantity: number;
    status: boolean;

    shop: string;
    table: string;
    owner_id: string;
}