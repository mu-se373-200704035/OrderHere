import "./OrderWrapper.css";
import { MainContext, useContext } from "./Context";
import { useIonToast } from "@ionic/react";
export default function OrderWrapper(props: any){
    
    const [present, dismiss] = useIonToast();
    const {currentPageDetails, rootURL, axios, headers} = useContext(MainContext);
    const {shop_id} = currentPageDetails;

    const handleComplete = async (table_id: number) => {
        try{
            const res = await axios.put(rootURL+`/shops/${shop_id}/tables/${table_id}/order_items`,{},headers);
            present("The orders are completed.",1500);
            props.getOrderItems(shop_id, headers);
          }
          catch (error: any) {
            if (axios.isAxiosError(error)) {
              console.log('error message: ', error.message);
            } else {
              console.log('unexpected error: ', error);
            }
          }
    }


    return(
        <div className="order-wrapper">
            <div className="order-wrapper-control-div">
                <h4 className="order-wrapper-table-no">table {props.table_no}</h4>
                <button onClick={()=>handleComplete(props.table_id)} className="order-wrapper-complete-btn">complete order</button>
            </div>
            {props.orders}
        </div>
    )
}