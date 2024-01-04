import Dexie, { Collection } from 'dexie';

export interface TableSchema {
    name: string;
    schema: string;
}

export interface DexieTableSchema {
    name: string;
    primaryKey: {src: string};
    indexes: { src: string }[];
}

export interface FilterDelegate {
    (dbSet: Dexie.Table): Collection;
}
