import { DataTypes, Model, Relationships } from 'https://deno.land/x/denodb/mod.ts';
import { User } from '../models/index.ts';

export default class Post extends Model {
    static table: string = 'posts';
    static timestamps: boolean = true;

    static fields: any = {
        id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
        slug: { unique: true, type: DataTypes.STRING, allowNull: false },
        title: { unique: true, type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.TEXT },
        image: { type: DataTypes.STRING },
        userId: Relationships.belongsTo(User),
    };

    id!: number;
    slug!: string;
    title!: string;
    content!: string;
    image!: string;
    userId!: number;

    static user() {
        return this.hasOne(User);
    }
};