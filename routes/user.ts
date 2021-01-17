import type { Group } from 'https://deno.land/x/abc/mod.ts';

import { create, get, login } from '../controllers/user.ts';
import jwt from '../middleware/jwt.ts';

export default (group: Group): void => {
    group.get('/:id', get, jwt);
    group.post('/new', create);
    group.post('/login', login);
}