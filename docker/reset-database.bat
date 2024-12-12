echo "Resetting the database..."
docker-compose down
echo "Removed the database..."
timeout /t 1 /nobreak
docker-compose up -d
echo "Created the database..."