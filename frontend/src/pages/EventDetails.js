import {
  Await,
  defer,
  json,
  redirect,
  useRouteLoaderData,
} from "react-router-dom";
import { Suspense } from "react";

import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";

function EventDetailsPage() {
  const { event, eventsList } = useRouteLoaderData("event-details");

  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>

      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={eventsList}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default EventDetailsPage;

async function eventLoader(id) {
  const response = await fetch("http://localhost:8080/events/" + id);

  if (response.ok) {
    const respData = await response.json();
    return respData.event;
  } else {
    throw json({ message: "Failed to fetch data" }, { status: 500 });
  }
}

async function eventsListLoader() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    throw json(
      { message: "There was an error" },
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData.events;
  }
}

export async function loader({ request, params }) {
  const id = params.eventId;

  return defer({
    event: await eventLoader(id),
    eventsList: eventsListLoader(),
  });
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
