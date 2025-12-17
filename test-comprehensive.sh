#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║      E-Paper Viewer - Comprehensive Test Suite                ║"
echo "║                                                                ║"
echo "║  Testing: Image loading, API responses, page rendering        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

test_case() {
  local name=$1
  local result=$2

  if [ "$result" -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $name"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $name"
    ((FAILED++))
  fi
}

# Test 1: Server is running
echo "Test Group 1: Server Health"
curl -s -I http://localhost:3001/ > /dev/null 2>&1
test_case "Server responds to requests" $?

# Test 2: API endpoints
echo ""
echo "Test Group 2: API Endpoints"

# Test editions list
curl -s http://localhost:3001/api/editions | grep -q '"editionNumber"'
test_case "GET /api/editions returns editions" $?

# Test specific edition
curl -s http://localhost:3001/api/editions/2024-12-09 | grep -q '"date":"2024-12-09'
test_case "GET /api/editions/[date] returns correct edition" $?

# Test image API
curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/api/image?path=%2Feditions%2FEdition%2026%2FSA%20NEWS%20-%20V1%20-%20E26%20-%2001.jpg" | grep -q "200"
test_case "GET /api/image returns 200 OK" $?

# Test 3: Image content
echo ""
echo "Test Group 3: Image Content"

# Test image is valid JPEG
curl -s -o /tmp/test.jpg "http://localhost:3001/api/image?path=%2Feditions%2FEdition%2026%2FSA%20NEWS%20-%20V1%20-%20E26%20-%2001.jpg"
file /tmp/test.jpg | grep -q "JPEG"
test_case "Image file is valid JPEG" $?

# Test image size
IMG_SIZE=$(stat -f%z /tmp/test.jpg 2>/dev/null || stat -c%s /tmp/test.jpg 2>/dev/null)
[ "$IMG_SIZE" -gt 8000000 ] 2>/dev/null
test_case "Image size is reasonable (>8MB)" $?

# Test 4: All editions accessible
echo ""
echo "Test Group 4: All Editions"

EDITION_COUNT=$(curl -s http://localhost:3001/api/editions | grep -o '"editionNumber"' | wc -l)
[ "$EDITION_COUNT" -eq 6 ]
test_case "All 6 editions are accessible" $?

# Test each edition's pages
for date in "2024-06-17" "2024-09-16" "2024-11-11" "2024-11-18" "2024-12-02" "2024-12-09"; do
  PAGES=$(curl -s "http://localhost:3001/api/editions/$date" | grep -o '"pageNumber"' | wc -l)
  [ "$PAGES" -gt 0 ]
  test_case "Edition $date has pages ($PAGES pages)" $?
done

# Test 5: Page rendering
echo ""
echo "Test Group 5: Page Rendering"

# Test home page loads
curl -s http://localhost:3001/ | grep -q "DOCTYPE"
test_case "Home page renders (/) " $?

# Test edition page loads
curl -s http://localhost:3001/2024-12-09/fullpaper | grep -q "DOCTYPE"
test_case "Edition page renders (/2024-12-09/fullpaper)" $?

# Test 6: Content validation
echo ""
echo "Test Group 6: Content Validation"

# Test pages have image URLs
IMAGES=$(curl -s "http://localhost:3001/api/editions/2024-12-09" | grep -o '"imageUrl":"/api/image' | wc -l)
[ "$IMAGES" -eq 6 ]
test_case "Pages have image URLs ($IMAGES images)" $?

# Test image URLs are properly encoded
curl -s "http://localhost:3001/api/editions/2024-12-09" | grep -q "%2Feditions%2F"
test_case "Image URLs are properly URL encoded" $?

# Test 7: Error handling
echo ""
echo "Test Group 7: Error Handling"

# Test invalid edition returns 404
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/api/editions/2025-01-01")
[ "$STATUS" = "404" ]
test_case "Invalid edition returns 404" $?

# Test invalid image path is rejected
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/api/image?path=%2Fetc%2Fpasswd")
[ "$STATUS" != "200" ]
test_case "Invalid image path is rejected" $?

# Test 8: Performance
echo ""
echo "Test Group 8: Performance"

# Test API response time (should be <1000ms)
START=$(date +%s%N)
curl -s http://localhost:3001/api/editions > /dev/null
END=$(date +%s%N)
DURATION=$((($END - $START) / 1000000))
[ "$DURATION" -lt 1000 ]
test_case "API responds in <1000ms ($DURATION ms)" $?

# Test image delivery time (should be <500ms)
START=$(date +%s%N)
curl -s -o /dev/null "http://localhost:3001/api/image?path=%2Feditions%2FEdition%2026%2FSA%20NEWS%20-%20V1%20-%20E26%20-%2001.jpg"
END=$(date +%s%N)
DURATION=$((($END - $START) / 1000000))
[ "$DURATION" -lt 500 ]
test_case "Image delivery <500ms ($DURATION ms)" $?

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                        Test Summary                            ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo -e "║  ${GREEN}Passed: $PASSED${NC}"
echo -e "║  ${RED}Failed: $FAILED${NC}"
echo "║                                                                ║"

if [ "$FAILED" -eq 0 ]; then
  echo "║  ${GREEN}✓ ALL TESTS PASSED - VIEWER IS PRODUCTION READY!${NC}       ║"
else
  echo "║  ${RED}✗ SOME TESTS FAILED - CHECK CONFIGURATION${NC}              ║"
fi

echo "╚════════════════════════════════════════════════════════════════╝"

exit $FAILED
