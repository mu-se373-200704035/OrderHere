import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { MainContext, useContext } from '../components/Context';
import LoginForm from '../components/LoginForm';
const Login = () => {
    

    return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Login</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Login</IonTitle>
              </IonToolbar>
            </IonHeader>
            
            <LoginForm />

          </IonContent>
        </IonPage>
    )
}
export default Login;