export interface Client {
  id: string;
  name: string;
  email?: string;
  color: string;
  platforms: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  clientId: string;
  content: string;
  scheduledDate: string;
  platform: string;
  status: 'draft' | 'scheduled' | 'published';
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
}

