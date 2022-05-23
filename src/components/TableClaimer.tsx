import { MainContext, useContext } from "./Context";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { Storage } from "@capacitor/storage";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import DisplayIcon from "./DisplayIcon";
import { useIonToast } from "@ionic/react";

export default function TableClaimer(props: any){

    const {claimed, setClaimed, qrCode, setQrCode, scanning, setScanning,
        setOwnerId, setTableNo, setShopName, owner_id, tableNo, shopName,
        currentPageDetails, setCurrentPageDetails, setCurrentTableInfo,
        axios, rootURL,
    } = useContext(MainContext);

    const {shop_id, table_id} = currentPageDetails;
    const [present, dismiss] = useIonToast();

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
      // make request to claim the table
      //  GET - if available, PUT owner id to table save to local storage DONE
      if(await isTableAvailable(shop_id, table_id)){
        const owner_id = nanoid();
        const data = await ClaimTable(shop_id, table_id, owner_id);
        
        if(data.table.owner_id === owner_id){
          setOwnerToStorage(owner_id);
          setTableNoToStorage(data.table.table_no);
          setTableIdToStorage(data.table.id);
          setShopIdToStorage(data.table.shop_id);
          setShopNameToStorage(props.items[0] && props.items[0].shop)
          setClaimedToStorage(true);
          setClaimed(true);
          present(`successfully claimed the table ${data.table.table_no}`,1500);
          setCurrentPageDetails((prevState: any)=>{return {...prevState, table_id: table_id}})
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
  useEffect(()=>{
    props.getShopItems();
    syncClaimed();
  },[])
  useEffect(()=>{
    props.getAllOrderItems();
  },[props.items])
  
  useEffect(()=>{
    if(qrCode)
    //setScanning((prev:boolean)=>!prev); // comment out this line if debugging on web
    tryClaimTable();
  },[qrCode]);
  
  useEffect(()=>{
    updateTableInfo();
    getTableFromStorageSetCurrentTableInfo();
  },[claimed])
  
  useEffect(()=>{
    getTableFromStorageSetCurrentTableInfo();
  },[shop_id, tableNo, table_id, currentPageDetails])


//   // to debug on web 
//     function triggerQrCodeChange(){
//     setQrCode("1-3");
//   }

  return(
    <div>
        <button className="header-btn qr-btn" slot="end" onClick={scanQRCode}>
            <DisplayIcon icon="qrIcon" fill="var(--ion-color-dark)" />
        </button>
        <button onClick={scanQRCode}>trigger</button>

    </div>
  )
}