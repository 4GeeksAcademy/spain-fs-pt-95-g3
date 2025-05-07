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
  
    //  Convertir el string a array
    const ingredientsArray = mainIngredients
      .split(",")
      .map(i => i.trim())
      .filter(i => i);
  
    console.log("Enviando:", { name, mainIngredients: ingredientsArray });
  
    try {
      const token = localStorage.getItem("access_token");
      //Llamada al endpoint
      const res = await fetch(`${baseUrl}/api/recipes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          mainIngredients: ingredientsArray
        }),
      });
  
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || payload.message);
  
      // Guardar la receta recibida
      setGenerated(payload.recipe);
    } catch (err) {
      setGenError(err.message);
    } finally {
      setLoadingGen(false);
    }
  };
  
  // Guardar la receta en laase de datos
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
        console.log("Payload de error:", payload);
        if (!res.ok) throw new Error(payload.error || payload.message);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4"
      style={{
        color: "#2c3e50",
        fontWeight: "700",
        textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
        position: "relative",
        paddingBottom: "10px"
      }}>Crear Nueva Receta</h1>

      <Form onSubmit={handleGenerate}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre de la receta</Form.Label>
          <Form.Control
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej: Lasaña"
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
            placeholder="Ej: Salsa boloñesa, salsa bechamel..."
            required
          />
        </Form.Group>

        {genError && <Alert variant="danger">{genError}</Alert>}

        <Button type="submit" variant="info text-white" disabled={loadingGen}>
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
            {saveSuccess && <Alert variant="info">Receta guardada correctamente 🎉</Alert>}

            <Button
              variant="info"
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
