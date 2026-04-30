export interface WishlistItem {
    id: string;
    user_id: string;
    couple_id: string;
    title: string;
    description: string | null;
    link: string | null;
    category: string | null;
    is_secret: boolean;
    status: 'open' | 'bought' | 'archived' | 'in_progress';
    created_at: string;
}
