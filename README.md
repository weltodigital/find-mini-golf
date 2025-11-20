# Find Mini Golf

A modern web application to help people find mini golf venues across the UK. Built with Next.js, TypeScript, and PostgreSQL.

## Features

- 🗺️ Interactive map showing all venues
- 🔍 Advanced search and filtering
- 📱 Mobile-responsive design
- ⚡ Fast, modern web performance
- 🎯 SEO optimized
- 📊 550+ mini golf venues

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet with OpenStreetMap
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd find-mini-golf
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings → Database and note your connection details
   - Copy your project URL and anon key

4. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=your-supabase-postgres-url
```

5. Set up the database:
   - Go to your Supabase dashboard → SQL Editor
   - Run the SQL from `scripts/setup-supabase.sql`

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Data Migration

To import the WordPress data:

1. Ensure the `findminigolf_com-backup.sql` file is in the root directory
2. Run the migration script:
```bash
npm run db:migrate
```

This will import all 553 venues from your WordPress site into Supabase.

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── venues/         # Venues pages
│   └── globals.css     # Global styles
├── components/         # Reusable React components
├── lib/               # Utility functions and database
├── prisma/            # Database schema and migrations
├── scripts/           # Data migration scripts
└── public/            # Static assets
```

## Database Schema

- **Venues**: Mini golf venue information
- **Regions**: Geographic regions for organizing venues

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Original WordPress site data
- OpenStreetMap for map tiles
- All the mini golf venues featured on the site