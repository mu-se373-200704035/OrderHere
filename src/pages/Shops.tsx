import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Shops.css';
import React from 'react';
//components
import Searchbar from '../components/Searchbar';
import ShopList from '../components/ShopList';

const Shops = () => {
  
  const axios: any = require("axios").default;
  const rootURL = "https://orderhere.herokuapp.com";

  const [shops, setShops] = React.useState([]);

  async function getShops() {
    try {
      const { data, status } = await axios.get(rootURL+"/shops");
      setShops(data);
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
    getShops();
  },[])

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Shops</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Shops</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <Searchbar placeholder="search for shops"/>
        <ShopList shops={shops} title="shops"/>
      
      </IonContent>
    </IonPage>
  )
}
export default Shops;
