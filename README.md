<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
# Fénix Web - Sistema de Gestión y Pedidos

![Logo de Fénix](httpshttps://st5.depositphotos.com/1020070/65598/v/600/depositphotos_655984974-stock-illustration-phoenix-bird-icon-firebird-fire.jpg)

## Descripción del Proyecto

Este proyecto es el sitio web corporativo y el sistema de gestión de pedidos (SFGO) para **Fénix Ropa de Trabajo**, una empresa de indumentaria laboral en Junín, Argentina. La aplicación está diseñada para modernizar y profesionalizar el proceso de cotización y seguimiento de pedidos, tanto para los clientes como para el equipo interno.

El proyecto nació de la necesidad de organizar los procesos comerciales, mejorar la trazabilidad de los pedidos personalizados (estampados y bordados) y establecer una presencia digital sólida y profesional para la marca.

**Sitio en Producción:** `[Link a tu web en Netlify cuando esté desplegada]`

---

## 🚀 Características Principales

### Para Clientes:
* **Catálogo de Productos:** Visualización de productos con detalles, imágenes y talles disponibles.
* **Formulario de Pedido Guiado:** Un proceso de 4 pasos para que los clientes puedan solicitar presupuestos de manera clara y sin errores.
* **Seguimiento de Pedidos:** Una sección pública para consultar el estado de un pedido en tiempo real.
* **Guía de Talles Interactiva:** Ayuda visual para que los clientes elijan el talle correcto.
* **Libro de Quejas Online:** Un canal formal para la gestión de reclamos.

### Para Administradores:
* **Dashboard de Gestión:** Un panel de control seguro para visualizar y gestionar todos los pedidos y quejas.
* **Autenticación Segura:** Acceso mediante Email/Contraseña o Google, con autorización por roles.
* **Gestión de Estados:** Capacidad de actualizar el estado de cada pedido a lo largo de su ciclo de vida (Nuevo, En Producción, Entregado, etc.).
* **Historial de Acciones:** Trazabilidad completa de cada cambio realizado en un pedido o reclamo.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React, Tailwind CSS
* **Backend & Base de Datos:** Firebase (Firestore, Authentication)
* **Funciones Serverless:** Netlify Functions (para el envío seguro de emails)
* **Hosting:** Netlify
* **Librerías Clave:** Framer Motion, React Router, Lucide Icons

---

## 🏁 Cómo Empezar (Desarrollo Local)

Para correr este proyecto en tu máquina local, seguí estos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/federicozilberman/fenix-web.git](https://github.com/federicozilberman/fenix-web.git)
    cd fenix-web
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Creá un archivo `.env` en la raíz del proyecto y agregá tus claves de configuración de Firebase. Podés usar el archivo `.env.example` como guía.

    *.env.example*
    ```
    REACT_APP_FIREBASE_API_KEY=AIza...
    REACT_APP_FIREBASE_AUTH_DOMAIN=fenix-sfgo.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=fenix-sfgo
    REACT_APP_FIREBASE_STORAGE_BUCKET=fenix-sfgo.appspot.com
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=112...
    REACT_APP_FIREBASE_APP_ID=1:112...
    ```

4.  **Correr la aplicación:**
    ```bash
    npm start
    ```
    La aplicación se abrirá en [http://localhost:3000](http://localhost:3000).

---

## 👨‍💻 Autor

* **Federico Zilberman** - [GitHub](https://github.com/federicozilberman)
>>>>>>> 826d53ce998597ffde5bcd9555e7186ebfb75d4f
