import '@testing-library/jest-dom';

// Jest + jsdom environment already provides most globals.
// For NextRequest/NextResponse, we'll use node's fetch API (Node 18+)
// If needed, the individual tests can mock next/server
