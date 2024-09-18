document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('auth-modal');
    const userInfoContainer = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');
    const openAuthModalButton = document.getElementById('open-auth-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleAuthButton = document.getElementById('toggle-auth');
    
    let isLoggedIn = false; // Variable para rastrear el estado de inicio de sesión

    // Mostrar el modal de autenticación o el menú desplegable de usuario
    openAuthModalButton.addEventListener('click', () => {
        if (!isLoggedIn) {
            authModal.style.display = 'block';
        } else {
            userInfoContainer.style.display = userInfoContainer.style.display === 'none' ? 'block' : 'none';
        }
    });

    // Cerrar el modal
    document.querySelector('.close').addEventListener('click', () => {
        authModal.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target === authModal) {
            authModal.style.display = 'none';
        }
    };

    // Cambiar entre el formulario de inicio de sesión y el formulario de registro
    toggleAuthButton.addEventListener('click', () => {
        if (loginForm.style.display === 'none') {
            loginForm.style.display = 'flex';
            registerForm.style.display = 'none';
            toggleAuthButton.textContent = 'Registro';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'flex';
            toggleAuthButton.textContent = 'Iniciar Sesión';
        }
    });

    // Manejar inicio de sesión
    document.getElementById('login-button').addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Esperamos un JSON con la información del usuario
            } else {
                throw new Error('Correo o contraseña incorrectos');
            }
        })
        .then(data => {
            authModal.style.display = 'none'; // Ocultar modal
            userNameSpan.textContent = data.email; // Mostrar el correo en el elemento <span>
            userInfoContainer.style.display = 'block'; // Mostrar información del usuario
            isLoggedIn = true; // Actualizar el estado de inicio de sesión
        })
        .catch(error => alert(error.message));
    });

    // Manejar registro
    document.getElementById('register-button').addEventListener('click', () => {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error('Error:', error));
    });

    // Manejar cierre de sesión
    document.getElementById('logout-button').addEventListener('click', () => {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Asegúrate de enviar las cookies de sesión
        })
        .then(response => response.text())
        .then(message => {
            // Oculta el div cuando la sesión se cierra
            document.getElementById('user-info').style.display = 'none';
            // Opcional: Redirige a la página de inicio o muestra un mensaje de éxito
            window.location.href = '/'; // Redirige a la página de inicio (opcional)
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión');
        });
    });
    
    
});

// Función para buscar libros
function searchBooks() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const books = document.querySelectorAll('.book');

    books.forEach(book => {
        const title = book.getAttribute('data-title').toLowerCase();
        if (title.includes(searchInput)) {
            book.style.display = '';
        } else {
            book.style.display = 'none'; 
        }
    });
}

// Función para cargar contenido basado en ID del libro
function loadContent(bookId) {
    if (bookId) {
        fetch('pages/' + bookId + '.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el contenido.');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('book-summary').innerHTML = data;
                document.getElementById('book-modal').style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('No se pudo cargar el contenido.');
            });
    } else {
        alert('ID del libro no válido.');
    }
}

// Cerrar el modal cuando se hace clic en la "X"
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('book-modal').style.display = 'none';
});

// Cerrar el modal cuando se hace clic fuera del contenido del modal
window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('book-modal')) {
        document.getElementById('book-modal').style.display = 'none';
    }
});


