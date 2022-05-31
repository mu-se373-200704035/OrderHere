//icons
import DisplayIcon from "../components/DisplayIcon";
//style
import "./Order.css";
// react - ionic - 3rd party
import { IonContent, IonHeader, IonPage, IonTitle, useIonToast, useIonPicker, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';
import React from 'react';
import { nanoid } from "nanoid";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { Storage } from "@capacitor/storage";
//context 
import { MainContext, useContext } from "../components/Context";
//components
import Item from "../components/Item";
import ShopCard from "../components/ShopCard";
import Searchbar from "../components/Searchbar";
import OrderSlider from "../components/OrderSlider";
//interfaces
import IItem from "../interfaces/IItem";

const Order = () => {
  // Ionic hooks**********************************************
  const [present, dismiss] = useIonToast();
  const [presentPicker] = useIonPicker();
  
  // STATES***************************************************
  const {currentPageDetails,setCurrentPageDetails, rootURL,
        setCurrentTableInfo} = useContext(MainContext);
  const axios: any = require("axios").default;
  const [items, setItems] = React.useState<IItem[]>([]);
  const [sliderActive, setSliderActive] = React.useState(false);
  const [scanning, setScanning] = React.useState(false);
  const [qrCode, setQrCode] = React.useState<any>(null);
  const [claimed, setClaimed] = React.useState<any>(false);
  const [owner_id, setOwnerId] = React.useState<any>(null);
  const [tableNo, setTableNo] = React.useState<any>(null);
  const [allOrderItemsFromServer, setAllOrderItemsFromServer] = React.useState<any>(()=>[]);
  const {shop_id, table_id} = currentPageDetails;
  const [shopName, setShopName] = React.useState<any>("");
  const [pickerValue, setPickerValue] = React.useState<any>("");

  
  // GETTING AND PROCESSING THE ITEMS**************************
  async function getShopItems() {
    try {
      const { data, status } = await axios.get(rootURL+"/shops/"+currentPageDetails.shop_id+"/items");
      setItems(data);
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
          description={item.description}
          quantity={item.quantity}
          shop_id={item.shop_id}
          items={items}
          setItems={setItems} />
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

 // GETTING ORDER ITEMS
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

  
 // QR CODE SCANNING *************************************** 
  const startScan = async () => {
    BarcodeScanner.hideBackground(); // make background of WebView transparent
    document.body.style.background = "transparent";
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    
    // if the result has content
    if (result.hasContent) {
      setQrCode(result.content);
    }else{
      console.log("NO CODE DETECTED");
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
const setTableNoToStorage = async (table_no : string) => {
  await Storage.set({
    key: "table_no",
    value: table_no
  }
  )
}
const setClaimedToStorage = async (bool : boolean) => {
  await Storage.set({
    key: "claimed",
    value: JSON.stringify(bool)
  })
}
const setShopIdToStorage = async (shop_id: number) => {
  await Storage.set({
    key: "shop_id",
    value: JSON.stringify(shop_id)
  })
}
const setShopNameToStorage = async (shop_name: string) =>{
  await Storage.set({
    key: "shop_name",
    value: JSON.stringify(shop_name)
  })
}
const setTableIdToStorage = async (table_id: number) => {
  await Storage.set({
    key: "table_id",
    value: JSON.stringify(table_id)
  })
}
const updateTableInfo = async () => {
  const ownerID = await Storage.get({key: "owner_id"});
  setOwnerId(ownerID.value);
  const tableNo = await Storage.get({key: "table_no"});
  setTableNo(tableNo.value);
  const shopname = (await Storage.get({key: "shop_name"})).value;
  setShopName(shopname?.substring(1,shopname.length-1));
}



// CLAIMING TABLES************************************************************
async function isTableAvailable(shop_id: string, table_id: string) {
  try {
    const { data, status } = await axios.get(rootURL+"/shops/"+shop_id+"/tables/"+table_id);
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
    if(await isTableAvailable(shop_id, table_id)){
      const owner_id = nanoid();
      const data = await ClaimTable(shop_id, table_id, owner_id);
      
      if(data.table.owner_id === owner_id){
        setOwnerToStorage(owner_id);
        setTableNoToStorage(data.table.table_no);
        setTableIdToStorage(data.table.id);
        setShopIdToStorage(data.table.shop_id);
        setShopNameToStorage(items[0] && items[0].shop)
        setClaimedToStorage(true);
        setClaimed(true);
        setScanning(false);
        present(`successfully claimed the table ${data.table.table_no}`,1500);
        setCurrentPageDetails((prevState: any)=>{
          return {
            ...prevState,
            shop_id: data.table.shop_id,
            table_id: data.table.id
          }
        });
        return true;
      }
    }else{
      present(`table is not available `,1500);
      return false
    }
  }
  return false;
}
async function syncClaimed(){
  const claimed = await Storage.get({key: "claimed"});
  setClaimed(claimed.value==="true");
  const tableno = await Storage.get({key: "table_no"});
  setTableNo(tableno.value);
  const tableId = await Storage.get({key: "table_id"});
  const shopid = await Storage.get({key: "shop_id"});
  if(claimed){
    setCurrentPageDetails((prevState: any)=>{
      return{
        ...prevState,
        table_id: tableId.value,
        shop_id: shopid.value,
      };
    });
  }
}
async function getTableFromStorageSetCurrentTableInfo(){
  const shopIdFromStorage = (await Storage.get({key:"shop_id"})).value;
  const tableIdFromStorage = (await Storage.get({key: "table_id"})).value;
  setCurrentTableInfo({
    shop_id: shopIdFromStorage,
    table_id: tableIdFromStorage
  })    
}

// USE EFFECT HOOKS AND PAGE LIFE CYCLE****************************************
React.useEffect(()=>{
  getShopItems();
  syncClaimed();
},[])
React.useEffect(()=>{
  getAllOrderItems();
},[items])

React.useEffect(()=>{
  if(qrCode){
    setScanning(prev=>!prev); // comment out this line if debugging on web
    tryClaimTable();
  }
},[qrCode]);

React.useEffect(()=>{
  updateTableInfo();
  getTableFromStorageSetCurrentTableInfo();
},[claimed])

React.useEffect(()=>{
  getTableFromStorageSetCurrentTableInfo();
},[shop_id, tableNo, table_id, currentPageDetails])

React.useEffect(()=>{
  if(pickerValue !==""){
    postWaiterRequest();
  }
},[pickerValue])

// to debug on web 
function triggerQrCodeChange(){
  setQrCode("1-2");
}

function toggleSlider(){
  setSliderActive(prevState=>!prevState);
}
function requestWaiter(){
  presentPicker({
    buttons: [
      {
        text: 'Cancel',
        handler: (selected) => {
          
        },
      },
      {
        text: 'Confirm',
        handler: (selected) => {
          setPickerValue(selected.purpose.value)
        },
      },
      
    ],
    columns: [
      {
        name: 'purpose',
        options: [
          { text: 'Help', value: 'help' },
          { text: 'Request Check', value: 'check' },
        ],
      }
    ],
  })
}
async function postWaiterRequest(){
  try {
    const { data, status } = await axios.post(rootURL+"/shops/"+shop_id+"/tables/"+table_id+"/requests",
    //request 
    {
      shop_id: shop_id,
      table_id: table_id,
      owner_id: owner_id,
      purpose: pickerValue
    });
    present("Waiter request sent.", 1500);
    setPickerValue("");
  }
  catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
    } else {
      console.log('unexpected error: ', error);
      present(error, 2000);
    }
  }
}

return (
  <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonBackButton></IonBackButton>
            <IonTitle>Order</IonTitle>
          </IonButtons>
          {claimed && <button className="header-btn" slot="end" onClick={requestWaiter}>
              <DisplayIcon icon="requestWaiterIcon" fill="var(--ion-color-dark)"></DisplayIcon>
              <h6 className="extra-small">waiter</h6>
            </button>}
          
          <button className="header-btn" slot="end" onClick={toggleSlider}>
            <DisplayIcon icon="receiptIcon" fill="var(--ion-color-dark)"></DisplayIcon>
          </button>
          
          {!claimed && <button className="header-btn qr-btn" slot="end" onClick={scanQRCode}>
            <DisplayIcon icon="qrIcon" fill="var(--ion-color-dark)"></DisplayIcon>
          </button>}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen hidden={scanning}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Order</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <button onClick={triggerQrCodeChange}>Trigger qr</button> */}
        <OrderSlider slider={sliderActive}
                    setSlider={setSliderActive}
                    owner_id={owner_id}
                    allOrderItems={allOrderItemsFromServer}
                    getAllOrderItems={getAllOrderItems}
                    tableNo={tableNo}
                    shopName={shopName}
                    claimed={claimed}
                    syncClaimed={syncClaimed}
                    updateTableInfo={updateTableInfo}/>
        <ShopCard name={items[0] && items[0].shop}/>
        {!claimed && <h6 className="scan-to-order">please scan a qr code and claim a table to be able to order.</h6>}
        <h1 className="menu">menu</h1>
        <Searchbar placeholder="search for items"/>
        {itemsList}

        
      </IonContent>
    </IonPage>
  )
}
export default Order;
