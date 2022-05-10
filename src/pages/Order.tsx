import "./Order.css";
import { IonContent, IonHeader, IonPage, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import React from 'react';
import { nanoid } from "nanoid";
import { MainContext, useContext } from "../components/Context";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { Storage } from "@capacitor/storage";
//components
import Item from "../components/Item";
import ShopCard from "../components/ShopCard";
import Searchbar from "../components/Searchbar";
import OrderSlider from "../components/OrderSlider";
//interfaces
import IItem from "../interfaces/IItem";
import IOrder from "../interfaces/IOrder";



const Order = () => {
  
  // STATES***************************************************
  const {selectedShop, rootURL} = useContext(MainContext);
  const axios: any = require("axios").default;
  const [items, setItems] = React.useState<IItem[]>([]);
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [scanning, setScanning] = React.useState(false);
  const [qrCode, setQrCode] = React.useState<any>(null);
  const [claimed, setClaimed] = React.useState<any>(false);
  const [owner_id, setOwnerId] = React.useState<any>(null);
  const [tableNo, setTableNo] = React.useState<any>(null);
  
  // GETTING AND PROCESSING THE ITEMS**************************
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



  
 // QR CODE SCANNING *************************************** 
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


// STORAGE***************************************************
const setOwnerToStorage = async (owner_id : string) => {
  await Storage.set({
    key: "owner_id",
    value: owner_id
  })
}
const setTableToStorage = async (table_no : string) => {
  await Storage.set({
    key: "table_no",
    value: table_no
  })
}
const setClaimedToStorage = async (bool : boolean) => {
  await Storage.set({
    key: "claimed",
    value: JSON.stringify(bool)
  })
}
const setShopIdToStorage = async (shop_id: number) => {
  await Storage.set({
    key: "shop-id",
    value: JSON.stringify(shop_id)
  })
}
const updateTableInfo = async () => {
  const ownerID = await Storage.get({key: "owner_id"});
  setOwnerId(ownerID);
  const tableNo = await Storage.get({key: "table_no"});
  setTableNo(tableNo);
}



// CLAIMING TABLES************************************************************
async function isTableAvailable(shop_id: string, table_id: string) {
  try {
    const { data, status } = await axios.get(rootURL+"/shops/"+shop_id+"/tables/"+table_id);
    console.log("status: ",status);
    return data.table.status ? false : true;
  }
  catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
    } else {
      console.log('unexpected error: ', error);
    }
  }
}
async function ClaimTable(shop_id: string, table_id: string, owner_id: string) {
  try {
    const { data, status } = await axios.put(rootURL+"/shops/"+shop_id+"/tables/"+table_id, {owner_id: owner_id, status: 1});
    console.log("status: ",status);
    return data;
  }
  catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
    } else {
      console.log('unexpected error: ', error);
    }
  }
}
async function tryClaimTable(){
  if(qrCode && !claimed){
    const [shop_id, table_id] = qrCode.split("-");
    // make request to claim the table
    //  GET - if available, PUT owner id to table save to local storage DONE
    if(await isTableAvailable(shop_id, table_id)){
      const owner_id = nanoid();
      const data = await ClaimTable(shop_id, table_id, owner_id);
      
      if(data.table.owner_id === owner_id){
        setOwnerToStorage(owner_id);
        setTableToStorage(data.table.table_no);
        setShopIdToStorage(data.table.shop_id);
        setClaimedToStorage(true);
        setClaimed(true);
        console.log("successfully claimed the table");
        return true;
      }
    }else{
      console.log("table is not available");
      return false
    }
  }
  return false;
}
async function syncClaimed(){
  const claimed = await Storage.get({key: "claimed"});
  console.log(claimed.value==="true")
  setClaimed(claimed.value==="true");
}


// USE EFFECT HOOKS AND PAGE LIFE CYCLE****************************************
React.useEffect(()=>{
  getSelectedShopItems();
  syncClaimed();
},[])

React.useEffect(()=>{
  if(qrCode)
  setScanning(prev=>!prev); // comment out this line if debugging on web
  tryClaimTable();
},[qrCode]);

React.useEffect(()=>{
  //get owner_id from Storage and check according to the result set Claimed
  updateTableInfo();
},[claimed])


// to debug on web
function triggerQrCodeChange(){
  setQrCode("1-1");
}


return (
  <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Order</IonTitle>
          {!claimed && <button className="scan" slot="end" onClick={scanQRCode}>Scan QR</button>}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen hidden={scanning}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Order</IonTitle>
          </IonToolbar>
        </IonHeader>
        <button onClick={triggerQrCodeChange}>Trigger qr</button>
        <OrderSlider orders={orders}
                     setOrders={setOrders}/>
        <ShopCard name={items[0] && items[0].shop}/>
        {!claimed && <h6>please scan a qr code and claim a table to be able to order.</h6>}
        <h1 className="menu">menu</h1>
        <Searchbar placeholder="search for items"/>
        {itemsList}

        
      </IonContent>
    </IonPage>
  )
}
export default Order;
