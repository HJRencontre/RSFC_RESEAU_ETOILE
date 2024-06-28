import {useFetch} from "../../hooks/useFetch";

export default function Partners() {
  const {data: partnersData, error} = useFetch("/v1/api/partners/getAll");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!partnersData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Partners List</h1>
      <ul>
        {partnersData.map(partner => (
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