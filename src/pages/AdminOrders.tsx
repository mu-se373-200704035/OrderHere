import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { MainContext, useContext } from '../components/Context';
const AdminOrders = () => {

    return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Orders</IonTitle>
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