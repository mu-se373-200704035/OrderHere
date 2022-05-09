import "./Order.css";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { nanoid } from "nanoid";
import { MainContext, useContext } from "../components/Context";
//components
import Item from "../components/Item";
import ShopCard from "../components/ShopCard";
import Searchbar from "../components/Searchbar";

interface Item{
  id: number;
  name: string;
  description: string;
  price: number;
  shop: string;
  item_type: string;
  created_at: string;
  updated_at: string;
}

const Order = () => {
  
  const axios: any = require("axios").default;
  const rootURL = "https://orderhere.herokuapp.com";
  const {selectedShop} = useContext(MainContext);
  const [items, setItems] = React.useState<Item[]>([]);
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
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Order</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Order</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <ShopCard name={items[0] && items[0].shop}/>
        <h1 className="menu">menu</h1>
        <Searchbar placeholder="search for items"/>
        {itemsList}
      </IonContent>
    </IonPage>
  )
}
export default Order;
