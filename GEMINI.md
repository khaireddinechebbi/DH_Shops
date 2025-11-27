# Project Overview

This is a Next.js project bootstrapped with `create-next-app`. It appears to be a web application, likely an e-commerce platform called "Designers Haven," based on the file structure and dependencies.

**Key Technologies:**

*   **Framework:** Next.js (v14)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, with NextUI and daisyUI components.
*   **Authentication:** NextAuth.js
*   **Database:** MongoDB (inferred from `mongoose`)
*   **File Uploads:** UploadThing, Cloudinary, Multer
*   **Form Handling:** Formidable
*   **API Communication:** Axios

**Architecture:**

*   The project follows the standard Next.js App Router structure (`src/app`).
*   API routes are located in `src/app/api`.
*   Reusable UI components are in `src/components`.
*   Database models are defined in `src/models`.
*   Authentication is handled via NextAuth.js, with configuration likely in `src/lib/auth.ts`.
*   The application uses a context provider for state management (`src/context/CartContext.tsx`).
*   Route protection is implemented using middleware (`src/middleware.ts`), which protects the `/home`, `/profile`, `/orders`, and `/contact` routes.

**Features:**

*   **User Authentication:** Users can sign up and log in to the application.
*   **Product Management:** Users can create, view, update, and delete products.
*   **Product Catalog:** The application displays a catalog of all products on the home page.
*   **User Profiles:** Each user has a profile page that displays their information and the products they have listed.
*   **Shopping Cart:** The application includes a shopping cart feature, managed by `CartContext.tsx`.
*   **Orders:** Users can place orders for products.

**Data Models:**

*   **Product (`models/Products.ts`):**
    *   `title` (String, required)
    *   `priceInCents` (Number, required)
    *   `description` (String, required)
    *   `sizes` (Array of Strings, required)
    *   `category` (String, required)
    *   `brand` (String, required)
    *   `sex` (String, enum: ['men', 'women'], required)
    *   `images` (Array of Strings, required)
    *   `ownerEmail` (String, required)
    *   `ownerName` (String, required)
    *   `likes` (Array of User ObjectIds)
    *   `comments` (Array of comment objects with `user`, `text`, and `date`)

*   **User (`models/User.ts`):**
    *   `email` (String, unique, required)
    *   `password` (String, required)
    *   `name` (String, required)
    *   `bio` (String)
    *   `phone` (String)
    *   `image` (Array of Strings)
    *   `address` (Address sub-document)
    *   `products` (Array of Product ObjectIds)
    *   `orders` (Array of Order ObjectIds)
    *   `followers` (Array of User ObjectIds)
    *   `following` (Array of User ObjectIds)

*   **Order (`models/Orders.ts`):**
    *   `userEmail` (String, required)
    *   `address` (String, required)
    *   `items` (Array of CartItemSchema sub-documents)
    *   `totalPrice` (Number, required)

# Building and Running

*   **Development:** To run the development server, use one of the following commands:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

*   **Production Build:** To create a production build, run:
    ```bash
    npm run build
    ```

*   **Start Production Server:** To start the production server, run:
    ```bash
    npm run start
    ```

*   **Linting:** To run the linter, use:
    ```bash
    npm run lint
    ```

# Development Conventions

*   The project uses TypeScript for static typing.
*   Styling is done with Tailwind CSS.
*   The project uses ESLint for code linting, configured with `eslint-config-next`.
*   The codebase is structured with a clear separation of concerns (e.g., components, API routes, models).
