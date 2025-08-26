# Lens Auth Endpoint

A simple authentication endpoint for Lens Protocol integration, built as a Vercel serverless function.

## Features

- Serverless authentication endpoint
- Multiple authentication methods (header, query parameter, or body)
- Environment variable configuration
- TypeScript support

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `LENS_AUTH_SECRET`: Your authentication secret

## Usage

The endpoint accepts authentication via:
- Header: `x-lens-secret`
- Query parameter: `?secret=your_secret`
- Request body: `{ "secret": "your_secret" }`

## Deployment

This project is designed to be deployed on Vercel as a serverless function.

## License

MIT
