export default function OrderWrapper(props: any){
    
    return(
        <div className="order-wrapper">
            <h3>table {props.table_no}</h3>
            {props.orders}
        </div>
    )
}