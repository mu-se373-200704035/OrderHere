//ionic-react components
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
//context
import { MainContext, useContext } from '../components/Context';
//components
import LoginForm from '../components/LoginForm';
//ionic-react hooks
import { useEffect } from 'react';
import { useIonToast } from '@ionic/react';
//react-router hooks
import { useHistory } from 'react-router';
//services
import { getSessionFromStorage } from '../services/SessionServices';

const Login = () => {
  const [present, dismiss] = useIonToast();
  const history = useHistory();
  const {setLoggedIn,
        setCurrentPageDetails,
        setHeaders} = useContext(MainContext);

  // NAVIGATION *****************************************
  const goToAdminOrders=()=>{
    setCurrentPageDetails((prevState:any)=>{
      return {
        ...prevState,
        page: "/admin/orders"
      }
    })
    history.push("/admin/orders");
  }

  // SESSION***********************************************
  const checkSession = async ()=>{
    const res = await getSessionFromStorage();
    if(res){
      if(res.status===200){
        setLoggedIn(true);
        setHeaders(res.headers);
        setCurrentPageDetails((prevDetails: any)=>{
          return{
            ...prevDetails,
            "shop_id" : res.data.shop_id
          }
        })
        goToAdminOrders();
      }else{
        console.log("session is not available!");
        present("Session may be expired!",2000);
      }
    }
  }

  // PAGE LIFECYCLE
  useEffect(()=>{
    checkSession();
  },[])

    return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons>
                <IonBackButton></IonBackButton>
            <IonTitle className="font-inter" >Login</IonTitle>
          </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="font-inter" fullscreen>
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