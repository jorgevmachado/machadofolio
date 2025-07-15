export const EStatus = {
    ACTIVE: 'ACTIVE',
    COMPLETE: 'COMPLETE',
    INACTIVE: 'INACTIVE',
    INCOMPLETE: 'INCOMPLETE',
} as const;

export type EStatus = typeof EStatus[keyof typeof EStatus];

export const ERole = {
    ADMIN: 'ADMIN',
    USER: 'USER',
} as const;

export type ERole = typeof ERole[keyof typeof ERole];