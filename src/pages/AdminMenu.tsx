import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
import TabBar from "../components/TabBar";
import { MainContext, useContext } from "../components/Context";
import { useHistory } from "react-router";
import { arrowBackOutline } from "ionicons/icons";
import { Storage } from "@capacitor/storage";

const AdminMenu = () => {

    const {setCurrentPageDetails} = useContext(MainContext);
    const history = useHistory();
    
    const goBackToRoot = () => {
        setCurrentPageDetails((prevDetails: any)=>{
            return{
                ...prevDetails,
                page: "/welcome"
            }
        });
        history.push("/welcome");
    }

    const logOut = async () => {
        await Storage.remove({key: "session"});
        goBackToRoot();
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