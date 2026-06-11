import { NextRequest } from 'next/server';
import { psixologlarGET, psixologlarPOST } from '../_proxy';
export const GET = () => psixologlarGET();
export const POST = (req: NextRequest) => psixologlarPOST(req);
