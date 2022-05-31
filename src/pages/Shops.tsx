import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Shops.css';
import React, { useState } from 'react';
//components
import Searchbar from '../components/Searchbar';
import ShopList from '../components/ShopList';
//context
import { MainContext, useContext } from '../components/Context';
import DisplayIcon from '../components/DisplayIcon';
import { useHistory } from 'react-router';
import { Storage } from '@capacitor/storage';
import Spinner from '../components/Spinner';

const Shops = () => {
  const {rootURL, axios, claimed, setClaimed, setCurrentPageDetails, setShouldScan} = useContext(MainContext);
  const [shops, setShops] = React.useState([]);
  const history = useHistory();
  const [query, setQuery] = useState<any>("");
  const [spinnerActive, setSpinnerActive] = useState<boolean>(false);

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

  const searchShops = async (query: any) => {
    try{
      setSpinnerActive(true);
      const {data} = await axios.get(rootURL+`/shops/search?q=${query}`)
      setShops(data);
      setSpinnerActive(false);
    } 
    catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error.message);
      } else {
        console.log('unexpected error: ', error);
      }
    }
  }

  const gotoOrderPageAndScan = () => {
    setShouldScan(true);
    setCurrentPageDetails((prevDetails: any)=>{
      return{
        ...prevDetails,
        page:"/order"
      }
    });
    history.push("/order");
  }
  const syncClaimed = async () => {
    const claimed = await Storage.get({key: "claimed"});
    setClaimed(claimed.value==="true");
  }

  React.useEffect(()=>{
    syncClaimed();
    getShops();
  },[])

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonBackButton></IonBackButton>
            <IonTitle className="font-inter" >Shops</IonTitle>
            {!claimed && <button className="header-btn qr-btn" slot="end" onClick={gotoOrderPageAndScan}>
            <DisplayIcon icon="qrIcon" fill="var(--ion-color-dark)"></DisplayIcon>
          </button>}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="font-inter" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Shops</IonTitle>
          </IonToolbar>
        </IonHeader>
        
       {spinnerActive && <Spinner />}

        <Searchbar
        placeholder="search for shops"
        search={searchShops}
        query={query}
        setQuery={setQuery}
        />
        <ShopList shops={shops} title="shops"/>
      
      </IonContent>
    </IonPage>
  )
}
export default Shops;
