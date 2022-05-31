import "./Searchbar.css";
import { IonInput } from "@ionic/react";
import DisplayIcon from "./DisplayIcon";

export default function Searchbar(props: any){

    const query: string = props.query;
    const processQuery = (query: string) => {
        const words = query.trim().split(" ");
        let finalQuery: string = "";
        words.forEach((word: string)=> {
            const lower = word.toLowerCase();
            const first = word.charAt(0);
            const cap = first.toUpperCase();
            const finalWord = cap + lower.slice(1);
            finalQuery += finalWord + " ";
        });
        console.log(finalQuery.slice(0,finalQuery.length))
        return finalQuery.slice(0,finalQuery.length);
    }

    return(
        <div className="searchbar-wrapper">
            <IonInput
            className="searchbar"
            placeholder={props.placeholder}
            value={props.query}
            onIonChange={(e)=>props.setQuery(e.detail.value)}
            >
            </IonInput>
            
            <button onClick={()=>props.search(processQuery(query))} className="search-btn">
                <DisplayIcon icon="searchIcon" fill="var(--ion-color-light)"/>
            </button>
        </div>
    )
}