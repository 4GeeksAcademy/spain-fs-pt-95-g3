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
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [error, setError] = useState(null);

  const handleDateClick = (info) => {
    const dateStr = info.dateStr;
    setModalDate(dateStr);
    fetchMealsForDate(dateStr);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setModalDate(null);
    setMeals([]);
    setError(null);
  };

  const fetchMealsForDate = async (date) => {
    setLoadingMeals(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${baseUrl}/api/meals`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error cargando las comidas");
      const data = await res.json();
      // Filtramos por la fecha seleccionada:
      const filtered = data.filter(m => m.date === date);
      setMeals(filtered);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoadingMeals(false);
    }
  };

  return (
    <>
      <div className="card w-100">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Calendario de comidas</h5>
        </div>
        <div className="card-body">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
            height="auto"
          />
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Plan de comidas — {modalDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingMeals && (
            <div className="text-center my-3">
              <Spinner animation="border" />
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loadingMeals && !error && meals.length === 0 && (
            <p>No hay comidas guardadas para este día.</p>
          )}

          {!loadingMeals && meals.length > 0 && (
            <ListGroup>
              {meals.map((m) => (
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
