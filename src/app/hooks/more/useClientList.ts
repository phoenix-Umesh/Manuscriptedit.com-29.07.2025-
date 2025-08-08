"use client"
// import { Partner } from '@/app/utils/interfaces';
import env from '@/env/env';
import { useState, useEffect } from 'react';


const useFetchClientList = () => {
    const [clientList, setClientList] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    console.log("clientList:" , clientList)

    useEffect(() => {
        fetchClientList()
    },[])

    const fetchClientList = async () => {
        setLoading(true)
        try {
          fetch(
            `https://secure.manuscriptedit.com/api/get_all_country_univer.php`, {
                method: "get",
              }
          ).then(response => {
            return response.json()
          }).then(data => {
            setClientList(data);
          }).catch((err) => {
            setLoading(false)
          })
          .finally(() => {
            setLoading(false);
          });
        } catch (error) {
          setError("something went wrong");
        }
    }

    return {
        clientList,
        loading,
        error
    }
}

export default useFetchClientList
