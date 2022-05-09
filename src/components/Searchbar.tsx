import "./Searchbar.tsx";
import { IonSearchbar } from "@ionic/react";

export default function Searchbar(props: any){
    return(
        <IonSearchbar placeholder={props.placeholder}></IonSearchbar>
    )
}