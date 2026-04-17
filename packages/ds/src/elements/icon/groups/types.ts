import type React from 'react';

import type { TIcon, TIconGroup } from '../types';

export type TIconGroupIcons = Record<TIcon, React.ReactNode>;

export type TIconGroups = Record<TIconGroup, Partial<TIconGroupIcons>>;