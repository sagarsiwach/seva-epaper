#!/bin/bash

echo "=== E-Paper Viewer Test Suite ==="
echo ""

# Test 1: API returns editions
echo "Test 1: Check if API returns editions..."
EDITIONS=$(curl -s http://localhost:3001/api/editions?limit=1 | grep -o '"editionNumber"' | wc -l)
if [ "$EDITIONS" -gt 0 ]; then
  echo "✓ API returns editions"
else
  echo "✗ API did not return editions"
  exit 1
fi

# Test 2: Edition has correct date
echo ""
echo "Test 2: Check if edition has date..."
DATE=$(curl -s http://localhost:3001/api/editions/2024-12-09 | grep -o '"date":"2024-12-09' | wc -l)
if [ "$DATE" -gt 0 ]; then
  echo "✓ Edition has correct date"
else
  echo "✗ Edition date incorrect"
  exit 1
fi

# Test 3: Edition has sections with pages
echo ""
echo "Test 3: Check if edition has pages with image URLs..."
PAGES=$(curl -s http://localhost:3001/api/editions/2024-12-09 | grep -o '"imageUrl":"/api/image' | wc -l)
if [ "$PAGES" -gt 0 ]; then
  echo "✓ Edition has $PAGES pages with API image URLs"
else
  echo "✗ Edition has no pages"
  exit 1
fi

# Test 4: Image API returns valid image
echo ""
echo "Test 4: Check if image API returns valid JPEG..."
IMG_SIZE=$(curl -s -o /tmp/test.jpg -w "%{size_download}" "http://localhost:3001/api/image?path=%2Feditions%2FEdition%2026%2FSA%20NEWS%20-%20V1%20-%20E26%20-%2001.jpg")
FILE_TYPE=$(file /tmp/test.jpg | grep -o "JPEG" | wc -l)
if [ "$FILE_TYPE" -gt 0 ] && [ "$IMG_SIZE" -gt 100000 ]; then
  echo "✓ Image API returns valid JPEG ($IMG_SIZE bytes)"
else
  echo "✗ Image API did not return valid JPEG"
  exit 1
fi

# Test 5: Edition page loads without errors
echo ""
echo "Test 5: Check if edition page loads..."
PAGE_SIZE=$(curl -s http://localhost:3001/2024-12-09/fullpaper | wc -c)
if [ "$PAGE_SIZE" -gt 5000 ]; then
  echo "✓ Edition page loads ($PAGE_SIZE bytes)"
else
  echo "✗ Edition page is too small or missing"
  exit 1
fi

# Test 6: All images in edition are accessible
echo ""
echo "Test 6: Check if all images in edition are accessible..."
IMAGE_URLS=$(curl -s http://localhost:3001/api/editions/2024-12-09 | grep -o '"imageUrl":"[^"]*"' | sed 's/"imageUrl":"//' | sed 's/"$//')
WORKING=0
TOTAL=0
while IFS= read -r URL; do
  TOTAL=$((TOTAL + 1))
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001${URL}")
  if [ "$STATUS" = "200" ]; then
    WORKING=$((WORKING + 1))
  else
    echo "  ✗ Image failed: ${URL:0:80}... (HTTP $STATUS)"
  fi
done <<< "$IMAGE_URLS"

if [ "$WORKING" = "$TOTAL" ]; then
  echo "✓ All $TOTAL images are accessible"
else
  echo "✗ Only $WORKING/$TOTAL images are accessible"
  exit 1
fi

echo ""
echo "=== All Tests Passed! ==="
echo "The e-paper viewer is ready to use:"
echo "  Home page: http://localhost:3001/"
echo "  Edition 26: http://localhost:3001/2024-12-09/fullpaper"
