# Social Media Planner Dashboard

A comprehensive, customizable dashboard for managing social media posts across multiple clients. Built with Astro and React.

## Features

### 📊 Dashboard Overview
- Real-time statistics for clients, posts, and scheduling
- Upcoming posts preview
- Post status breakdown (Drafts, Scheduled, Published)
- Recent posts activity

### 📅 Calendar View
- Full calendar view showing all posts across all clients
- Color-coded by client for easy identification
- Navigate between months
- Click on posts to edit them
- See all scheduled dates at a glance

### 👥 Client Management
- Add, edit, and delete clients
- Assign custom colors to each client
- Select platforms per client (Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube)
- Store client contact information

### 📝 Post Management
- Create and edit posts for any client
- Schedule posts with date and time
- Assign posts to specific platforms
- Set post status (Draft, Scheduled, Published)
- Add media URLs
- View all posts in a grid layout

### 🎨 Customizable
- Color-coded clients for visual organization
- Responsive design
- Modern, clean interface
- Local storage persistence (data saved in browser)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The dashboard will be available at `http://localhost:4321`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Usage

1. **Add Clients**: Go to the Clients section and add your clients. Assign each client a color and select their platforms.

2. **Create Posts**: Click "New Post" to create a post. Select the client, platform, schedule date/time, and write your content.

3. **View Calendar**: Navigate to the Calendar view to see all scheduled posts across all clients in a calendar format.

4. **Manage Posts**: View all posts in the "All Posts" section, or edit them directly from the calendar or overview.

## Data Persistence

All data (clients and posts) is stored in your browser's localStorage. This means:
- Your data persists between sessions
- Data is stored locally on your device
- No backend required

## Technologies

- **Astro** - Web framework
- **React** - UI library
- **date-fns** - Date manipulation
- **lucide-react** - Icons

## Deployment

This project is configured for Vercel deployment. To deploy:

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import the repository: `MariosKif/Social_Media_Platform`
4. Vercel will auto-detect Astro settings
5. Click "Deploy"

The site will be live at `your-project.vercel.app` and will automatically redeploy on every push to GitHub.
