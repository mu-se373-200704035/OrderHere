import "./OrderSlider.css"
//components
import Item from "./Item";
//context
import { MainContext, useContext } from "./Context";
import { nanoid } from "nanoid";
import { useIonToast } from "@ionic/react";
import React from "react";
import OrderItem from "./OrderItem";



export default function OrderSlider(props: any){
  const [present, dismiss] = useIonToast();
  const sliderStyle = props.slider?{left:"0%"}:{left:"100%"}

    const {currentOrderItems, setCurrentOrderItems, axios, rootURL, currentPageDetails} = useContext(MainContext);
    const {shop_id, table_id} = currentPageDetails;
    const [allOrderItemsFromServer, setAllOrderItemsFromServer] = React.useState<any>([]);
    const [billItems, setBillItems] = React.useState<any>([]);
    const [notDeliveredItems, setNotDeliveredItems] = React.useState<any>([]);
    const [totalPrices, setTotalPrices] = React.useState<any>({billTotal:0,notDeliveredTotal:0});
    

    function addItemsButton(){
      props.setSlider((prevState: any)=>!prevState);
    }
    

    async function getAllOrderItems(){
      try {
        const { data, status } = await axios.get(rootURL+"/shops/"+shop_id+"/tables/"+table_id+"/order_items");
        setAllOrderItemsFromServer(data);
      }
      catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
        } else {
          console.log('unexpected error: ', error);
        }
        return null;
      }
    }
    async function postOrderItems(orderItems: any[]){
      try {
        const { data, status } = await axios.post(rootURL+"/shops/"+shop_id+"/tables/"+table_id+"/order_items", {items: orderItems});
        console.log("order items are posted successfully, status: ",status);
        console.log(data);
        return true;
      }
      catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
        } else {
          console.log('unexpected error: ', error);
        }
        return false;
      }
    }


    async function sendOrder(){
      if([] != currentOrderItems){
        const itemsToSend = currentOrderItems.map((item:any)=>{
          console.log(props.owner_id)
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
          getAllOrderItems();
        }else{
          present("something went wrong.", 2000);
        }
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
      if(allOrderItemsFromServer[0]){
        allOrderItemsFromServer.forEach((item:any)=>{
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
      getAllOrderItems();
      tryCategorizeOrderItems();
      calculateTotalPrices();
    },[props.slider])

    
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

    return(
          <section style={sliderStyle}className="order-slider">
            <h2 className="title">current order</h2>
            {currentOrderItemElements}

            <section className="order-slider-buttons">
              <button onClick={addItemsButton} className="add-order-item-btn">add items</button>
              <button onClick={sendOrder}className="send-order-btn">send order</button>
            </section>
            <div className="divider-line"></div>

            <h2 className="title">waiting for delivery</h2>
            {notDeliveredElements}
            <h3>Total : ${totalPrices.notDeliveredTotal}</h3>
            <div className="divider-line"></div>

            <h2 className="title">bill</h2>
            {billElements}
            <h3>Total : ${totalPrices.billTotal}</h3>
          </section>
    )
}