export type FileNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
  isActive?: boolean;
  nodeType?: 'spec' | 'change' | 'archive' | 'config' | 'artifact';
  path?: string;
};

const buildPaths = (nodes: FileNode[], parentPath = ''): FileNode[] => {
  return nodes.map(node => {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
    const updatedNode = { ...node, path: currentPath };
    if (updatedNode.children) {
      updatedNode.children = buildPaths(updatedNode.children, currentPath);
    }
    return updatedNode;
  });
};

const rawTree: FileNode[] = [
  {
    id: 'os-root',
    name: 'openspec',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: 'os-specs',
        name: 'specs',
        type: 'folder',
        isOpen: true,
        nodeType: 'spec',
        children: [
          {
            id: 'spec-auth',
            name: 'auth',
            type: 'folder',
            isOpen: false,
            nodeType: 'spec',
            children: [{ id: 'spec-auth-md', name: 'spec.md', type: 'file', nodeType: 'spec' }]
          },
          {
            id: 'spec-payments',
            name: 'payments',
            type: 'folder',
            isOpen: false,
            nodeType: 'spec',
            children: [{ id: 'spec-payments-md', name: 'spec.md', type: 'file', nodeType: 'spec' }]
          }
        ]
      },
      {
        id: 'os-changes',
        name: 'changes',
        type: 'folder',
        isOpen: true,
        nodeType: 'change',
        children: [
          {
            id: 'change-email',
            name: 'email-opt-in',
            type: 'folder',
            isOpen: true,
            nodeType: 'change',
            children: [
              { id: 'change-email-prop', name: 'proposal.md', type: 'file', nodeType: 'artifact' },
              { id: 'change-email-spec', name: 'specs', type: 'folder', isOpen: true, nodeType: 'artifact', children: [
                { id: 'change-email-spec-auth', name: 'auth', type: 'folder', isOpen: true, nodeType: 'artifact', children: [
                  { id: 'change-email-spec-auth-md', name: 'spec.md', type: 'file', nodeType: 'artifact' }
                ]}
              ]},
              { id: 'change-email-des', name: 'design.md', type: 'file', nodeType: 'artifact' },
              { id: 'change-email-tsk', name: 'tasks.md', type: 'file', nodeType: 'artifact' },
            ]
          }
        ]
      },
      {
        id: 'os-archive',
        name: 'archive',
        type: 'folder',
        isOpen: false,
        nodeType: 'archive',
        children: [
          {
            id: 'archive-old',
            name: 'v1-migration',
            type: 'folder',
            isOpen: false,
            nodeType: 'archive',
            children: [
              { id: 'archive-old-prop', name: 'proposal.md', type: 'file', nodeType: 'archive' }
            ]
          }
        ]
      },
      { id: 'os-config', name: 'config.yaml', type: 'file', nodeType: 'config' }
    ]
  }
];

export const INITIAL_FILE_TREE = buildPaths(rawTree);

export const MOCK_FILE_CONTENT: Record<string, string[]> = {
  'change-email-prop': [
    '# Proposal: Email Opt-in',
    '',
    '## Why',
    'We need a way to capture user interest before the official launch. An email opt-in form will allow us to build a waitlist and notify users when we go live.',
    '',
    '## What',
    '- A simple landing page with an email input field.',
    '- Backend endpoint to store emails.',
    '- Duplicate prevention to avoid spamming the same user.',
    '- Confirmation email sent upon successful subscription.'
  ],
  'change-email-spec-auth-md': [
    '# Delta Spec: Auth Domain',
    '',
    '## Added Requirements',
    '- **[AUTH-005]** The system MUST allow anonymous users to submit their email for the waitlist.',
    '- **[AUTH-006]** The system MUST validate the email format before accepting the submission.',
    '- **[AUTH-007]** The system MUST NOT reveal whether an email is already subscribed to prevent enumeration attacks, but should silently ignore duplicates internally.'
  ],
  'change-email-des': [
    '# Design: Email Opt-in', 
    '',
    '## Architecture', 
    'Frontend: React + Tailwind CSS', 
    'Backend: Hono + Cloudflare Workers',
    'Database: D1 (SQLite)',
    '',
    '## Data Model',
    '```sql',
    'CREATE TABLE subscribers (',
    '  id TEXT PRIMARY KEY,',
    '  email TEXT UNIQUE NOT NULL,',
    '  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    ');',
    '```'
  ],
  'change-email-tsk': [
    '# Implementation Plan', 
    '',
    '## 1. Set up backend API foundation', 
    '- [x] Create subscription data types and interfaces in the Hono server', 
    '- [x] Set up in-memory storage structure for subscribers',
    '- [x] Configure CORS middleware for frontend-backend communication',
    '- _Requirements: AUTH-005_',
    '',
    '## 2. Implement backend subscription endpoint',
    '',
    '### 2.1 Create POST /api/subscribe endpoint with request validation',
    '- [ ] Implement email format validation',
    '- [ ] Add request body parsing and validation',
    '- _Requirements: AUTH-006_',
    '',
    '### 2.2 Implement subscriber storage and duplicate prevention',
    '- [ ] Create subscriber storage functions',
    '- [ ] Add duplicate email detection logic',
    '- _Requirements: AUTH-007_'
  ],
  'spec-auth-md': [
    '# Auth Domain Spec',
    '',
    'This is the source of truth for the Auth domain.',
    '',
    '## Current Requirements',
    '- **[AUTH-001]** Users can log in with email and password.',
    '- **[AUTH-002]** Passwords must be hashed using bcrypt.',
    '- **[AUTH-003]** Sessions expire after 24 hours.',
    '- **[AUTH-004]** Failed login attempts are rate-limited.'
  ],
  'spec-payments-md': [
    '# Payments Domain Spec',
    '',
    'This is the source of truth for the Payments domain.',
    '',
    '## Current Requirements',
    '- **[PAY-001]** Payments are processed via Stripe.',
    '- **[PAY-002]** Subscriptions are billed monthly.',
    '- **[PAY-003]** Failed payments trigger a dunning process.'
  ],
  'archive-old-prop': [
    '# Proposal: v1 Migration',
    '',
    'This proposal has been archived as the migration is complete.'
  ],
  'os-config': [
    'project: kiro-app',
    'version: 1.0.0',
    'domains:',
    '  - auth',
    '  - payments'
  ]
};
