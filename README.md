# 🎬 CineZone - Movie Ticket Booking Platform

A modern, full-featured movie ticket booking web application built with React, Redux, and Vite.

![CineZone Banner](https://placehold.co/1200x400/1a1a1a/ffffff?text=CineZone)

## ✨ Features

### 🎯 User Features

- 🏠 **Home Page** - Featured movies with smooth animations
- 🎥 **Movie Catalog** - Browse and filter movies
- 🎫 **Seat Booking** - Interactive seat selection
- 👤 **User Profile** - Manage personal information
- 📜 **Booking History** - View past and upcoming bookings
- ❤️ **Favorites** - Save favorite movies
- 🔍 **Search** - Find movies quickly
- 📱 **Responsive Design** - Works on all devices

### 🛠️ Admin Features

- 📊 **Dashboard** - Analytics and statistics
- 🎬 **Manage Shows** - Add/edit movie showings
- 📋 **Manage Bookings** - View all bookings
- 🎭 **Movie Management** - Add/update movies

## 🚀 Tech Stack

### Frontend

- ⚛️ **React 18** - UI library
- 🔄 **Redux Toolkit** - State management
- 🎨 **Tailwind CSS** - Styling
- 🎭 **Framer Motion** - Animations
- 📡 **Axios** - HTTP client
- 🧭 **React Router** - Navigation
- 🎯 **Lucide React** - Icons

### Backend Integration

- 🔐 **JWT Authentication** - Secure login
- 🌐 **RESTful API** - Backend communication
- 📡 **WebSocket** - Real-time updates (seat booking)

### Tools

- ⚡ **Vite** - Build tool
- 🐍 **Python Scripts** - Data crawling & image upload
- 📦 **npm** - Package manager

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for scripts)

### Clone Repository

```bash
git clone https://github.com/yourusername/cinezone.git
cd cinezone
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://cinezone-be.onrender.com/api
VITE_WS_URL=ws://localhost:8080
```

### Run Development Server

```bash
npm run dev
```

The app will run at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
CineZone/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons
│   ├── components/     # Reusable components
│   │   └── admin/     # Admin components
│   ├── context/       # React Context (Auth)
│   ├── pages/         # Page components
│   │   └── admin/    # Admin pages
│   ├── redux/        # Redux store & reducers
│   ├── service/      # API services
│   └── utils/        # Helper functions
├── .env              # Environment variables (not in repo)
├── .gitignore
├── package.json
└── vite.config.js
```

## 🎯 Key Features Implementation

### 1. **Authentication**

- JWT token-based authentication
- Session storage for tokens
- Protected routes
- Auto-redirect on logout

### 2. **Seat Booking System**

- Real-time seat availability via WebSocket
- Interactive seat selection
- Visual seat status (available/booked/selected)
- Booking confirmation

### 3. **Movie Management**

- Dynamic movie fetching
- Filter by genre, year, rating
- Movie details with cast information
- Trailer integration

### 4. **Responsive Design**

- Mobile-first approach
- Tailwind CSS utilities
- Animated navbar with flowing effects
- Smooth page transitions

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Linting
npm run lint         # ESLint check

# Python Scripts
python utils/CrawlMovieFromImDb.py           # Crawl movie data
python utils/uploadImageIntoCloudinary.py    # Upload images
```

## 🌟 Screenshots

### Home Page

![Home 1](https://res.cloudinary.com/dzjhwjwah/image/upload/v1781252078/c4d5d31f-4c18-415c-b738-7a297d71fa21_dltrqj.jpg)

![Home 2](https://res.cloudinary.com/dzjhwjwah/image/upload/v1781252078/dcc4195e-ae22-4bb5-8a0e-1c6fb6ee4e1a_dgzsuz.jpg)


### Movie Details

![Movie Details](https://res.cloudinary.com/dzjhwjwah/image/upload/v1781252079/446c4847-6c7e-434b-8b4e-3712a7904bed_wbdvyx.jpg)

### Seat Selection

![Seats](https://res.cloudinary.com/dzjhwjwah/image/upload/v1781252079/16cf68ec-b929-40d0-afed-b5d156660182_k2npet.jpg)

### Admin Dashboard

![Admin](https://res.cloudinary.com/dzjhwjwah/image/upload/v1781252267/8c9e72f8-2081-480c-abe6-3e925a45d3b3.png)

## 🔐 Environment Variables

| Variable       | Description     | Example                     |
| -------------- | --------------- | --------------------------- |
| `VITE_API_URL` | Backend API URL | `https://cinezone-be.onrender.com/api` |
| `VITE_WS_URL`  | WebSocket URL   | `ws://localhost:8080`       |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tran Ngoc Thanh Long**

- GitHub: [@ThanhLong27042003](https://github.com/ThanhLong27042003)
- Email: tranngocthanhlong03@gmail.com

## 🙏 Acknowledgments

- Movie data from [TMDb API](https://www.themoviedb.org/)
- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern cinema websites

## 📞 Support

For support, email tranngocthanhlong03@gmail.com or open an issue.

---

⭐ Star this repo if you find it helpful!
