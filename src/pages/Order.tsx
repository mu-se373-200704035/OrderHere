import "./Order.css";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { nanoid } from "nanoid";
import { MainContext, useContext } from "../components/Context";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
//components
import Item from "../components/Item";
import ShopCard from "../components/ShopCard";
import Searchbar from "../components/Searchbar";
import OrderSlider from "../components/OrderSlider";
//interfaces
import IItem from "../interfaces/IItem";
import IOrder from "../interfaces/IOrder";



const Order = () => {
  
  const axios: any = require("axios").default;
  const rootURL = "https://orderhere.herokuapp.com";
  const {selectedShop} = useContext(MainContext);
  const [items, setItems] = React.useState<IItem[]>([]);
  const [orders, setOrders] = React.useState<IOrder[]>([]);

  async function getSelectedShopItems() {
    try {
      const { data, status } = await axios.get(rootURL+"/shops/"+selectedShop+"/items");
      setItems(data);
      console.log("status: ",status);
      categorizeItems();
    }
    catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error.message);
      } else {
        console.log('unexpected error: ', error);
      }
    }
  }
  
  React.useEffect(()=>{
    getSelectedShopItems();
  },[])
  
  function categorizeItems(){
    let itemTypes:string[] = [];
    items.forEach(function(item:any){
        if(!itemTypes.includes(item.item_type)){
            itemTypes.push(item.item_type)
        }
    })
    return itemTypes;
  }
  const itemTypes = categorizeItems();

  const itemsList = itemTypes.map(itemType=>{
    
    const itemsOfItemType = items.map(function(item:any){
      if(item.item_type === itemType){
        return(
          <Item key={nanoid()} 
          id={item.id}
          name={item.name}
          price= {item.price}
          description={item.description} />
          )
        }
        return;
      })
      
      return(
        <div key={nanoid()}>
            <h2 className="item-type-title">
            {itemType}
            </h2>
            {itemsOfItemType}
        </div>
    )
  })
  
const [scanning, setScanning] = React.useState(false);
const [qrCode, setQrCode] = React.useState<any>(null);
  
const startScan = async () => {
  BarcodeScanner.hideBackground(); // make background of WebView transparent
  document.body.style.background = "transparent";
  const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

  // if the result has content
  if (result.hasContent) {
    setQrCode(result.content);
  }else{
    setQrCode("NO CODE DETECTED");
  }
};

const checkPermission = async () => {
  // check or request permission
  const status = await BarcodeScanner.checkPermission({ force: true });

  if (status.granted) {
    // the user granted permission
    return true;
  }

  return false;
};

function scanQRCode(){
  setScanning(true);
  checkPermission().then(function(res){
      res && startScan();
  });
}

function processQrCode(){
  const shop_table = qrCode.split(qrCode.split("-"));
  // make request to claim the table

  //local Storage needed
}

React.useEffect(()=>{
  if(qrCode)
    setScanning(prev=>!prev);
},[qrCode]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Order</IonTitle>
          <button className="scan" slot="end" onClick={scanQRCode}>Scan QR</button>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen hidden={scanning}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Order</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <OrderSlider orders={orders}
                     setOrders={setOrders}/>
        <ShopCard name={items[0] && items[0].shop}/>
        {qrCode && <h3>{qrCode}</h3>}
        <h1 className="menu">menu</h1>
        <Searchbar placeholder="search for items"/>
        {itemsList}
      </IonContent>
    </IonPage>
  )
}
export default Order;
