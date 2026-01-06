export interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

export interface User {
    name: string;
    age: number;
    role: string;
}

export interface Activity {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    colorClass: string;
    path: string;
}