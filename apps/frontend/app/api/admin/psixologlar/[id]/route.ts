import { NextRequest } from 'next/server';
import { psixologlarPATCH, psixologlarDELETE } from '../../_proxy';
export const PATCH = (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => params.then(p => psixologlarPATCH(req, p.id));
export const DELETE = (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => params.then(p => psixologlarDELETE(req, p.id));
