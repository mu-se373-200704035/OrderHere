import { useHistory } from "react-router";
import { MainContext, useContext } from "./Context";
import "./Table.css";
export default function Table(props: any){
    
    let bg;
    let color;
    if(props.status===0){
        bg = "var(--ion-color-secondary)";
        color = "var(--ion-color-dark)";
    }else if(props.status===1){
        bg = "var(--ion-color-primary)";
        color = "var(--ion-color-light)";
    }else if(props.status===2){
        bg = "#297B8D";
        color = "var(--ion-color-light)";
    }else{
        bg = "#DEDEDE";
    }

    const colorStyle = {
        background: bg,
        color: color
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