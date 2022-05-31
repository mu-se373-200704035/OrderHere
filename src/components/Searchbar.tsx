import "./Searchbar.css";
import { IonInput } from "@ionic/react";
import DisplayIcon from "./DisplayIcon";

export default function Searchbar(props: any){

    const process = (query: string) => {
        const trimmed = query.trim();
        return trimmed.toLowerCase();
    }
    return(
        <div className="searchbar-wrapper">
            <IonInput
            className="searchbar font-inter"
            placeholder={props.placeholder}
            value={props.query}
            onIonChange={(e)=>props.setQuery(e.detail.value)}
            >
            </IonInput>
            
            <button onClick={()=>props.search(process(props.query))} className="search-btn">
                <DisplayIcon icon="searchIcon" fill="var(--search-icon)"/>
            </button>
        </div>
    )
}