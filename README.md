# Fénix Web - Sistema de Gestión y Pedidos

![Logo de Fénix](https://st5.depositphotos.com/1020070/65598/v/600/depositphotos_655984974-stock-illustration-phoenix-bird-icon-firebird-fire.jpg)

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
    git clone https://github.com/federicozilberman/fenix-web.git
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
