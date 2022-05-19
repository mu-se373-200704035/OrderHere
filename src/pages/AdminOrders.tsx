import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { getSessionFromStorage } from '../services/SessionServices';
import { MainContext, useContext } from '../components/Context';

const AdminOrders = () => {

  const history = useHistory();
  const {setLoggedIn, setCurrentPageDetails} = useContext(MainContext);

  const checkSession = async () => {
    const status = await getSessionFromStorage();
    if (status===200){
      setLoggedIn(true);
    }
    else{
      setCurrentPageDetails((prevDetails:any)=>{
        return{
          ...prevDetails,
          page: "login"
        }
      })
      history.push("/login");
    }
  }

  useEffect(()=>{
    checkSession();
  },[])

    
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonBackButton></IonBackButton>
          <IonTitle>Orders</IonTitle>
        </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Orders</IonTitle>
          </IonToolbar>
        </IonHeader>
        <h1>CURRENT ORDERS</h1>
      </IonContent>
    </IonPage>
  )
}
export default AdminOrders;