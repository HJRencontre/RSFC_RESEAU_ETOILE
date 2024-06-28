import {useEffect, useState} from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data.rows);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        setError(error);
      });
  }, [url]);

  return {data, error};
}