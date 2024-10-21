echo "Resetting the database..."
docker-compose down
echo "Removed the database..."
sleep 1
docker-compose up -d
echo "Created the database..."