import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
//components
import RegisterForm from '../components/RegisterForm';


const Register = () => {

    return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons>
                <IonBackButton></IonBackButton>
                <IonTitle className="font-inter" >Register</IonTitle>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="font-inter" fullscreen>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Register</IonTitle>
              </IonToolbar>
            </IonHeader>
            
            <RegisterForm />

          </IonContent>
        </IonPage>
    )
}
export default Register;