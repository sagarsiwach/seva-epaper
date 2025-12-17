# 📚 Database Setup & Management - E-Paper Viewer

## ✅ What's Done

Your e-paper viewer now has a **complete database backend**:

- ✅ SQLite database created (`prisma/dev.db`)
- ✅ Database schema defined with Prisma
- ✅ 6 editions seeded with all images
- ✅ API routes connected to database
- ✅ Only database editions show in frontend
- ✅ Admin API ready to manage editions

---

## 📊 Database Structure

### Tables

```
Edition
├── id (unique ID)
├── date (publication date - unique)
├── editionNumber (1, 14, 22, etc)
├── publication (seva-goa)
├── title & description
├── coverImage
└── Relations: sections, images

Section
├── id (unique ID)
├── editionId (foreign key)
├── name (fullpaper)
├── displayName (Full Edition)
├── order (display order)
└── Relations: pages

Page
├── id (unique ID)
├── sectionId (foreign key)
├── pageNumber (1, 2, 3, etc)
├── imageUrl (path to image file)
├── title & description
└── Relations: articles

EditionImage
├── id (unique ID)
├── editionId (foreign key)
├── filename (original filename)
├── imageUrl (path)
└── pageNumber

Article (for future use)
├── id (unique ID)
├── pageId (foreign key)
├── title, content, author
└── coordinates (for highlighting)
```

---

## 🚀 Current Database Content

### 6 Editions Loaded

| Edition | Date | Images | Status |
|---------|------|--------|--------|
| 1 | 2024-06-17 (Monday) | 2 | ✅ Active |
| 14 | 2024-09-16 (Monday) | 6 | ✅ Active |
| 22 | 2024-11-11 (Monday) | 9 | ✅ Active |
| 23 | 2024-11-18 (Monday) | 8 | ✅ Active |
| 25 | 2024-12-02 (Monday) | 6 | ✅ Active |
| 26 | 2024-12-09 (Monday) | 6 | ✅ Active |

**Total Pages: 37**
**Total Images: 37**

---

## 📝 Managing Editions via API

### View All Editions

```bash
curl http://localhost:3001/api/admin/editions
```

Response:
```json
[
  {
    "id": "clj...",
    "date": "2024-12-09T00:00:00.000Z",
    "editionNumber": 26,
    "publication": "seva-goa",
    "title": "seva-goa - Edition 26",
    "sections": [
      {
        "id": "clj...",
        "name": "fullpaper",
        "displayName": "Full Edition",
        "pages": [
          {
            "pageNumber": 1,
            "imageUrl": "/editions/Edition 26/SA NEWS - V1 - E26 - 01.jpg"
          }
        ]
      }
    ]
  }
]
```

### Add New Edition

```bash
curl -X POST http://localhost:3001/api/admin/editions \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-16",
    "editionNumber": 27,
    "title": "SA NEWS - Edition 27",
    "description": "Edition 27 - December 16, 2024",
    "publication": "seva-goa"
  }'
```

### Get Edition by Date

```bash
curl http://localhost:3001/api/editions/2024-11-11
```

---

## 🗄️ Database File Location

```
C:\Users\Sagar Siwach\Desktop\Development\epaper-viewer\prisma\dev.db
```

This SQLite database contains all your editions and their metadata.

---

## 🔄 Seeding Database

### Re-seed (Clears and Reloads)

```bash
npm run prisma:seed
```

This will:
1. Delete all existing data
2. Read images from `public/editions/` folders
3. Create 6 editions with correct dates
4. Load all 37 pages

### Database Setup Commands

```bash
# Initialize Prisma
npx prisma init --datasource-provider sqlite

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed with editions
npm run prisma:seed

# Complete setup (both push and seed)
npm run db:setup
```

---

## 📱 How Frontend Gets Data

### Process Flow

