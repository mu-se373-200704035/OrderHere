import { IonBackButton, IonButtons, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
//services
import { getSessionFromStorage } from '../services/SessionServices';
//context
import { MainContext, useContext } from '../components/Context';
//components
import OrderList from '../components/OrderList';

const AdminOrders = () => {

  const history = useHistory();
  const {loggedIn, setLoggedIn, currentPageDetails, setCurrentPageDetails,
        axios, rootURL, setHeaders} = useContext(MainContext);
  const [orderItems, setOrderItems] = useState<any>([]);
  const [tableIds, setTableIds] = useState<number[]>([]);

  const checkSession = async () => {
    const [data, status, headers] = await getSessionFromStorage();
    if (status===200){
      setLoggedIn(true);
      setHeaders(headers);
      setCurrentPageDetails((prevDetails: any)=>{
        return{
          ...prevDetails,
          "shop_id" : data.shop_id
        }
      })
      getOrderItems(data.shop_id, headers);
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

  const getOrderItems = async (shop_id:any, headers: any) => {
    try{
      const res = await axios.get(rootURL+`/shops/${shop_id}/order_items`,{
        headers: headers
      });
      setOrderItems(res.data);
      setTableIds(getTablesWhichOrdered(res.data));
    }
    catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error.message);
      } else {
        console.log('unexpected error: ', error);
      }
    }
  }

  const getTablesWhichOrdered = (items:any) => {
    let tableIds: number[] = [];
    items.forEach((order: any) => {
        if(!tableIds.includes(order.table_id)){
            tableIds.push(order.table_id)
        }
    });
    return tableIds;
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
        
        <OrderList orderItems={orderItems}
                    tableIds={tableIds}/>

      </IonContent>
    </IonPage>
  )
}
export default AdminOrders;