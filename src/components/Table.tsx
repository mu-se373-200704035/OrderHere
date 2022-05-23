import { useHistory } from "react-router";
import { MainContext, useContext } from "./Context";
import "./Table.css";
export default function Table(props: any){
    
    let color;
    if(props.status===0){
        color = "var(--ion-color-secondary)";
    }else if(props.status===1){
        color = "var(--ion-color-primary)";
    }else if(props.status===2){
        color = "var(--ion-color-secondary-tint)";
    }else{
        color = "#DEDEDE";
    }

    const colorStyle = {
        background: color
    }
    
    const {setCurrentPageDetails} = useContext(MainContext);
    const history = useHistory();

    const gotoTableDetails = (id: number) => {
        setCurrentPageDetails((prevDetails:any)=>{
            return{
                ...prevDetails,
                page: "/admin/tables/details",
                table_id: id,
                table_no: props.table_no
            }
        });
        history.push("/admin/tables/details");
    }

    return(
        <div onClick={()=>gotoTableDetails(props.table_id)}
            style={colorStyle} className="table-background">
            <h3 className="table-no">{props.table_no}</h3>
        </div>
    )
}