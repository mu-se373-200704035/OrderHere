import "./Item.css";
export default function OrderItem(props: any){
    
    const {name, price, description, quantity} = props; 


    return(
        <section className="item-wrapper">
            <div className="item-topline">
                <h3 className="item-name">{name}</h3>
                <div className="controls-wrapper">
                    x{quantity}       
                </div>
                <h3 className="item-price">{price}</h3>
            </div>
            {description && <h4 className="item-desc">{description}</h4>}
        </section>
    )
}