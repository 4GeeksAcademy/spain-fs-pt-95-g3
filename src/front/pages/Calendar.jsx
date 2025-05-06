import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Spinner, Alert } from "react-bootstrap";

const baseUrl = import.meta.env.VITE_API_URL;

const Calendar = () => {
  const [modalDate, setModalDate] = useState(null);
  const [show, setShow] = useState(false);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Para traer todas las comidas
  useEffect(() => {
    const fetchAllMeals = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${baseUrl}/api/meals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error cargando las comidas");
        const data = await res.json();
        setMeals(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchAllMeals();
  }, []);

  // comidas llevadas como eventos para el calendario
  const events = meals.map((m) => ({
    id: m.id,
    title: m.name,
    date: m.date, // YYYY-MM-DD
  }));

  const handleDateClick = (info) => {
    setModalDate(info.dateStr);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setModalDate(null);
  };

  //filtrado de comidas para el modal
  const mealsForDate = modalDate
    ? meals.filter((m) => m.date === modalDate)
    : [];

  return (
    <>
      <div className="card w-100">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Calendario de comidas</h5>
        </div>
        <div className="card-body mi-calendario">
          {loading && (
            <div className="text-center my-3">
              <Spinner animation="border" />
            </div>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && !error && (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              dateClick={handleDateClick}
              events={events}
              height="auto"
            />
          )}
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Plan de comidas — {modalDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mealsForDate.length === 0 ? (
            <p>No hay comidas guardadas para este día.</p>
          ) : (
            <ListGroup>
              {mealsForDate.map((m) => (
                <ListGroup.Item key={m.id}>
                  <strong>{m.name}</strong>: {m.description}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Calendar;
