import "./OrderWrapper.css";
import { MainContext, useContext } from "./Context";

export default function OrderWrapper(props: any){
    
    const {currentPageDetails, rootURL, axios, headers} = useContext(MainContext);
    const {shop_id} = currentPageDetails;

    const handleComplete = async (table_id: number) => {
        try{
            const res = await axios.put(rootURL+`/shops/${shop_id}/tables/${table_id}/order_items`,{},headers);
            console.log(res.data);
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