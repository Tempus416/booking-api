# Backend
cd $env:USERPROFILE\booking-engine\booking-api
@"
# Booking API (NestJS)

Backend for the booking engine.

## Dev
npm run start:dev   # http://localhost:3002

## Endpoint(s)
- GET /  → "Hello World!"
"@ | Set-Content -Encoding utf8 README.md

git add README.md
git commit -m "Replace Nest template README"
git push
