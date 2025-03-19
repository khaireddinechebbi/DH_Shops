# Designer's Haven

**Designer's Haven** is an e-commerce platform that empowers independent fashion designers by providing them with a space to sell their unique clothing designs to a broader audience. The platform enables designers to create profiles, list their products, and manage orders, while customers can browse, search, and purchase designs.

## Features

- **Designer Profiles**: Designers can create and manage profiles, showcasing their clothing designs.
- **Product Listings**: Designers can list products with images, descriptions, and prices.
- **User Authentication**: Customers and designers can securely sign up, log in, and manage their accounts using **NextAuth.js** for authentication.
- **Product Search and Filter**: Customers can search for products by categories, designer, and other attributes.
- **Shopping Cart**: Users can add items to their shopping cart and proceed to checkout.
- **Order Tracking**: Customers can view the status of their orders.
  
## Tech Stack

- **Frontend & Backend**:
  - **Next.js**: A full-stack React framework for building dynamic websites. It handles both frontend and backend (API routes).
  - **NextAuth.js**: Authentication library for Next.js that simplifies implementing authentication with support for various OAuth providers (e.g., Google, GitHub) or custom credentials.
  
- **Database**:
  - **MongoDB**: NoSQL database used for storing user information, product listings, and orders.
  
- **Hosting & Deployment**:
  - **Vercel**: Deployed on Vercel to take full advantage of Next.js features like server-side rendering and API routes.

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js**: [Install Node.js](https://nodejs.org/)
- **MongoDB**: [Install MongoDB](https://www.mongodb.com/try/download/community)
- **Stripe Account**: [Sign up for Stripe](https://stripe.com)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/khaireddinechebbi/DH_Shops.git
   cd designers-haven
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Authentication with NextAuth.js

**NextAuth.js** is used for authentication, and it supports various OAuth providers (Google, GitHub, etc.) or custom credentials. Users can log in using their credentials or sign up with their Google or GitHub accounts. The session is managed server-side, ensuring secure access.

For more information on how authentication works, visit the [NextAuth.js documentation](https://next-auth.js.org/).


## Acknowledgments

- Special thanks to the contributors of open-source libraries such as **Next.js** and **NextAuth.js** for making this project possible.

