import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
import TabBar from "../components/TabBar";
import { MainContext, useContext } from "../components/Context";
import { useHistory } from "react-router";
import { arrowBackOutline } from "ionicons/icons";
import { Storage } from "@capacitor/storage";
import { useIonToast } from "@ionic/react";

const AdminMenu = () => {

    const {setCurrentPageDetails, axios, rootURL, headers} = useContext(MainContext);
    const history = useHistory();
    const [present, dismiss] = useIonToast();

    const goBackToRoot = () => {
        setCurrentPageDetails((prevDetails: any)=>{
            return{
                ...prevDetails,
                page: "/welcome"
            }
        });
        history.push("/welcome");
    }

    const destroySession = async () => {
        try{
            axios.delete(rootURL+"/auth/sign_out",{
                headers: headers
            });
            return true;
        }
        catch(error: any){
            if(axios.isAxiosError(error)){
                console.log("error message:", error.message);
            }else{
                console.log("error:",error);
            }
            return false;
        }   
    }

    const logOut = async () => {
        const status = await destroySession();
        if(status){
            await Storage.remove({key: "session"});
            goBackToRoot();
        }else{
            present("Something went wrong!",2000);
        }
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonButtons>
                    <IonButton onClick={goBackToRoot}>
                    <IonIcon icon={arrowBackOutline}></IonIcon>
                    </IonButton>
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

                <IonList>
                    <IonItem onClick={logOut}>
                        <IonText color="danger">Log out</IonText>
                    </IonItem>
                </IonList>

                <TabBar page="/admin/menu"/>
            </IonContent>
        </IonPage>
    )
}
export default AdminMenu;