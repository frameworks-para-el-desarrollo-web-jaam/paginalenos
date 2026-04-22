import { useState, useEffect } from "react";
import { API_URL } from "../config/api";

const Comentarios = () => {
    const [comentario, setComentario] = useState("");
    const [puntuacion, setPuntuacion] = useState(5);
    const [listaComentarios, setListaComentarios] = useState([]);
    const [error, setError] = useState("");

    // Obtener comentarios del backend
    const obtenerComentarios = async () => {
        const response = await fetch(`${API_URL}/comentarios`);
        const data = await response.json();
        setListaComentarios(data);
    };

    useEffect(() => {
        obtenerComentarios();
    }, []);

    // Enviar comentario
    const enviarComentario = async (e) => {
        e.preventDefault();
        setError("");

        const response = await fetch(`${API_URL}/comentarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ comentario, puntuacion }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data?.message?.[0] || data?.mensaje || "No se pudo enviar el comentario");
            return;
        }

        setComentario("");
        setPuntuacion(5);
        obtenerComentarios();
    };

    return (
        <div>
            <h2>Sistema de Comentarios</h2>
            <form onSubmit={enviarComentario}>
                <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe un comentario..."
                    maxLength={200}
                    required
                />
                <br />
                <input
                    type="number"
                    min="1"
                    max="5"
                    step="1"
                    value={puntuacion}
                    onChange={(e) => setPuntuacion(e.target.value)}
                    placeholder="Puntuacion"
                    required
                />
                <br />
                <button type="submit" className="bg-black">Enviar</button>
            </form>

            {error ? <p>{error}</p> : null}

            <h3>Comentarios:</h3>
            <ul>
                {listaComentarios.map((c) => (
                    <li key={c.id}>
                        {c.texto} - Puntuacion: {c.puntuacion}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Comentarios;
