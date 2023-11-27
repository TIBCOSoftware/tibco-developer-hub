# 11 Endpoints

# Call 1 (Create Books)
echo "1] Calling http://localhost:8080/books (POST)"
curl -X 'POST' \
  'http://localhost:8080/books' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{  "Book": [    {      "isbn": "1234",      "name": "My TEST Book",      "description": "a book for testing",      "authorName": "tester",      "releaseDate": "2023-10-18",      "vintage": true,      "signed": true,      "price": 0    }  ]}'


# Call 2 (Get Books)
echo "\n2] Calling http://localhost:8080/books (GET)"
curl -X 'GET' \
  'http://localhost:8080/books' \
  -H 'accept: application/json'

# Call 3 (Get Books)
echo "\n3] Calling http://localhost:8080/book/1234 (GET)"
curl -X 'GET' \
  'http://localhost:8080/book/1234' \
  -H 'accept: application/json'

