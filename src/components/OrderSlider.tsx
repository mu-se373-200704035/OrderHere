import "./OrderSlider.css"
//components
import Item from "./Item";
//context
import { MainContext, useContext } from "./Context";
import { nanoid } from "nanoid";
import { IonList, useIonToast } from "@ionic/react";
import React from "react";
import OrderItem from "./OrderItem";
import { useIonAlert } from "@ionic/react";
import { Storage } from "@capacitor/storage";


export default function OrderSlider(props: any){
  const [present, dismiss] = useIonToast();
  const [alert] = useIonAlert();
  const sliderStyle = props.slider?{left:"0%"}:{left:"100%"}

    const {currentOrderItems, setCurrentOrderItems, axios, rootURL, currentPageDetails} = useContext(MainContext);
    const {shop_id, table_id} = currentPageDetails;
    const [billItems, setBillItems] = React.useState<any>([]);
    const [notDeliveredItems, setNotDeliveredItems] = React.useState<any>([]);
    const [totalPrices, setTotalPrices] = React.useState<any>({billTotal:0,notDeliveredTotal:0});
    

    function addItemsButton(){
      props.setSlider((prevState: any)=>!prevState);
    }
  
    async function postOrderItems(orderItems: any[]){
      try {
        const { data, status } = await axios.post(rootURL+"/shops/"+shop_id+"/tables/"+table_id+"/order_items", {items: orderItems});
        console.log(data);
        return true;
      }
      catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
        } else {
          console.log('unexpected error: ', error);
          present(error, 2000);
        }
        return false;
      }
    }


    async function sendOrder(){
      if(currentOrderItems[0]){
        const itemsToSend = currentOrderItems.map((item:any)=>{
          return {
            ...item,
            shop_id: shop_id,
            table_id: table_id,
            owner_id: props.owner_id
          }
        })
        const status = await postOrderItems(itemsToSend);
        if(status){
          setCurrentOrderItems([]);
          present("order is sent successfully!",2000);
          props.getAllOrderItems();
        }else{
          present("something went wrong.", 2000);
        }
      }else{
        present("Current Order list is empty", 1500);
      }
    }

    const currentOrderItemElements = currentOrderItems.map((item:any)=>{
      return(
        <Item 
        key={nanoid()}
        id={item.id}
        name={item.name}
        description={item.description}
        price={item.price}
        quantity={item.quantity}
        />
      )
    }) 

    function tryCategorizeOrderItems(){
      let bill : any[] = [];
      let notDelivered : any[] = [];
      if(props.allOrderItems[0]){
        props.allOrderItems.forEach((item:any)=>{
          if(item.status){
            bill.push(item);
          }else{
            notDelivered.push(item);
          }
        })
      }
      setBillItems(bill);
      setNotDeliveredItems(notDelivered);
    }

    function calculateTotalPrices(){
      let billTotal = 0;
      billItems.forEach((item:any)=>{
        billTotal+= item.quantity * item.price;
        billTotal = Math.round((billTotal + Number.EPSILON) * 100) / 100;
      })
      let notDeliveredTotal = 0;
      notDeliveredItems.forEach((item:any)=>{
        notDeliveredTotal += item.quantity * item.price;
        notDeliveredTotal = Math.round((notDeliveredTotal + Number.EPSILON) * 100) / 100;
      })
      setTotalPrices({billTotal: billTotal, notDeliveredTotal: notDeliveredTotal});
    }
    React.useEffect(()=>{
      props.getAllOrderItems();
    },[])

    React.useEffect(()=>{
      tryCategorizeOrderItems();
    },[props.allOrderItems])

    React.useEffect(()=>{
      calculateTotalPrices();
    },[billItems,notDeliveredItems])

    React.useEffect(()=>{
    },[currentPageDetails.page])

    
    const billElements = billItems.map((item:any)=>{
      return(
        <OrderItem 
        key={nanoid()}
        id={item.id}
        name={item.name}
        description={item.description}
        price={item.price}
        quantity={item.quantity}
        />
      )
    });
    
    const notDeliveredElements = notDeliveredItems.map((item:any)=>{
      return(
        <OrderItem 
        key={nanoid()}
        id={item.id}
        name={item.name}
        description={item.description}
        price={item.price}
        quantity={item.quantity}
        />
      )
    })

    const checkOut = async () => {
      await Storage.remove({key: "shop_name"})
      await Storage.remove({key: "table_id"})
      await Storage.remove({key: "table_no"})
      await Storage.remove({key: "shop_id"})
      await Storage.remove({key: "owner_id"})
      await Storage.remove({key: "claimed"})
      await props.updateTableInfo();
      await props.syncClaimed();
    }

    const alertCheckOut = () => {
      alert({
        cssClass: 'alert',
        header: 'Check out?',
        message: 'This action will only affect client and is recommended only if you have paid. Are you sure you want to check out?',
        buttons: [
          'Cancel',
          { text: 'Agree', handler: () => checkOut() },
        ],
        onDidDismiss: () => {},
      })
    }

    return(
          <section style={sliderStyle}className="order-slider">
            <h1 className="shop-table-title">{props.shopName} - {props.tableNo}</h1>
            <h2 className="title">current order</h2>
            <IonList>
              {currentOrderItemElements}
            </IonList>
            {!currentOrderItemElements[0] && <p className="add-items-paragraph">add items to this list, tap send order and start waiting</p>}

            <section className="order-slider-buttons">
              <button onClick={addItemsButton} className="add-order-item-btn">add items</button>
              <button onClick={sendOrder}className="send-order-btn">send order</button>
            </section>
            <div className="divider-line"></div>

            <h2 className="title">waiting for delivery</h2>
            <IonList>
              {notDeliveredElements}
            </IonList>
            <h3 className="total-price">Total : ${totalPrices.notDeliveredTotal}</h3>
            <div className="divider-line"></div>

            <h2 className="title">bill</h2>
            <IonList>
              {billElements}
            </IonList>
            <h3 className="total-price">Total : ${totalPrices.billTotal}</h3>

            <div className="order-slider-buttons">
              {props.claimed && <button onClick={alertCheckOut} className="send-order-btn">check out</button>}
            </div>

          </section>
    )
}