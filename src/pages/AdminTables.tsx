import { IonIcon, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from "@ionic/react";
import { useEffect } from "react";
import { MainContext, useContext } from "../components/Context";
import TabBar from "../components/TabBar";
import TablesList from "../components/TablesList";
import { useHistory } from "react-router";
import { getSessionFromStorage } from '../services/SessionServices';

//icons
import { arrowBackOutline } from 'ionicons/icons';

const AdminTables = () => {

    const {axios, rootURL, currentPageDetails,
        setCurrentPageDetails, headers, setHeaders,
        loggedIn, setLoggedIn, tables, setTables} = useContext(MainContext);
    const history = useHistory();

    const getTables = async () => {
        try{
            const res = await axios.get(rootURL+`/shops/${currentPageDetails.shop_id}/tables`,{
              headers: headers
            });
            setTables(res.data);
          }
          catch (error: any) {
            if (axios.isAxiosError(error)) {
              console.log('error message: ', error.message);
            } else {
              console.log('unexpected error: ', error);
            }
          }
    }


    useEffect(()=>{
      if(currentPageDetails.page.includes("/admin/tables") && loggedIn){
        getTables();
      }
    },[currentPageDetails.page])

    const goBackToRoot = () => {
        setCurrentPageDetails((prevDetails: any)=>{
            return{
                ...prevDetails,
                page: "/welcome"
            }
        });
        setLoggedIn(false);
        history.push("/welcome");
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons>
                        <IonButton onClick={goBackToRoot}>
                            <IonIcon icon={arrowBackOutline}></IonIcon>
                        </IonButton>
                        <IonTitle>Tables</IonTitle>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Orders</IonTitle>
                </IonToolbar>
                </IonHeader>

                <TablesList tables={tables}/>

                <TabBar page="/admin/tables"/>
            </IonContent>
        </IonPage>
    )
}
export default AdminTables;