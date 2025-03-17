export interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: File | null;
  coverImagePreview: string;
}

export interface PinataMetadata {
  name?: string;
  keyvalues?: Record<string, string>;
}

export interface PinataOptions {
  cidVersion?: number;
  customPinPolicy?: any;
}

export interface PinataParams {
  pinataMetadata?: PinataMetadata;
  pinataOptions?: PinataOptions;
}

export interface PinataResponse {
  success: boolean;
  ipfsHash: string;
  pinataUrl: string;
}

export interface ArticleSubmissionData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  ipfsHash: string;
  author: string;
}