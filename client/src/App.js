// import React, { useEffect, useState } from 'react'
import Routes from "./components/Routes";
import { UidContext } from "./components/AppContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.action";

const App = () => {

  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();


  useEffect(() => {

    const fetchToken = async () => {
      console.log('fetchToken :', process.env.REACT_APP_API_URL);
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true
      }).then((res) => {
        console.log('app trest :', res);
        setUid(res.data);

        console.log('on rentre dans app.js then setUid :',);
      })
        .catch((err) => console.log('no Token App.js', err))
    }
    fetchToken()

    if (uid)
      dispatch(getUser(uid))

    console.log('uid :', uid);
  }, [uid])

  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
}

export default App;