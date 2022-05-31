import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import { MainContext, useContext } from "../components/Context";
import TableDetailsComponent from "../components/TableDetailsComponent";

const TableDetails = () => {
    
    const {currentPageDetails, rootURL, axios,
        headers, setTables} = useContext(MainContext);
    const {shop_id, table_id} = currentPageDetails;
    const [tableDetails, setTableDetails] = useState<any>();

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
                        <IonTitle className="font-inter" >Table {currentPageDetails.table_no}</IonTitle>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="font-inter" fullscreen>
                <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Table {currentPageDetails.table_no}</IonTitle>
                </IonToolbar>
                </IonHeader>
                
                <TableDetailsComponent tableDetails={tableDetails}
                                        getTableDetails={getTableDetails}
                                        getTables={getTables}/>

            </IonContent>
        </IonPage>
    )
}
export default TableDetails;