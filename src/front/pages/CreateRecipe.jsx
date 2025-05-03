import { useState } from "react";
import { Form, Button, Spinner, Alert, Card, ListGroup } from "react-bootstrap";

const baseUrl = import.meta.env.VITE_API_URL;

export const CreateRecipe = () => {
  const [name, setName] = useState("");
  const [mainIngredients, setMainIngredients] = useState("");
  const [loadingGen, setLoadingGen] = useState(false);
  const [genError, setGenError] = useState(null);
  const [generated, setGenerated] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generar receta con OpenAI
  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoadingGen(true);
    setGenError(null);
    setGenerated(null);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${baseUrl}/api/recipes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, mainIngredients }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || "Error generando receta");
      setGenerated(payload.recipe);
    } catch (err) {
      setGenError(err.message);
    } finally {
      setLoadingGen(false);
    }
  };

  // Guardar receta generada en base de datos
  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${baseUrl}/api/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(generated),
      });
      const payload = await res.json();
      if (res.status === 409) throw new Error("Ya existe una receta con ese nombre");
      if (!res.ok) throw new Error(payload.message || "Error guardando receta");
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <h2>Crear Nueva Receta</h2>

      <Form onSubmit={handleGenerate}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre de la receta</Form.Label>
          <Form.Control
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej: Pollo al curry"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ingredientes principales</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={mainIngredients}
            onChange={e => setMainIngredients(e.target.value)}
            placeholder="Ej: Pollo, leche de coco, curry en polvo, cebolla..."
            required
          />
        </Form.Group>

        {genError && <Alert variant="danger">{genError}</Alert>}

        <Button type="submit" variant="primary" disabled={loadingGen}>
          {loadingGen ? <Spinner animation="border" size="sm" /> : "Generar Receta"}
        </Button>
      </Form>

      {generated && (
        <Card className="mt-4">
          <Card.Header>Receta Generada</Card.Header>
          <Card.Body>
            <Card.Title>{generated.title}</Card.Title>
            <Card.Text><strong>Descripción:</strong> {generated.description}</Card.Text>
            <ListGroup variant="flush" className="mb-3">
              <ListGroup.Item><strong>Porciones:</strong> {generated.servings}</ListGroup.Item>
              <ListGroup.Item>
                <strong>Macronutrientes (por porción):</strong><br/>
                {Object.entries(generated.macros).map(([k,v]) => `${k}: ${v}`).join(", ")}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Ingredientes:</strong>
                <ul>
                  {generated.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Instrucciones:</strong>
                <ol>
                  {generated.instructions.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
              </ListGroup.Item>
            </ListGroup>

            {saveError && <Alert variant="danger">{saveError}</Alert>}
            {saveSuccess && <Alert variant="success">Receta guardada correctamente 🎉</Alert>}

            <Button
              variant="success"
              onClick={handleSave}
              disabled={saving || saveSuccess}
            >
              {saving ? <Spinner animation="border" size="sm" /> : "Guardar Receta"}
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};
