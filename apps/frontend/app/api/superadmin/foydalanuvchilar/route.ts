import { NextRequest } from 'next/server';
import { usersGET } from '../../admin/_proxy';
export const GET = (_req: NextRequest) => usersGET();
