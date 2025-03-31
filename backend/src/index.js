const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3005;

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'example', // Cambia esto si tienes un usuario diferente
    password: 'example', // Cambia esto por tu contraseña
    database: 'movie_db'
});

// Conectar a MySQL
db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

// Obtener todos los películas
app.get('/movies', (req, res) => {
    db.query('SELECT * FROM movies', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});


// Obtener todos los actores
app.get('/casting', (req, res) => {
    db.query('SELECT * FROM casting', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});


// Obtener todos las categorías
app.get('/categories', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Obtener todos las sagas
app.get('/sagas', (req, res) => {
    db.query('SELECT * FROM saga', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});


app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});


// Obtener películas por categorías
app.get('/movies/categories/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT m.id AS movie_id, m.name AS movie_name, m.url, m.length AS movie_leng, m.director AS movie_director, m.year AS movie_year, m.saga_id AS movie_saga FROM movies m LEFT JOIN movies_categories cat ON m.id = cat.movie_id WHERE cat.category_id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Sin resultados' });
            return;
        }
        //res.json(results[0]);
        res.json(results);
    });
});


// Obtener películas por búsqueda
app.get('/movies/find/:search', (req, res) => {
    const search = req.params.search;
    const searchQuery = `%${search}%`;
    db.query('SELECT * FROM movies WHERE name LIKE ? OR description LIKE ?', [searchQuery, searchQuery], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Obtener actores por búsqueda
app.get('/casting/find/:search', (req, res) => {
    const search = req.params.search;
    const searchQuery = `%${search}%`;
    db.query('SELECT * FROM casting WHERE name LIKE ? OR bio LIKE ?', [searchQuery, searchQuery], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});


// Obtener películas por actor
app.get('/movies/casting/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT m.id AS movie_id, m.name AS movie_name, m.url, m.length AS movie_leng, m.director AS movie_director, m.year AS movie_year, m.saga_id AS movie_saga FROM movies m LEFT JOIN movies_cast ca ON m.id = ca.movie_id WHERE ca.cast_id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Sin resultados' });
            return;
        }
        //res.json(results[0]);
        res.json(results);
    });
});

// Obtener películas por saga
app.get('/movies/sagas/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM movies WHERE saga_id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Sin resultados' });
            return;
        }
        //res.json(results[0]);
        res.json(results);
    });
});

// Obtener favoritos por usuario
app.get('/users/favorites/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT m.id AS movie_id, m.name AS movie_name, m.url, m.length AS movie_leng, m.director AS movie_director, m.year AS movie_year, m.saga_id AS movie_saga FROM movies m LEFT JOIN favorites fa ON m.id = fa.movie_id WHERE fa.user_id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Sin resultados' });
            return;
        }
        //res.json(results[0]);
        res.json(results);
    });
});

// insertar favoritos por usuario
app.post('/movies/:id_movie/fav/:id_usuario', (req, res) => {
    const { id_movie, id_usuario } = req.params;

    db.query('INSERT INTO favorites (user_id, movie_id) VALUES (?, ?)', [id_usuario, id_movie], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Película añadida a favoritos', insertId: results.insertId });
    });
});

// Eliminar favoritos usuario
app.put('/movies/:id_movie/del-fav/:id_usuario', (req, res) => {
    const { id_movie, id_usuario } = req.params;

    db.query('DELETE FROM `favorites` WHERE user_id = ? AND movie_id = ?', [id_usuario, id_movie], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Verificar si se eliminó alguna fila
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'No se encontró la película en favoritos' });
            return;
        }

        res.status(200).json({ message: 'Película eliminada de favoritos' });
    });
});



/*
// Obtener todos los usuarios
app.get('/users', (req, res) => {
    db.query('SELECT u.id AS user_id, u.name AS user_name, u.email, ml.id AS music_list_id, ml.name AS music_list_name, ml.description, ml.created_at AS list_created_at FROM users u LEFT JOIN music_lists ml ON u.id = ml.user_id', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Obtener un usuario por ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT u.id AS user_id, u.name AS user_name, u.email, ml.id AS music_list_id, ml.name AS music_list_name, ml.description, ml.created_at AS list_created_at FROM users u LEFT JOIN music_lists ml ON u.id = ml.user_id WHERE u.id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.json(results[0]);
    });
});
*/

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
