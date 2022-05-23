import "./TablesList.css";
import { nanoid } from "nanoid";
import Table from "./Table";

export default function TablesList(props: any){
    
    
    const tableElements = props.tables && props.tables.map((table: any)=>{
        return (
            <Table  
                key={nanoid()}
                table_id =  {table.id} 
                table_no =  {table.table_no}
                status   =  {table.status}
            />
        )
    })
    
    
    return(
        <section className="tables-grid-wrapper">
            <h2>Tables</h2>
            <div className="tables-grid">
                {tableElements}
            </div>
            <div className="divider-line"></div>
            <div className="tables-legend">
                <div className="table available">Available</div>
                <div className="table occupied">Occupied</div>
                <div className="table reserved">Reserved</div>
            </div>
        </section>
    )
}