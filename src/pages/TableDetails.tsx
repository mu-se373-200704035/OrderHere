import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import { MainContext, useContext } from "../components/Context";
import TableDetailsComponent from "../components/TableDetailsComponent";
import { getSessionFromStorage } from "../services/SessionServices";
import { useHistory } from "react-router";
const TableDetails = () => {
    
    const {currentPageDetails, setCurrentPageDetails, rootURL, axios,
        headers, setHeaders, setTables,
    loggedIn, setLoggedIn,} = useContext(MainContext);
    const {shop_id, table_id} = currentPageDetails;
    const [tableDetails, setTableDetails] = useState<any>();
    const history = useHistory();

    const getTableDetails = async () => {
        try{
            const res = await axios.get(rootURL+`/shops/${shop_id}/tables/${table_id}`,{
              headers: headers
            });
            setTableDetails(res.data.table);
          }
          catch (error: any) {
            if (axios.isAxiosError(error)) {
              console.log('error message: ', error.message);
            } else {
              console.log('unexpected error: ', error);
            }
          }
    }

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
          getTables();
        }
        else{
          setCurrentPageDetails((prevDetails:any)=>{
            return{
              ...prevDetails,
              page: "/login"
            }
          })
          history.push("/login");
        }
      }


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
        getTableDetails();
    },[])

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons>
                        <IonBackButton></IonBackButton>
                        <IonTitle>Table {currentPageDetails.table_no}</IonTitle>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Table {currentPageDetails.table_no}</IonTitle>
                </IonToolbar>
                </IonHeader>
                
                <TableDetailsComponent tableDetails={tableDetails}
                                        getTableDetails={getTableDetails}
                                        checkSession={checkSession}/>

            </IonContent>
        </IonPage>
    )
}
export default TableDetails;