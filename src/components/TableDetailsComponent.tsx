import "./TableDetailsComponent.css";
import { IonList } from "@ionic/react";
import { nanoid } from "nanoid";
import OrderItem from "./OrderItem";
import { MainContext, useContext } from "./Context";
import { useIonToast, useIonAlert } from "@ionic/react";
import TableDetails from "../pages/TableDetails";


export default function TableDetailsComponent(props: any){
    
    let notDeliveredElements: any[] = [];
    let billElements: any[] = [];
    let totalPrices : any = {notDelivered: 0, bill: 0}

    const [present, dismiss] = useIonToast();
    const [alert] = useIonAlert();
    const {axios, rootURL, currentPageDetails, headers} = useContext(MainContext);
    const {shop_id, table_id} = currentPageDetails;

    props.tableDetails && props.tableDetails.order_items.forEach((item: any)=>{
        if(item.status===false){
            totalPrices.notDelivered += item.quantity * item.price;
            totalPrices.notDelivered = Math.round((totalPrices.notDelivered + Number.EPSILON) * 100) / 100;
            notDeliveredElements.push(
                <OrderItem 
                    key={nanoid()}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                />
            )
        }else if(item.status===true){
            totalPrices.bill += item.quantity * item.price;
            totalPrices.bill = Math.round((totalPrices.bill + Number.EPSILON) * 100) / 100;
            billElements.push(
                <OrderItem 
                    key={nanoid()}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                />
            )
        }
    })
    const handleComplete = async () => {
        try{
            const res = await axios.put(rootURL+`/shops/${shop_id}/tables/${table_id}/order_items`,{},headers);
            present("The orders are completed.",1500);
            props.getTableDetails();
          }
          catch (error: any) {
            if (axios.isAxiosError(error)) {
              console.log('error message: ', error.message);
            } else {
              console.log('unexpected error: ', error);
            }
          }
    }

    const emptyTable = async () => {
        try{
            const res = await axios.put(rootURL+`/shops/${shop_id}/tables/${table_id}`,{table:{status:0}},{headers:headers});
            present("The table is now empty again.",1500);
            props.getTableDetails();
            props.getTables();
        }
          catch (error: any) {
            if (axios.isAxiosError(error)) {
              console.log('error message: ', error.message);
            } else {
              console.log('unexpected error: ', error);
            }
        }
    }

    const handleCheckOut = () => {
        alert({
            cssClass: 'alert',
            header: 'Check out?',
            message: 'By agreeing to this action, you accept that the customer has paid and the table is ready to be empty again!',
            buttons: [
              'Cancel',
              { text: 'I agree', handler: () => emptyTable() },
            ],
            onDidDismiss: () => {},
          })
    }
    return(
        <div>
            <h2 className="title">waiting for delivery</h2>
            <IonList>
              {notDeliveredElements}
            </IonList>
            <h3 className="total-price">Total : ${totalPrices.notDelivered}</h3>
            
            {notDeliveredElements[0] && <section className="order-slider-buttons">
                <button className="add-order-item-btn">cancel the order</button>
                <button onClick={handleComplete}
                className="send-order-btn">complete order</button>
            </section>}
            
            <div className="divider-line"></div>

            <h2 className="title">bill</h2>
            <IonList>
              {billElements}
            </IonList>
            <h3 className="total-price">Total : ${totalPrices.bill}</h3>

            {props.tableDetails && props.tableDetails.status!=0 && <section className="flex-right">
                <button onClick={handleCheckOut}
                className="send-order-btn">check table out</button>
            </section>}


        </div>
    )
}