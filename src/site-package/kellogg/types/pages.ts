// import type { Translation } from "@/cms/types";
import type { BlockType, BlockContentMap } from "./blocks";

// export type PageBlock = {
//     [T in BlockType]: {
//         id: string;
//         type: T;
//         content: BlockContentMap[T];
//         isVisible: boolean;
//     };
//     }[BlockType];

// export interface CustomPage {
//     id: string;
//     path: string;
//     title: Translation;
//     isFixed: boolean;
//     type?: "fixed-block" | "dynamic-block" | "fixed-layout";
//     content?: unknown;
//     blocks: PageBlock[];
//     seo?: {
//         title: Translation;
//         description: Translation;
//         keywords?: Translation;
//         targetCountry?: string;
//     };
//     }

// src/site-package/kellogg/types/pages.ts

import type { CmsCustomPage, CmsPageBlock } from '@/cms/types';

export type PageBlock=
  CmsPageBlock<BlockType, BlockContentMap>;

export type CustomPage =
  CmsCustomPage<PageBlock>;