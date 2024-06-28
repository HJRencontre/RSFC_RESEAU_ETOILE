import {useEffect, useState} from "react";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/v1/api/events/getAll", {
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
        setEvents(data);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, []);

  console.log('events', events)

  return (
    <>
      <div>
        <h1>Events List</h1>
        <ul>
          {events.map(event => (
            <li key={event.id}>
              <h2>{event.name}</h2>
              <p>{event.description}</p>
              <p>{event.start_date} - {event.end_date}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}