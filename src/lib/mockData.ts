export type FileNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
  isActive?: boolean;
};

export const INITIAL_FILE_TREE: FileNode[] = [
  {
    id: '1',
    name: '.kiro',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: '1-1',
        name: 'specs',
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: '1-1-1',
            name: 'email-opt-in',
            type: 'folder',
            isOpen: true,
            children: [
              { id: 'req', name: 'requirements.md', type: 'file' },
              { id: 'des', name: 'design.md', type: 'file' },
              { id: 'tsk', name: 'tasks.md', type: 'file', isActive: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'src',
    type: 'folder',
    isOpen: false,
    children: [
      { id: 'idx', name: 'index.ts', type: 'file' },
    ],
  },
  { id: 'pkg', name: 'package.json', type: 'file' },
];

export const MOCK_FILE_CONTENT: Record<string, string[]> = {
  'req': [
    '# Requirements', 
    '1. User must be able to subscribe via email.', 
    '2. System must prevent duplicate subscriptions.',
    '3. Send confirmation email upon successful opt-in.'
  ],
  'des': [
    '# Design', 
    '## Architecture', 
    'Frontend: React + Tailwind CSS', 
    'Backend: Hono + Cloudflare Workers',
    'Database: D1 (SQLite)'
  ],
  'tsk': [
    '# Implementation Plan', 
    '',
    '1. Set up backend API foundation', 
    '- Create subscription data types and interfaces in the Hono server', 
    '- Set up in-memory storage structure for subscribers',
    '- Configure CORS middleware for frontend-backend communication',
    '- _Requirements: 2.1, 2.2, 2.3_',
    '',
    '2. Implement backend subscription endpoint',
    '',
    '2.1 Create POST /api/subscribe endpoint with request validation',
    '- Implement email format validation',
    '- Add request body parsing and validation',
    '- _Requirements: 2.1, 2.2_',
    '',
    '2.2 Implement subscriber storage and duplicate prevention',
    '- Create subscriber storage functions',
    '- Add duplicate email detection logic'
  ],
  'idx': [
    'import { Hono } from "hono";', 
    'const app = new Hono();', 
    'app.post("/api/subscribe", async (c) => {', 
    '  const body = await c.req.json();',
    '  return c.json({ success: true, email: body.email });', 
    '});', 
    'export default app;'
  ],
  'pkg': [
    '{', 
    '  "name": "kiro-app",', 
    '  "version": "1.0.0",', 
    '  "dependencies": {', 
    '    "react": "^18.2.0",', 
    '    "hono": "^4.0.0"', 
    '  }', 
    '}'
  ]
};
