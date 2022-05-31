import "./ShopCard.css"

export default function ShopCard(props:any){
    
    return(
        <section className="shop-card font-inter">
            <h2 className="shop-name">
                {props.name}
            </h2>
        </section>
    )
}