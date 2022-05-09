import { IonItem } from "@ionic/react";
import "./Item.css";

export default function Item(props: any){
    
    const {name, price, description } = props; 
    
    return(
        <section className="item-wrapper">
            <div className="item-topline">
                <h3 className="item-name">{name}</h3>
                <h3 className="item-price">{price}</h3>
            </div>
            <h4 className="item-desc">{description}</h4>
        </section>
    )
}