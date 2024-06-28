import {useFetch} from "../../hooks/useFetch";

export default function Events() {
  const {data: eventData, error} = useFetch("/v1/api/events/getAll");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!eventData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h1>Events List</h1>
        <ul>
          {eventData.map(event => (
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