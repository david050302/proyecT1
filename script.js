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

document.getElementById('open-auth-modal').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('auth-modal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('auth-modal').style.display = 'none';
});

window.onclick = function(event) {
    if (event.target === document.getElementById('auth-modal')) {
        document.getElementById('auth-modal').style.display = 'none';
    }
};

document.getElementById('toggle-auth').addEventListener('click', function() {
    var loginForm = document.getElementById('login-form');
    var registerForm = document.getElementById('register-form');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        this.textContent = 'Registro';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        this.textContent = 'Iniciar Sesión';
    }
});

function login() {
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    
    alert('Iniciar sesión con: ' + email);
    document.getElementById('auth-modal').style.display = 'none';
}

function register() {
    var email = document.getElementById('register-email').value;
    var password = document.getElementById('register-password').value;
    var confirmPassword = document.getElementById('confirm-password').value;
    
    if (!email || !password || !confirmPassword) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }
    
    alert('Registrarse con: ' + email);
    document.getElementById('auth-modal').style.display = 'none';
}

function loadContent(bookId) {
    if (bookId) {
        window.location.href = bookId + '.html';
    } else {
        alert('ID del libro no válido.');
    }
}
