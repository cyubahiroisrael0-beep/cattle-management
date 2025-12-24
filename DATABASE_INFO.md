# Database Information

## Database Location

The SQLite database file is located at:
```
backend/database.sqlite
```

Full path: `C:\Users\Cyubahiro Israel\Desktop\Cattle management\backend\database.sqlite`

## Database Status

✅ **Database file exists and is working correctly**

### Tables Created:
- `users` - Stores user accounts and authentication data
- `animals` - Stores animal records (cows and goats)

## Verify Database

To check the database status, run:
```bash
cd backend
npm run check-db
```

## Database Initialization

The database is automatically created and initialized when you start the backend server:

```bash
cd backend
npm start
```

You should see these messages:
```
Connected to SQLite database at: [path]
Users table ready
Animals table ready
Database initialized successfully
```

## Troubleshooting

### If database file is not found:

1. **Make sure you've started the backend server at least once**
   - The database file is created automatically on first run

2. **Check the database path**
   - Default: `backend/database.sqlite`
   - Can be changed via `DB_PATH` in `.env` file

3. **Check file permissions**
   - Ensure the backend directory has write permissions

4. **Run the check script**
   ```bash
   cd backend
   npm run check-db
   ```

## Database File Size

- Empty database: ~8-16 KB
- With data: Grows as you add records
- Current size: 24,576 bytes (24 KB)

## Backup Database

To backup your database:
```bash
# Windows PowerShell
Copy-Item backend\database.sqlite backend\database.sqlite.backup

# Linux/Mac
cp backend/database.sqlite backend/database.sqlite.backup
```

## Reset Database

To reset the database (⚠️ **WARNING: This deletes all data**):
1. Stop the backend server
2. Delete `backend/database.sqlite`
3. Restart the server - it will create a fresh database

