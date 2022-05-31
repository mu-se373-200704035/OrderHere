import { IonList } from "@ionic/react";
import { nanoid } from "nanoid";
import Request from "./Request";
import "./RequestsSlider.css";
export default function RequestsSlider(props: any){
    
    const requestElements = props.requests.map((request: any)=>{
        return(
            <Request key={nanoid()}
            purpose={request.purpose}
            tableId={request.id}
            table={request.table}
            getRequests={props.getRequests}
            />
        )
    })

    const sliderStyle = props.sliderActive? {left:"0%"}:{left:"100%"}
    return(
        <div style={sliderStyle} className="requests-slider">
            <h4 className="requests-title">Requests</h4>
            <IonList>
                {!requestElements[0] && <h5 className="no-waiter-requests">There are no waiter requests</h5>}
                {requestElements}
            </IonList>
        </div>
    )
}