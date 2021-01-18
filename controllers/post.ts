import { Post, User } from '../models/index.ts';

import StatusInterface from '../interfaces/status.ts';
import PostInterface from "../interfaces/post.ts";
import JWTPayloadInterface from "../interfaces/jwt-payload.ts";
import { Status } from "https://deno.land/std@0.81.0/http/http_status.ts";
import { Context } from "https://deno.land/x/abc@v1.2.4/context.ts";

const create = async (context: Context): Promise<PostInterface | StatusInterface | any> => {
    try {
        const {
            content = '',
            title = '',
            image = '',
            slug = ''
        }: PostInterface = await context.body as PostInterface;

        if (
            !content ||
            !title ||
            !image ||
            !slug
        ) return context.json(
            {
                status: 'error',
                message: 'Error creating post'
            },
            Status.BadRequest
        );

        const jwt: JWTPayloadInterface = context.get('jwt-payload') as JWTPayloadInterface;

        const post: PostInterface = await Post.create({
            content,
            title,
            image,
            slug,
            userId: jwt.user?.id as number,
        }) as PostInterface;

        return context.json(
            {
                status: 'success',
                message: 'Created Post',
                post
            }
        );
    } catch (error) {
        return context.json(
            {
                status: 'error',
                message: 'Error creating post'
            },
            Status.InternalServerError
        );
    }
}

const get = async (context: Context): Promise<PostInterface | StatusInterface | any> => {
    try {
        const {
            page = 0,
            limit = 50
        }: { page?: number, limit?: number } = context.queryParams;

        const posts: Post | Post[] = await Post
            .offset((page * limit))
            .limit(limit as number)
            .select(
                User.field('name', 'user_name'),
                Post.field('slug'),
                Post.field('content'),
                Post.field('title'),
                Post.field('image'),
                Post.field('created_at'),
                Post.field('updated_at')
            )
            .join(
                User,
                User.field('id'),
                Post.field('user_id')
            )
            .get() as Post | Post[];

        const totalPosts: number | undefined = await Post.count();

        return context.json(
            {
                status: 'success',
                message: 'Fetched Posts',
                posts,
                limit,
                page,
                total: totalPosts
            }
        );
    } catch (error) {
        return context.json(
            {
                status: 'error',
                message: 'Failed to fetch posts',
            },
            Status.InternalServerError
        );
    }
}

const getOne = async (context: Context): Promise<PostInterface | StatusInterface | any> => {
    try {
        const { id } = context.params;

        if (!id) return context.json(
            {
                status: 'error',
                message: 'Invalid Post ID'
            },
            Status.BadRequest
        );

        const post: Post = await Post.where({ id }).first() as Post;
        const user: User = await User.select('name').find(post.userId) as User;

        return context.json(
            {
                status: 'success',
                message: 'Fetched Post',
                post,
                user: {
                    ...user
                }
            }
        );
    } catch (error) {
        return context.json(
            {
                status: 'error',
                message: 'Failed to fetch post'
            },
            Status.InternalServerError
        );
    }
}

export {
    create,
    get,
    getOne,
}