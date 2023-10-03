import { json, useLoaderData, redirect } from "react-router-dom";

import EventItem from "../components/EventItem";

function EventDetailsPage() {
  const data = useLoaderData();

  return (
    <>
      <h1>Event Details</h1>
      <EventItem event={data.event} />
    </>
  );
}

export default EventDetailsPage;

export async function loader({ request, params }) {
  const id = params.eventId;

  const response = await fetch("http://localhost:8080/events/" + id);

  if (response.ok) {
    return response;
  } else {
    throw json({ message: "Failed to fetch data" }, { status: 500 });
  }
}

export async function action({ request, params }) {
  const id = params.eventId;

  const response = await fetch("http://localhost:8080/events/" + id, {
    method: request.method,
  });

  if (!response.ok) {
    throw json({ message: "Failed to delete event!" }, { status: 500 });
  }

  return redirect("/events");
}
