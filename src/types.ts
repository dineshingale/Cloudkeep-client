export interface Block {
    id: string;
    type: 'note' | 'media';
    content: string;
    file?: File;
}

export interface Thought {
    id: string;
    title: string;
    timestamp: string;
    blocks: Block[];
    score?: number;
}

export interface ApiRecord {
    _id: string;
    title?: string;
    createdAt?: string;
    fileUrl?: string;
    body?: string;
    score?: number;
}
