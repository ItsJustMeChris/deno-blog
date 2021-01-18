import type { Group } from 'https://deno.land/x/abc/mod.ts';

import { create, get, getById, getBySlug } from '../controllers/post.ts';
import jwt from '../middleware/jwt.ts';

export default (group: Group): void => {
    group.post('/new', create, jwt);
    group.get('/id/:id', getById);
    group.get('/slug/:id', getBySlug);
    group.get('/', get);
}