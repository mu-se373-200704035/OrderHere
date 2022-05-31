// use this service only in React.useEffect since it has local storage implementations !!!
import { Storage } from "@capacitor/storage";

const rootURL = "https://orderhere.herokuapp.com";
const axios = require("axios").default;


const getSessionFromStorage : any = async () => {
    const session = await Storage.get({key: "session"});
    const sessionObject = session.value!=null && JSON.parse(session.value);
    if(sessionObject){
      try{
        const res = await axios.get(rootURL+"/auth/validate_token",{
          headers: sessionObject
        });
        return {data: res.data.data, status: res.status, headers: sessionObject}
      }
      catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
        } else {
          console.log('unexpected error: ', error);
        }
        return false;
      }
    }else{
      return false;
    }
}

export {
    getSessionFromStorage
}