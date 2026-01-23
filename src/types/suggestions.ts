export interface Suggestion {
    id: string;
    user_id: string | null;
    content: string;
    status: 'pending' | 'reviewed' | 'implemented';
    created_at: string;
}
