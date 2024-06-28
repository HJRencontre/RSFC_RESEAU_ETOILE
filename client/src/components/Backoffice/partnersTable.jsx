import {useEffect, useState} from "react";

export default function PartnersTable() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetch("/v1/api/partners/getAll", {
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
        setPartners(data.rows);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, []);

  console.log('partners', partners)

  return (
    <div>
      <h1>Partners List</h1>
      <ul>
        {partners.map(partner => (
          <li key={partner.id}>
            <h2>{partner.name}</h2>
            <p>{partner.description}</p>
            {partner.website && <a href={partner.website} target="_blank" rel="noopener noreferrer">Website</a>}
          </li>
        ))}
      </ul>
    </div>
  )
}