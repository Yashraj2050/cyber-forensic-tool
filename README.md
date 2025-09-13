# 🔍 Cyber Forensic Tool - TOR Network De-anonymization Platform

A comprehensive full-stack web application designed to de-anonymize malicious entities on onion sites (TOR networks). Built for hackathon demos with advanced AI-powered analysis and blockchain tracing capabilities.

## 🎯 Features

### Core Functionality
- **Entity Analysis**: Search and analyze malicious entities across TOR networks
- **Blockchain Graph Visualization**: Interactive wallet connection mapping with transaction flow analysis
- **Automated Reporting**: Generate comprehensive forensic reports in JSON/PDF formats
- **AI-Powered Analysis**: Stylometry detection and entity extraction using advanced NLP

### Technical Capabilities
- **Stylometry Analysis**: Detect if multiple posts are written by the same author
- **Entity Extraction**: Automatically identify usernames, emails, crypto wallets, and other entities
- **Blockchain Tracing**: Track cryptocurrency transactions and wallet connections
- **Risk Assessment**: AI-powered threat evaluation and risk scoring
- **Real-time Monitoring**: Dashboard with live statistics and alerts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional)

### Local Development

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd cyber-forensic-tool
npm install
```

2. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

3. **Load sample data (for demo)**
```bash
# This will populate the database with sample entities, posts, and transactions
curl -X POST http://localhost:3000/api/sample-data \
  -H "Content-Type: application/json"
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Docker Deployment

1. **Using Docker Compose (Recommended)**
```bash
# Build and start the application
docker-compose --profile init up --build

# For subsequent runs
docker-compose up -d
```

2. **Using Docker directly**
```bash
# Build the image
docker build -t cyber-forensic-tool .

# Run the container
docker run -p 3000:3000 cyber-forensic-tool
```

## 📊 API Endpoints

### Core APIs
- `GET /api/entities` - List entities with search and pagination
- `POST /api/entities` - Create new entity
- `GET /api/transactions` - List transactions with filtering
- `POST /api/transactions` - Create new transaction
- `GET /api/reports` - List forensic reports
- `POST /api/reports` - Generate new report

### AI Analysis APIs
- `POST /api/ai-analysis` - Perform AI-powered analysis
  - `type: "stylometry"` - Writing style analysis
  - `type: "entity_extraction"` - Extract entities from text
  - `type: "risk_assessment"` - Assess entity risk level

### Data Management
- `POST /api/sample-data` - Load sample demo data

## 🎨 User Interface

### Dashboard Overview
- **Real-time Statistics**: Live counters for entities, wallets, transactions, and reports
- **Search Functionality**: Global search across all data types
- **Status Indicators**: Active monitoring and threat alerts

### Entity Analysis Tab
- **Entity Search**: Search by alias, username, or email
- **Risk Assessment**: Visual risk level indicators
- **Linked Identities**: View connected entities and relationships
- **Stylometry Analysis**: AI-powered writing pattern comparison

### Blockchain Graph Tab
- **Interactive Visualization**: Sankey diagram of wallet connections
- **Transaction Analytics**: Volume trends and patterns
- **Suspicious Activity**: Automated detection of high-risk transactions
- **Wallet Analysis**: Individual wallet risk assessment

### Reports Tab
- **Report Generation**: Create custom forensic reports
- **Template Library**: Pre-configured report templates
- **Scheduled Reports**: Automated report generation
- **Export Options**: JSON and PDF download formats

## 🔧 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Recharts** - Data visualization
- **Framer Motion** - Animations

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database management
- **SQLite** - Lightweight database
- **Z.ai SDK** - AI-powered analysis

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container deployment
- **ESLint** - Code quality
- **Prettier** - Code formatting

## 🗄️ Database Schema

### Core Models
- **Entity**: Malicious entities with aliases, usernames, emails
- **Post**: TOR forum posts with content and metadata
- **Wallet**: Cryptocurrency wallet addresses and balances
- **Transaction**: Blockchain transactions with suspicious flags
- **EntityLink**: Relationships between entities
- **ExtractedEntity**: Auto-extracted entities from posts
- **ForensicReport**: Generated investigation reports

## 🤖 AI Features

### Stylometry Analysis
- Writing pattern comparison
- Authorship attribution
- Similarity scoring
- Vocabulary analysis

### Entity Extraction
- Username and alias detection
- Email address extraction
- Cryptocurrency wallet identification
- Phone number and URL detection

### Risk Assessment
- Threat level evaluation
- Malicious behavior detection
- Risk factor identification
- Mitigation recommendations

## 📈 Demo Data

The application includes comprehensive sample data for demonstration:
- **5 Sample Entities** with varying risk levels
- **Sample Forum Posts** from TOR networks
- **Cryptocurrency Wallets** with different currencies
- **Transaction History** with suspicious activity flags
- **Entity Relationships** showing connections

## 🔒 Security Features

- **Input Validation**: All user inputs validated with Zod schemas
- **Type Safety**: End-to-end TypeScript implementation
- **Database Security**: Parameterized queries with Prisma ORM
- **API Security**: Proper error handling and response sanitization

## 🚀 Deployment

### Production Deployment
1. **Environment Variables**
```bash
NODE_ENV=production
DATABASE_URL="file:./production.db"
```

2. **Build and Start**
```bash
npm run build
npm start
```

### Cloud Deployment
The application can be deployed to any cloud platform that supports Node.js:
- **Vercel** (Recommended for Next.js)
- **AWS Elastic Beanstalk**
- **Google Cloud Platform**
- **Azure App Service**

## 📊 Performance Considerations

- **Database Optimization**: Indexed queries for fast search
- **Frontend Optimization**: Lazy loading and code splitting
- **API Optimization**: Pagination and efficient data retrieval
- **Caching**: Strategic caching for frequently accessed data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Hackathon Notes

### Demo Preparation
- Use the `/api/sample-data` endpoint to load demo data
- The AI features require the Z.ai SDK to be properly configured
- All visualizations are interactive and responsive
- Sample reports can be generated through the Reports tab

### Key Demo Points
1. **Entity Search**: Show real-time search capabilities
2. **Blockchain Graph**: Demonstrate wallet connection visualization
3. **AI Analysis**: Showcase stylometry and entity extraction
4. **Report Generation**: Generate and download forensic reports

### Architecture Overview
- Frontend: Next.js with TypeScript and Tailwind CSS
- Backend: Next.js API routes with Prisma ORM
- Database: SQLite for easy deployment
- AI Integration: Z.ai SDK for advanced analysis
- Deployment: Docker containerization

---

Built with ❤️ for cyber security and forensic analysis. 
Demo-ready for hackathon presentations and security conferences.
