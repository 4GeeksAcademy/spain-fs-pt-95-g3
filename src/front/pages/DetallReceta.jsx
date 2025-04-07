import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {Container, Row, Col, Image, Button, Spinner} from 'react-bootstrap'

export const DetallReceta = () => {
    const {id} = useParams();
    const [receta, setReceta] = useState(null)
    const [loading, setLoading] = useState(true);

    const fetchRecetaCompleta = async () => {
        try {const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
            const response = await axios.get(
                `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
            );

            const recetasDetalladas = JSON.parse(localStorage.getItem('recetasDetalladas')) || {};
            recetasDetalladas[id] = response.data
            localStorage.setItem('recetasDetalladas', JSON.stringify(recetasDetalladas));

                setReceta(response.data);
            } catch (error) {
                console.error("Error fetching recipe:", error);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            const cachedRecetas =JSON.parse(localStorage.getItem('recetasDetalladas')) || {};

            if (cachedRecetas[id]) {
                setReceta(cachedRecetas[id]);
                setLoading(false);                
            }
            else {
                fetchRecetaCompleta();
            }
        }, [id]);     

    if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
    if (!receta) return <div className="alert alert-danger">Receta no encontrada</div>;

    return (
        <Container className="my-5">
            <Row>
                <Col md={6}>
                    <Image
                      src={receta.image}
                      alt={receta.title}
                      fluid
                      className="rounded shadow" />
                </Col>
                <Col md={6}>
                    <h1>{receta.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: receta.summary  }} />

                    <h3 className=" mt-4">Ingredientes</h3>
                    <ul>
                        {receta.extendedIngredients.map((ingrediente) =>(
                            <li key={ingrediente.id}>{ingrediente.original}</li>
                        ))}
                    </ul>

                    <h3>Instrucciones</h3>
                    <div dangerouslySetInnerHTML={{__html: receta.instructions || "No hay instrucciones disponibles"}} />
                </Col>
            </Row>
        </Container>
    );
};