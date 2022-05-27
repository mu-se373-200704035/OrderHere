import "./Request.css";
import { IonItem, useIonToast } from "@ionic/react";
import { MainContext, useContext } from "./Context";
import DisplayIcon from "./DisplayIcon";

export default function Request(props: any){
    
    const [present, dismiss] = useIonToast();

    const {axios, rootURL, currentPageDetails, headers} = useContext(MainContext);
    const { shop_id} = currentPageDetails;
    
    const handleFulfill = async (id: number)=> {
        try{
            await axios.delete(rootURL+`/shops/${shop_id}/requests/${id}`,{ headers});
            props.getRequests();
            present("Request is fulfilled.",1500);
        }
        catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
        } else {
            console.log('unexpected error: ', error);
        }
        }
    }
    

    let message="";
    if(props.purpose==="help"){
        message = `Table ${props.table} needs help.`
    }else if(props.purpose==="check"){
        message = `Table ${props.table} wants to check out.` 
    }else{
        message = `Table ${props.table}This request type is not implemented yet.`
    }
    return(
        <IonItem class="request">
            <h5 className="request-text">
                {message}
            </h5>
            <button onClick={()=>handleFulfill(props.tableId)} slot="end" className="fulfill-request-btn">
                <DisplayIcon icon="checkIcon" fill="var(--ion-color-primary)" />
            </button>
        </IonItem>
    )
}