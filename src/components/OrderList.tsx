import { useEffect, useState } from "react";
import OrderWrapper from "./OrderWrapper";
import { nanoid } from "nanoid";
import OrderItem from "./OrderItem";

export default function OrderList(props: any){

    
    const [ordersByTables, setOrdersByTables] = useState<any>();
    
    // tables: [1,2,4,7] and so on;
    const getOrdersByTableIds = (tableIds: number[]) => {
        const ordersByTableIds = tableIds.map((tableId: number)=>{
            let table_no = "";
            const tableOrders = props.orderItems.map((order: any)=>{
                if(tableId === order.table_id){
                    table_no = order.table;
                    return (
                        <OrderItem 
                        key={nanoid()}
                        id={order.id}
                        name={order.name}
                        desc= {order.description}
                        price={order.price}
                        quantity={order.quantity}
                        />
                    )
                }
            });
            return (
                <OrderWrapper 
                key={nanoid()}
                orders={tableOrders}
                table_no={table_no}
                />
            )
        });
        return ordersByTableIds;
    }
    

    // ordersByTableIds[tableOrders[], tableOrders[] , ...]
    
    // table a1 => order1, order2, order3 

    useEffect(()=>{
        setOrdersByTables(getOrdersByTableIds(props.tableIds));
    },[props.tableIds]);
    
    return (
        <div>
            {ordersByTables}
        </div>
    )
}