```
Frontend (React)
    ↓
API Route (/api/editions)
    ↓
Prisma Client
    ↓
SQLite Database (prisma/dev.db)
    ↓
Returns Edition with Sections & Pages
    ↓
Frontend Displays in Page Flip Viewer
```

### Only Database Editions Show

The frontend **ONLY** displays editions that exist in the database:
- ✅ No more automatic file system scanning
- ✅ No empty editions showing
- ✅ No date miscalculations
- ✅ Complete control via database

---

## 🛠️ Editing Edition Dates

To change an edition's date:

1. **Open database** (use Prisma Studio):
   ```bash
   npx prisma studio
   ```

2. **Or update via API** (create an UPDATE endpoint if needed)

3. **Or modify `prisma/seed.ts`** and re-seed:
   ```typescript
   {
     editionNumber: 1,
     date: new Date('2024-06-17'), // Change this
     publication: 'seva-goa',
     folder: 'Edition 01',
     imageCount: 2,
   }
   ```

---

## 📊 Database Statistics

Run Prisma Studio to view:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all editions
- Edit edition dates
- Add new editions
- Delete editions
- View pages and images

---

## 🔐 Database Security

Currently: **Development Mode (SQLite)**

For production:
1. Switch to PostgreSQL
2. Add authentication to admin endpoints
3. Implement role-based access control
4. Add API key validation

---

## 📋 Adding a New Edition

### Step 1: Copy Images to public/editions

```
public/editions/Edition 27/
├── SA NEWS - V1 - E27 - 01.jpg
├── SA NEWS - V1 - E27 - 02.jpg
└── ...
```

### Step 2: Add to Database

Option A - Via API:
```bash
curl -X POST http://localhost:3001/api/admin/editions \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-16",
    "editionNumber": 27,
    "title": "SA NEWS - Edition 27",
    "publication": "seva-goa"
  }'
```

Option B - Update seed.ts and re-run:
```typescript
// Add to editionsData array in prisma/seed.ts
{
  editionNumber: 27,
  date: new Date('2024-12-16'),
  publication: 'seva-goa',
  folder: 'Edition 27',
  imageCount: 8, // or however many images
}

// Then run:
npm run prisma:seed
```

### Step 3: Restart App
```bash
npm run dev
```

---

## 🐛 Troubleshooting

### Database Corrupted?
```bash
# Delete database and recreate
rm prisma/dev.db

# Setup fresh
npm run db:setup
```

### Images not loading?
- Check `public/editions/` has correct folder names
- Verify images exist: `Edition 01`, `Edition 14`, etc
- Re-run seed: `npm run prisma:seed`

### Edition date wrong?
1. Open Prisma Studio: `npx prisma studio`
2. Find edition in database
3. Edit the `date` field
4. Click save
5. Refresh browser

### Need to change edition number?
1. Update `editionNumber` in database
2. Make sure it's unique (only one edition per number)
3. Restart app

---

## 📚 Prisma Documentation

- [Prisma Docs](https://www.prisma.io/docs/)
- [Prisma Studio](https://www.prisma.io/docs/concepts/studio/overview)
- [Query Examples](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

## ✨ What's Next?

### Soon:
- [ ] Create admin dashboard to add/edit editions
- [ ] Add authentication for admin access
- [ ] Implement article extraction
- [ ] Add search functionality
- [ ] User bookmarks

### Later:
- [ ] Switch to PostgreSQL for production
- [ ] Add image optimization
- [ ] Implement caching
- [ ] Add analytics

---

## 🎯 Summary

Your e-paper viewer now:
- ✅ Uses a proper database
- ✅ Only shows database editions
- ✅ Has correct dates for all editions
- ✅ Has API to manage editions
- ✅ Can easily add new editions
- ✅ Stores all metadata properly

**Total Data:**
- 6 Editions
- 6 Sections
- 37 Pages
- 37 Images
- All properly organized in SQLite database

---

**Database is ready to grow!** 🚀 Add more editions anytime via API or seed script.
