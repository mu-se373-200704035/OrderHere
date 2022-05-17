import { IonButton, IonContent, IonPage,} from '@ionic/react';
const Root = () => {
    return (
        <IonPage>
          <IonContent fullscreen>
              <IonButton routerLink='/shops'>I am a customer</IonButton>
              <IonButton routerLink='/login'>I am an employee</IonButton>
          </IonContent>
        </IonPage>
    )
}
export default Root;