import { Meta } from "./meta.interface";

type mediaType = 'image' | 'video' | 'audio'


export interface Media {
  target_id: number;
  type: mediaType;
  meta: Meta;
  hash_key: string;
}